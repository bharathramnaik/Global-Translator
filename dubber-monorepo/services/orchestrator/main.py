import sys
import types

# Polyfill for cgi module removed in Python 3.13 (needed by older httpx/googletrans versions)
if "cgi" not in sys.modules:
    cgi = types.ModuleType("cgi")
    cgi.parse_header = lambda line: (line, {})
    sys.modules["cgi"] = cgi

import os
import json
import time
import pika
import requests
import threading
from concurrent.futures import ThreadPoolExecutor
from minio import Minio
from minio.error import S3Error
import moviepy.editor as mp
from faster_whisper import WhisperModel
from gtts import gTTS
from googletrans import Translator
from pydub import AudioSegment
import numpy as np

# Configuration
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minio")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minio123")
API_GATEWAY_URL = os.getenv("API_GATEWAY_URL", "http://localhost:8080")

# Setup MinIO
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

def download_file(bucket, object_key, file_path):
    print(f"Downloading {object_key} from {bucket}...")
    minio_client.fget_object(bucket, object_key, file_path)

def upload_file(bucket, object_key, file_path):
    print(f"Uploading {object_key} to {bucket}...")
    minio_client.fput_object(bucket, object_key, file_path)

def update_job(job_id, status=None, progress=None, output_key=None, etr=None, activity=None):
    url = f"{API_GATEWAY_URL}/api/v1/job/{job_id}"
    data = {}
    if status: data['status'] = status
    if progress is not None: data['progress'] = progress
    if output_key: data['outputObjectKey'] = output_key
    if etr: data['estimatedTimeRemaining'] = etr
    if activity: data['activity'] = activity
    
    try:
        requests.patch(url, json=data)
    except Exception as e:
        print(f"Failed to update job {job_id}: {e}")

def format_seconds(seconds):
    if seconds < 0: return "calculating..."
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    if hrs > 0:
        return f"{hrs}h {mins}m {secs}s"
    return f"{mins}m {secs}s"

class ProgressTracker(threading.Thread):
    def __init__(self, job_id, initial_etr_seconds):
        super().__init__()
        self.job_id = job_id
        self.etr_seconds = initial_etr_seconds
        self.running = True
        self.daemon = True
        self.activity = "Processing..."
        self.progress = 0

    def run(self):
        start_time = time.time()
        while self.running:
            elapsed = time.time() - start_time
            current_etr = max(0, self.etr_seconds - elapsed)
            etr_str = format_seconds(current_etr)
            
            update_job(self.job_id, etr=etr_str, activity=self.activity, progress=self.progress)
            time.sleep(15) # Pulse every 15 seconds

    def stop(self):
        self.running = False

def process_segment(i, segment, job_id, target_lang, final_audio_ref, translator):
    try:
        start_time = segment.start
        end_time = segment.end
        original_text = segment.text.strip()
        
        if not original_text:
            return None

        # Translate Text
        try:
            translated_text = translator.translate(original_text, dest=target_lang).text
        except Exception as e:
            print(f"Translation failed for segment {i}: {e}")
            translated_text = original_text # Fallback

        # Generate TTS
        tts_file = f"seg_{job_id}_{i}.mp3"
        tts = gTTS(text=translated_text, lang=target_lang)
        tts.save(tts_file)
        
        # Load TTS Audio
        seg_audio = AudioSegment.from_mp3(tts_file)
        
        # Timeline Matching
        target_duration_ms = (end_time - start_time) * 1000
        current_duration_ms = len(seg_audio)
        
        if current_duration_ms > 0:
            speed_factor = current_duration_ms / target_duration_ms
            new_sample_rate = int(seg_audio.frame_rate * speed_factor)
            seg_audio = seg_audio._spawn(seg_audio.raw_data, overrides={'frame_rate': new_sample_rate})
            seg_audio = seg_audio.set_frame_rate(44100)

        # Cleanup temp file
        if os.path.exists(tts_file):
            os.remove(tts_file)
            
        return (int(start_time * 1000), seg_audio)
    except Exception as e:
        print(f"Error processing segment {i}: {e}")
        return None

def process_job(ch, method, properties, body):
    job_id = None
    video = None
    tracker = None
    try:
        print(f"Received message: {body[:100]}...")
        job_data = json.loads(body)
        job_id = job_data.get('jobId')
        source_key = job_data.get('sourceObjectKey')
        target_lang = job_data.get('targetLanguage')
        options_json = job_data.get('optionsJson', '{}')
        
        if not job_id:
            print("Received malformed message: missing job_id")
            return

        print(f"Processing Job {job_id}: {source_key} -> {target_lang} (Options: {options_json})")
        update_job(job_id, status="PROCESSING", progress=0, activity="Preparing files...", etr="Calculating...")

        local_input = f"input_{job_id}.mp4"
        local_output = f"output_{job_id}.mp4"
        local_audio_orig = f"audio_{job_id}.wav"
        bucket = "dubber-videos" 

        # 1. Download Video
        update_job(job_id, activity="Downloading source video...", etr="Calculating...")
        try:
             download_file(bucket, source_key, local_input)
        except S3Error as err:
             print(f"File not found in MinIO: {err}")
             update_job(job_id, status="FAILED", activity="Error: File not found")
             return

        update_job(job_id, progress=10, activity="Extracting audio...")

        # 2. Extract Audio
        video = mp.VideoFileClip(local_input)
        video.audio.write_audiofile(local_audio_orig)
        job_duration = video.duration
        
        # Start Heartbeat Thread
        # Heuristic: Processing takes approx same time as video duration with optimizations
        tracker = ProgressTracker(job_id, job_duration)
        tracker.activity = "Transcribing speech (Faster Whispering)..."
        tracker.progress = 20
        tracker.start()

        # 3. ASR (Speech to Text) with Faster Whisper
        tracker.activity = "Loading ASR Model (may download initially)..."
        print("Loading Faster Whisper ASR model...")
        model_size = "base"
        # Run on GPU if available, else CPU
        try:
            model = WhisperModel(model_size, device="cpu", compute_type="int8")
        except Exception as e:
            print(f"Failed to load model: {e}")
            tracker.stop()
            update_job(job_id, status="FAILED", activity="Error: Model Load Failure")
            return

        print("Transcribing audio...")
        tracker.activity = "Transcribing speech (Faster Whispering)..."
        segments_gen, info = model.transcribe(local_audio_orig, beam_size=5)
        segments = list(segments_gen)
        
        tracker.activity = f"Dubbing {len(segments)} segments (Parallel)..."
        tracker.progress = 40

        # 4. Translation & TTS & Timeline Match (Parallel)
        print(f"Processing {len(segments)} segments in parallel...")
        translator = Translator()
        final_audio = AudioSegment.silent(duration=int(job_duration * 1000))
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(process_segment, i, seg, job_id, target_lang, None, translator) 
                       for i, seg in enumerate(segments)]
            
            for i, future in enumerate(futures):
                result = future.result()
                if result:
                    pos_ms, audio = result
                    final_audio = final_audio.overlay(audio, position=pos_ms)
                
                # Update tracker progress and console
                progress_val = int(40 + ((i + 1) / len(segments)) * 40)
                tracker.progress = progress_val
                if (i + 1) % 10 == 0 or (i + 1) == len(segments):
                    print(f"Processed {i+1}/{len(segments)} segments...")
                    update_job(job_id, progress=progress_val, activity=f"Dubbing {i+1}/{len(segments)} segments...")

        tracker.stop()
        
        final_audio_file = f"final_audio_{job_id}.mp3"
        final_audio.export(final_audio_file, format="mp3")
        
        update_job(job_id, progress=85, activity="Merging audio with video (FFMPEG)...", etr="Finalizing...")

        # 5. Merge Audio with Video
        print("Merging audio and video...")
        new_audioclip = mp.AudioFileClip(final_audio_file)
        new_videoclip = video.set_audio(new_audioclip)
        new_videoclip.write_videofile(local_output, codec='libx264', audio_codec='aac')
        
        update_job(job_id, progress=95, activity="Uploading final movie...")

        # 6. Upload Result
        output_key = f"dubbed_{job_id}.mp4"
        upload_file(bucket, output_key, local_output)
        
        # 7. Complete
        update_job(job_id, status="COMPLETED", progress=100, output_key=output_key, activity="Done!", etr="0s")
        print(f"Job {job_id} Completed!")

    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        if job_id:
            update_job(job_id, status="FAILED")
    
    finally:
        # Cleanup
        if tracker:
            tracker.stop()
        if video:
            try:
                video.close()
            except:
                pass
                
        if job_id:
            local_input = f"input_{job_id}.mp4"
            local_output = f"output_{job_id}.mp4"
            local_audio_orig = f"audio_{job_id}.wav"
            final_audio_file = f"final_audio_{job_id}.mp3"
            
            # Wait a small bit for handles to release
            time.sleep(1)
            
            if os.path.exists(local_input): 
                try: os.remove(local_input)
                except: pass
            if os.path.exists(local_output): 
                try: os.remove(local_output)
                except: pass
            if os.path.exists(local_audio_orig): 
                try: os.remove(local_audio_orig)
                except: pass
            if os.path.exists(final_audio_file): 
                try: os.remove(final_audio_file)
                except: pass

def main():
    print("Orchestrator Waiting for messages...")
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue='job.created', durable=True)
    
    channel.basic_consume(queue='job.created', on_message_callback=process_job, auto_ack=True)
    channel.start_consuming()

if __name__ == "__main__":
    main()

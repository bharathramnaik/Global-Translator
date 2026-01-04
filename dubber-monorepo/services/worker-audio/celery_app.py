from celery import Celery
import os

broker_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672//")
backend_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery("worker-audio", broker=broker_url, backend=backend_url)

@celery_app.task
def process_job(job_id: int, source_object_key: str, target_lang: str):
    # TODO:
    # 1) download video from MinIO
    # 2) extract audio (FFmpeg)
    # 3) run Demucs
    # 4) call ASR, Translate, TTS, merge audio, upload output video
    print(f"Processing job {job_id} for lang {target_lang}, object {source_object_key}")
    return True

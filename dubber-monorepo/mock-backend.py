"""
Mock Backend API for Dubber Global Translator
Provides the same API endpoints as Spring Boot backend, but runs in Python
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
import json
from datetime import datetime
from pathlib import Path
import threading
import time

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:4201", "http://localhost:4200"]}})

# Configuration
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mkv', 'mov', 'flv', 'webm'}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory job store
jobs_store = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_size_mb(filepath):
    return os.path.getsize(filepath) / (1024 * 1024)

def process_job_background(job_id, file_path, source_language, target_language):
    """Simulate video processing in background"""
    time.sleep(2)  # Simulate processing
    jobs_store[job_id]['status'] = 'COMPLETED'
    jobs_store[job_id]['completedAt'] = datetime.utcnow().isoformat()
    jobs_store[job_id]['downloadUrl'] = f"/api/v1/job/{job_id}/download"

@app.route('/api/v1/upload', methods=['POST'])
def upload_file():
    """Upload a video file for translation"""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        source_language = request.form.get('sourceLanguage', 'en')
        target_language = request.form.get('targetLanguage', 'es')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: mp4, avi, mkv, mov, flv, webm'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': f'File too large. Max size: 500MB, Got: {file_size/(1024*1024):.1f}MB'}), 413
        
        # Save file
        job_id = str(uuid.uuid4())
        filename = secure_filename(f"{job_id}_{file.filename}")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Create job record
        job = {
            'id': job_id,
            'filename': file.filename,
            'status': 'PROCESSING',
            'sourceLanguage': source_language,
            'targetLanguage': target_language,
            'fileSize': get_file_size_mb(filepath),
            'uploadedAt': datetime.utcnow().isoformat(),
            'completedAt': None,
            'downloadUrl': None
        }
        jobs_store[job_id] = job
        
        # Start background processing
        thread = threading.Thread(
            target=process_job_background,
            args=(job_id, filepath, source_language, target_language)
        )
        thread.daemon = True
        thread.start()
        
        return jsonify(job), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/job/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """Get job status"""
    if job_id not in jobs_store:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify(jobs_store[job_id]), 200

@app.route('/api/v1/job/<job_id>/download', methods=['GET'])
def download_file(job_id):
    """Download processed file (mock - returns original file)"""
    if job_id not in jobs_store:
        return jsonify({'error': 'Job not found'}), 404
    
    job = jobs_store[job_id]
    if job['status'] != 'COMPLETED':
        return jsonify({'error': 'Job not yet completed'}), 400
    
    # For mock, we'll just return a dummy file
    # In real implementation, this would be the processed video
    try:
        file_path = None
        for file in os.listdir(UPLOAD_FOLDER):
            if file.startswith(job_id):
                file_path = os.path.join(UPLOAD_FOLDER, file)
                break
        
        if file_path:
            return send_file(file_path, as_attachment=True, download_name=job['filename'])
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'dubber-api'}), 200

@app.route('/api/v1', methods=['GET'])
def api_info():
    """API information"""
    return jsonify({
        'service': 'Dubber Global Translator API',
        'version': '1.0.0',
        'mode': 'mock',
        'endpoints': {
            'upload': 'POST /api/v1/upload',
            'job_status': 'GET /api/v1/job/{id}',
            'download': 'GET /api/v1/job/{id}/download',
            'health': 'GET /health'
        }
    }), 200

if __name__ == '__main__':
    print("=" * 60)
    print("🎬 Dubber Mock Backend API")
    print("=" * 60)
    print("Starting on http://localhost:8080")
    print("CORS enabled for: http://localhost:4201, http://localhost:4200")
    print("Upload folder: ./uploads")
    print("=" * 60)
    app.run(host='0.0.0.0', port=8080, debug=False)

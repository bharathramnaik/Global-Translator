# Worker Audio - Celery Task Worker

Celery-based worker for async audio processing tasks.

## Overview

This service processes long-running audio tasks like:
- Video download from MinIO
- Audio extraction
- Audio source separation (Demucs)
- Audio processing pipeline orchestration

## Features

- Async task processing via Celery
- RabbitMQ integration for task queue
- Redis backend for result storage
- FastAPI health endpoint

## Installation

```bash
pip install -r requirements.txt
```

## Running the Worker

```bash
celery -A celery_app.celery_app worker --loglevel=INFO
```

## Running the Debug API

```bash
uvicorn main:app --reload --port 8080
```

Access API documentation at `http://localhost:8080/docs`

## Configuration

### Environment Variables

- `RABBITMQ_URL` - RabbitMQ connection string (default: `amqp://guest:guest@rabbitmq:5672//`)
- `REDIS_URL` - Redis connection string (default: `redis://redis:6379/0`)
- `MINIO_ENDPOINT` - MinIO endpoint
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key

## API Endpoints

### GET `/health`
Service health check.

**Response:**
```json
{
  "status": "ok"
}
```

### POST `/debug-process/{job_id}`
Trigger a job processing for debugging.

**Response:**
```json
{
  "queued": 1
}
```

## Tasks

### process_job
Main task for processing a dubbing job.

**Parameters:**
- `job_id` (int) - Job ID
- `source_object_key` (str) - MinIO object key for source video
- `target_lang` (str) - Target language

## Celery Configuration

The worker uses:
- **Broker:** RabbitMQ for task queue
- **Backend:** Redis for storing results

## Docker

Build and run with Docker:

```bash
docker build -t dubber-worker-audio .
docker run --env RABBITMQ_URL="amqp://guest:guest@rabbitmq:5672//" \
           --env REDIS_URL="redis://redis:6379/0" \
           dubber-worker-audio
```

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- Celery - Async task queue
- Redis - Result backend
- MinIO - Object storage client

## Future Enhancements

- FFmpeg integration for audio extraction
- Demucs integration for source separation
- Parallel task processing
- Task retry logic with exponential backoff
- Progress tracking
- Error handling and notifications

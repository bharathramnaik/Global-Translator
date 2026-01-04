# Orchestrator Service

FastAPI-based orchestration service that coordinates the video dubbing pipeline.

## Overview

The orchestrator service coordinates communication between all microservices:
- API Gateway
- ASR Service
- Translation Service
- TTS Service
- Worker Audio

## Features

- Job orchestration
- Service coordination
- Pipeline management
- Health checks

## Installation

```bash
pip install -r requirements.txt
```

## Running Locally

```bash
uvicorn main:app --reload --port 8400
```

Access API documentation at `http://localhost:8400/docs`

## API Endpoints

### POST `/orchestrate`
Orchestrate the dubbing pipeline for a job.

**Request:**
```json
{
  "job_id": 1
}
```

**Response:**
```json
{
  "message": "Orchestration stub",
  "job": {
    "id": 1,
    "sourceObjectKey": "video.mp4",
    "targetLanguage": "hi",
    "status": "PROCESSING",
    ...
  }
}
```

### GET `/health`
Service health check.

**Response:**
```json
{
  "status": "ok"
}
```

## Configuration

### Environment Variables

- `API_GATEWAY_URL` - API Gateway URL (default: `http://api-gateway:8080`)
- `ASR_URL` - ASR Service URL (default: `http://service-asr:8100`)
- `TRANSLATE_URL` - Translation Service URL (default: `http://service-translate:8200`)
- `TTS_URL` - TTS Service URL (default: `http://service-tts:8300`)
- `RABBITMQ_URL` - RabbitMQ URL (default: `amqp://guest:guest@rabbitmq:5672//`)

## Orchestration Workflow

1. Fetch job information from API Gateway
2. Extract audio from video (via Worker)
3. Run ASR (speech-to-text)
4. Run Translation (text translation)
5. Run TTS (text-to-speech)
6. Merge audio with original video
7. Upload result back to MinIO
8. Update job status

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- httpx - Async HTTP client

## Docker

Build and run with Docker:

```bash
docker build -t dubber-orchestrator .
docker run -p 8400:8400 \
           -e API_GATEWAY_URL="http://api-gateway:8080" \
           -e ASR_URL="http://service-asr:8100" \
           -e TRANSLATE_URL="http://service-translate:8200" \
           -e TTS_URL="http://service-tts:8300" \
           dubber-orchestrator
```

## Future Enhancements

- Implement full pipeline logic
- Error handling and retries
- Progress tracking
- Parallel processing
- Caching strategies
- Request timeouts
- Circuit breaker pattern
- Logging and monitoring

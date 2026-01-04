# ASR Service - Automatic Speech Recognition

FastAPI-based service for automatic speech recognition (transcription).

## Overview

This service handles the transcription of audio files to text using Whisper or similar models.

## Features

- Audio file upload and processing
- Speech-to-text conversion
- Segment-based transcription output (with timestamps)
- Health checks

## Installation

```bash
pip install -r requirements.txt
```

## Running Locally

```bash
uvicorn main:app --reload --port 8100
```

Access API documentation at `http://localhost:8100/docs`

## API Endpoints

### POST `/transcribe`
Transcribe an audio file.

**Request:**
- `file`: Audio file (multipart/form-data)

**Response:**
```json
{
  "segments": [
    {
      "start": 0.0,
      "end": 5.0,
      "text": "Transcribed text here"
    }
  ]
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

## Environment Variables

None currently required. Can be extended for model selection.

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- Soundfile - Audio file handling
- NumPy - Numerical computing

## Future Enhancements

- Integrate Whisper for actual transcription
- Support multiple audio formats
- Language detection
- Confidence scores
- Batch processing
- Model caching

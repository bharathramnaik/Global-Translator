# TTS Service - Text-to-Speech

FastAPI-based service for text-to-speech synthesis.

## Overview

This service converts text to speech audio using models like Coqui TTS.

## Features

- Text-to-speech conversion
- Language and voice selection
- Audio file generation and retrieval
- Health checks

## Installation

```bash
pip install -r requirements.txt
```

## Running Locally

```bash
uvicorn main:app --reload --port 8300
```

Access API documentation at `http://localhost:8300/docs`

## API Endpoints

### POST `/synthesize`
Synthesize speech from text.

**Request:**
```json
{
  "text": "Hello, how are you?",
  "lang": "en",
  "voice": "female"
}
```

**Response:**
```json
{
  "audio_path": "/tmp/tts-output/550e8400-e29b-41d4-a716-446655440000.wav"
}
```

### GET `/audio/{filename}`
Download generated audio file.

**Response:** Binary audio data (WAV format)

### GET `/health`
Service health check.

**Response:**
```json
{
  "status": "ok"
}
```

## Supported Languages

- English (en)
- Hindi (hi)
- Telugu (te)
- Tamil (ta)
- And more...

## Output Directory

Audio files are stored in `/tmp/tts-output/` by default.

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- Soundfile - Audio file handling
- NumPy - Numerical computing

## Future Enhancements

- Integrate Coqui TTS or similar
- Multiple voice options per language
- Speech rate control
- Pitch adjustment
- Streaming output
- Output format selection

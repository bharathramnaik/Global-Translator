# Translate Service

FastAPI-based service for text translation supporting multiple languages.

## Overview

This service handles text translation using language models like NLLB (No Language Left Behind) or IndicTrans2.

## Features

- Text translation between languages
- Source and target language specification
- Health checks

## Installation

```bash
pip install -r requirements.txt
```

## Running Locally

```bash
uvicorn main:app --reload --port 8200
```

Access API documentation at `http://localhost:8200/docs`

## API Endpoints

### POST `/translate`
Translate text from source language to target language.

**Request:**
```json
{
  "text": "Hello, how are you?",
  "source_lang": "en",
  "target_lang": "hi"
}
```

**Response:**
```json
{
  "translated_text": "[hi] Hello, how are you?"
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

## Supported Languages

- English (en)
- Hindi (hi)
- Telugu (te)
- Tamil (ta)
- And more...

## Environment Variables

None currently required.

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation

## Future Enhancements

- Integrate NLLB or IndicTrans2 models
- Batch translation
- Confidence scores
- Language auto-detection
- Custom vocabulary support
- Caching for repeated translations

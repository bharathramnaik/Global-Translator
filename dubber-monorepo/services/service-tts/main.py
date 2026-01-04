from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import FileResponse
import uuid
import os
import tempfile
from typing import Optional

app = FastAPI(title="TTS Service")

class TtsRequest(BaseModel):
    text: str
    lang: str
    voice: Optional[str] = None

class TtsResponse(BaseModel):
    audio_path: str

# Use a cross-platform temp directory so the service works on Windows and Linux
OUTPUT_DIR = os.path.join(tempfile.gettempdir(), "tts-output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/synthesize", response_model=TtsResponse)
async def synthesize(req: TtsRequest):
    # TODO: call Coqui TTS; for now create dummy file
    filename = f"{uuid.uuid4()}.wav"
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "wb") as f:
        f.write(b"")  # dummy
    return TtsResponse(audio_path=path)

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(path, media_type="audio/wav")

@app.get("/health")
async def health():
    return {"status": "ok"}

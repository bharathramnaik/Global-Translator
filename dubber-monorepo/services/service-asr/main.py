from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List

app = FastAPI(title="ASR Service")

class Segment(BaseModel):
    start: float
    end: float
    text: str

class TranscriptionResponse(BaseModel):
    segments: List[Segment]

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(file: UploadFile = File(...)):
    # TODO: save file, run Whisper, parse segments
    dummy = Segment(start=0.0, end=5.0, text="Dummy transcription.")
    return TranscriptionResponse(segments=[dummy])

@app.get("/health")
async def health():
    return {"status": "ok"}

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Translate Service")

class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslateResponse(BaseModel):
    translated_text: str

@app.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    # TODO: call NLLB/IndicTrans2 here
    # For now, echo with prefix
    return TranslateResponse(translated_text=f"[{req.target_lang}] {req.text}")

@app.get("/health")
async def health():
    return {"status": "ok"}

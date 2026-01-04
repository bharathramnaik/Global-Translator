from fastapi import FastAPI
from celery_app import process_job

app = FastAPI(title="Worker Audio")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/debug-process/{job_id}")
async def debug_process(job_id: int):
    process_job.delay(job_id, "dummy.mp4", "en")
    return {"queued": job_id}

<!--
Repository-specific instructions for AI coding agents to be productive quickly.
Keep this short and actionable — reference files, commands, and common pitfalls.
-->
# Copilot / Agent Instructions — Dubber Monorepo

Summary: This is a microservices monorepo for a video dubbing platform. Main entry points are `apps/api-gateway` (Spring Boot), `apps/frontend` (Angular), `services/*` (FastAPI + Celery), and `infra/docker-compose.dev.yml` for local dev.

Architecture & boundaries
- API Gateway (Java/Spring Boot) — `apps/api-gateway/`. Exposes upload and job endpoints; persists job metadata in PostgreSQL.
- Microservices (FastAPI) — `services/service-asr`, `service-translate`, `service-tts`, `orchestrator` (orchestrator is currently a stub that should fetch job info and orchestrate ASR→Translate→TTS).
- Worker (Celery) — `services/worker-audio` processes long-running audio jobs (uses RabbitMQ + Redis + MinIO).

Getting the environment up — exact commands
- Entire dev stack (containers):
  - cd infra
  - docker-compose -f docker-compose.dev.yml up --build
- Java API Gateway (local dev): `./mvnw spring-boot:run` (in `apps/api-gateway`) — see `pom.xml` (targets Java 23).
- Python services (local dev): `pip install -r requirements.txt && uvicorn main:app --reload --port <port>` (see each service README; ports in infra README).
- Celery worker: `celery -A celery_app.celery_app worker --loglevel=INFO` (in `services/worker-audio`).
- Frontend: `npm install` then `npx ng serve` (in `apps/frontend`). Note: `run-frontend.bat` starts on port 4201 but other docs mention 4200 — check `package.json`.

Cross-component integration details agents must know
- Object storage = MinIO. API Gateway uploads to MinIO and produces presigned URLs. Check `apps/api-gateway/service/MinioService.java` and `infra/docker-compose.dev.yml` credentials.
- Orchestration flow: API Gateway creates jobs; orchestrator/worker then call ASR -> Translate -> TTS -> merge/upload output. Look at `services/orchestrator/main.py` and `services/worker-audio/celery_app.py` for TODOs and examples.

Repo conventions & small gotchas
- New services: add folder under `services/` with `main.py`, `requirements.txt`, `Dockerfile`; update `infra/docker-compose.dev.yml`.
- Java version mismatch: top-level README says Java 21, `pom.xml` and `run-backend.bat` target Java 23 — confirm the intended Java version before changing the build configuration.
- Port mismatch: docs sometimes claim 4200 vs `run-frontend.bat` which uses 4201 — verify when testing.

Where to look for examples when implementing features
- API endpoints and controllers: `apps/api-gateway/src/main/java/com/dubber/apigateway/web/` (UploadController, Job endpoints).
- Job entity and repository: `apps/api-gateway/src/main/java/com/dubber/apigateway/model` and `repository`.
- Celery task stub: `services/worker-audio/celery_app.py` (process_job) — good starting point for long-running work.

If you need further refinement
- If you'd like, I can expand this into a more detailed AGENT.md covering debugging tips, common tests, or a step-by-step onboarding checklist.

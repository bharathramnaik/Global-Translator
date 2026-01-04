# Dubber Monorepo - Complete Project Setup

## 📋 Project Summary

The **Dubber Monorepo** is a complete microservices-based platform for automatic video dubbing with support for multiple languages. This project is now fully scaffolded and ready for development.

### What's Included

✅ **Complete Monorepo Structure**
- Spring Boot API Gateway (Java 21)
- 5 Python FastAPI Microservices
- Angular Frontend
- Docker Compose Infrastructure
- Comprehensive Documentation

✅ **Services**
- **API Gateway** - Spring Boot REST API (Port 8080)
- **ASR Service** - Automatic Speech Recognition (Port 8100)
- **Translate Service** - Text Translation (Port 8200)
- **TTS Service** - Text-to-Speech (Port 8300)
- **Worker Audio** - Celery async processor
- **Orchestrator** - Pipeline Coordinator (Port 8400)

✅ **Infrastructure**
- PostgreSQL 15 (Database)
- MinIO (Object Storage)
- Redis (Caching & Task Queue)
- RabbitMQ (Message Broker)
- All configured in docker-compose.dev.yml

✅ **Frontend**
- Angular 17+ Application
- Upload Component
- Job Tracking
- Download Management
- Proxy Configuration

## 📁 Project Structure

```
dubber-monorepo/
├── apps/
│   ├── api-gateway/              # Spring Boot Backend
│   │   ├── src/main/java/
│   │   │   └── com/dubber/apigateway/
│   │   │       ├── ApiGatewayApplication.java
│   │   │       ├── config/
│   │   │       │   └── MinioConfig.java
│   │   │       ├── model/
│   │   │       │   ├── Job.java
│   │   │       │   └── JobStatus.java
│   │   │       ├── repository/
│   │   │       │   └── JobRepository.java
│   │   │       ├── service/
│   │   │       │   └── MinioService.java
│   │   │       └── web/
│   │   │           └── UploadController.java
│   │   ├── src/main/resources/
│   │   │   └── application.yml
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   ├── mvnw
│   │   ├── README.md
│   │   └── .gitignore
│   │
│   └── frontend/                 # Angular Web UI
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/upload/
│       │   │   │   ├── upload.component.ts
│       │   │   │   ├── upload.component.html
│       │   │   │   └── upload.component.scss
│       │   │   ├── services/
│       │   │   │   └── api.service.ts
│       │   │   ├── app.module.ts
│       │   │   ├── app-routing.module.ts
│       │   │   ├── app.component.ts
│       │   │   ├── app.component.html
│       │   │   └── app.component.scss
│       │   ├── main.ts
│       │   ├── index.html
│       │   └── styles.scss
│       ├── package.json
│       ├── angular.json
│       ├── tsconfig.json
│       ├── tsconfig.app.json
│       ├── proxy.conf.json
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── README.md
│       └── .gitignore
│
├── services/
│   ├── service-asr/              # Speech Recognition
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── service-translate/        # Translation Service
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── service-tts/              # Text-to-Speech
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── worker-audio/             # Celery Worker
│   │   ├── main.py
│   │   ├── celery_app.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   └── orchestrator/             # Pipeline Orchestrator
│       ├── main.py
│       ├── requirements.txt
│       ├── Dockerfile
│       └── README.md
│
├── infra/
│   ├── docker-compose.dev.yml    # Development Environment
│   └── README.md
│
├── libs/
│   └── common-models/
│       └── README.md
│
├── README.md                     # Main Documentation
├── SETUP.md                      # Setup Instructions
└── .gitignore
```

## 🚀 Quick Start

### 1. Start All Services with Docker Compose

```bash
cd infra
docker-compose -f docker-compose.dev.yml up --build
```

Wait 2-3 minutes for all services to become healthy.

### 2. Verify Services

**API Gateway:**
- URL: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

**MinIO Console:**
- URL: http://localhost:9001
- Username: minio
- Password: minio123

**RabbitMQ Console:**
- URL: http://localhost:15672
- Username: guest
- Password: guest

### 3. Test Upload

```bash
curl -X POST http://localhost:8080/api/v1/upload \
  -F "file=@test.mp4" \
  -F "targetLang=hi" \
  -F "options={}"
```

Response:
```json
{
  "jobId": 1
}
```

### 4. Check Job Status

```bash
curl http://localhost:8080/api/v1/job/1
```

## 📖 Documentation Files

- **README.md** - Main project documentation
- **SETUP.md** - Complete setup guide with troubleshooting
- **apps/api-gateway/README.md** - API Gateway documentation
- **apps/frontend/README.md** - Frontend documentation
- **infra/README.md** - Infrastructure documentation
- **services/*/README.md** - Individual service documentation

## 🔧 Development Guide

### Building API Gateway

```bash
cd apps/api-gateway
./mvnw clean package
./mvnw spring-boot:run
```

### Running Python Services Locally

```bash
cd services/service-asr
pip install -r requirements.txt
uvicorn main:app --reload --port 8100
```

### Running Frontend Locally

```bash
cd apps/frontend
npm install
ng serve --proxy-config proxy.conf.json
```

## 📝 Key Files Reference

### API Gateway
- `pom.xml` - Maven dependencies
- `application.yml` - Configuration
- `ApiGatewayApplication.java` - Main application class
- `UploadController.java` - REST endpoints
- `MinioService.java` - File upload/download
- `Job.java` & `JobStatus.java` - Database entities

### Python Services
- `main.py` - FastAPI application
- `requirements.txt` - Python dependencies
- `Dockerfile` - Container configuration
- `celery_app.py` - Celery configuration (Worker only)

### Frontend
- `package.json` - NPM dependencies
- `app.module.ts` - Module configuration
- `upload.component.ts` - Main component logic
- `api.service.ts` - HTTP client service
- `proxy.conf.json` - Development proxy

### Infrastructure
- `docker-compose.dev.yml` - Complete environment
- Environment variables for all services

## 🔌 API Endpoints

### API Gateway (Port 8080)

```
POST   /api/v1/upload              Upload video for dubbing
GET    /api/v1/job/{id}             Get job status
GET    /api/v1/job/{id}/download    Get download URL
```

### ASR Service (Port 8100)

```
POST   /transcribe                 Transcribe audio
GET    /health                     Health check
```

### Translate Service (Port 8200)

```
POST   /translate                  Translate text
GET    /health                     Health check
```

### TTS Service (Port 8300)

```
POST   /synthesize                 Synthesize speech
GET    /audio/{filename}           Download audio
GET    /health                     Health check
```

### Orchestrator (Port 8400)

```
POST   /orchestrate                Orchestrate pipeline
GET    /health                     Health check
```

## 🗄️ Database Schema

### Jobs Table

```sql
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  source_object_key VARCHAR(255),      -- Input video in MinIO
  output_object_key VARCHAR(255),      -- Output video in MinIO
  target_language VARCHAR(50),
  options_json TEXT,
  status VARCHAR(50),                  -- QUEUED, PROCESSING, COMPLETED, FAILED
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## 🛠️ Configuration

### Environment Variables

**API Gateway:**
- `SPRING_DATASOURCE_URL` - PostgreSQL connection
- `SPRING_DATASOURCE_USERNAME` - DB username
- `SPRING_DATASOURCE_PASSWORD` - DB password
- `MINIO_ENDPOINT` - MinIO endpoint
- `MINIO_ACCESS_KEY` - MinIO key
- `MINIO_SECRET_KEY` - MinIO secret

**Python Services:**
- `REDIS_URL` - Redis connection
- `RABBITMQ_URL` - RabbitMQ connection
- `API_GATEWAY_URL` - API Gateway URL (Orchestrator)
- `ASR_URL`, `TRANSLATE_URL`, `TTS_URL` - Service URLs (Orchestrator)

## ✨ Tech Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Spring Boot | 3.3.4 |
| Java | JDK | 21 |
| Microservices | FastAPI | Latest |
| Python | Python | 3.11+ |
| Frontend | Angular | 17+ |
| Database | PostgreSQL | 15 |
| Storage | MinIO | Latest |
| Cache/Queue | Redis | 7 |
| Message Broker | RabbitMQ | 3-management |
| Task Queue | Celery | Latest |
| Containerization | Docker | Latest |

## 📋 Checklist for Getting Started

- [ ] Clone/download the repository
- [ ] Install Docker & Docker Compose
- [ ] Navigate to `infra/` directory
- [ ] Run `docker-compose -f docker-compose.dev.yml up --build`
- [ ] Wait for all services to start (2-3 minutes)
- [ ] Verify: curl http://localhost:8080/swagger-ui.html
- [ ] Test upload API
- [ ] Access MinIO console at http://localhost:9001
- [ ] Access RabbitMQ console at http://localhost:15672
- [ ] Read README.md for detailed documentation

## 🔄 Typical Development Workflow

1. **Make changes** to code (Java, Python, TypeScript)
2. **Rebuild services** (docker-compose build for Python/Java)
3. **Restart services** (docker-compose restart)
4. **Test endpoints** using Swagger UI or Postman
5. **Check logs** with docker-compose logs
6. **Commit changes** to git

## 📚 Next Steps

1. **Implement ML Models:**
   - Integrate Whisper for ASR
   - Integrate NLLB/IndicTrans2 for Translation
   - Integrate Coqui TTS for Speech Synthesis

2. **Complete Worker Logic:**
   - FFmpeg integration for audio extraction
   - Demucs for audio source separation
   - Audio merging and video encoding

3. **Add Features:**
   - Authentication & Authorization
   - Job history & pagination
   - Batch processing
   - WebSocket for real-time updates

4. **DevOps:**
   - Setup CI/CD pipeline
   - Production Docker Compose
   - Kubernetes manifests
   - Monitoring & Logging

## ⚠️ Common Issues & Solutions

### Port Already in Use
```bash
# Windows: Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Docker Build Fails
```bash
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Database Connection Error
```bash
docker-compose -f docker-compose.dev.yml logs postgres
```

## 📞 Support

For detailed information, refer to:
- **SETUP.md** - Comprehensive setup guide
- **README.md** - Project overview
- Service-specific README files in each directory
- Docker Compose documentation

## 🎯 Project Goals

✅ Fully functional monorepo structure
✅ Microservices architecture implemented
✅ Docker containerization ready
✅ REST API fully documented
✅ Frontend scaffolded and ready
✅ Database schema defined
✅ Comprehensive documentation

🚀 Ready for development and implementation!

---

**Last Updated:** December 8, 2025
**Project Version:** 0.0.1-SNAPSHOT
**License:** MIT

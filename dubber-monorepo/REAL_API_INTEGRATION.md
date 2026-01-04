# Real API Integration - Complete Guide

## What Changed

### Frontend (Angular)
✅ API Service now points to real backend: `http://localhost:8080/api/v1`
✅ Set `useMockApi = false` in `api.service.ts`
✅ All endpoints ready:
  - `POST /upload` - Upload video file
  - `GET /job/{id}` - Check job status
  - `GET /job/{id}/download` - Get download URL

### Backend (Spring Boot)
✅ Added CORS support for `http://localhost:4201` and `http://localhost:4200`
✅ Controllers implemented:
  - `UploadController.java` - Handles file uploads, job status, downloads
✅ Services implemented:
  - `MinioService.java` - File storage in MinIO
  - `JobRepository.java` - Job persistence in PostgreSQL
✅ Models defined:
  - `Job.java` - JPA entity with status tracking
  - `JobStatus.java` - QUEUED, PROCESSING, COMPLETED, ERROR

## Quick Start (5 Minutes)

### Step 1: Start Infrastructure (1 minute)

**Using Docker Compose (Easiest):**
```bash
cd dubber-monorepo/infra
docker-compose -f docker-compose.dev.yml up -d
```

Or run the startup script:
```bash
# Windows
cd dubber-monorepo
START.bat

# Or PowerShell
.\START.ps1
```

**What starts:**
- PostgreSQL 15 (port 5432)
- MinIO (port 9000, web on 9001)
- Redis (port 6379)
- RabbitMQ (port 5672)

### Step 2: Build & Run API Gateway (2 minutes)

**In your IDE (Recommended):**
1. Open `apps/api-gateway` folder
2. Right-click `ApiGatewayApplication.java`
3. Select "Run as Spring Boot Application"

**Or via Terminal:**
```bash
cd apps/api-gateway
mvn clean install -DskipTests
mvn spring-boot:run
```

**Expected output:**
```
Started ApiGatewayApplication in X seconds
Server is running on http://localhost:8080
```

### Step 3: Start Frontend (1 minute)

Frontend is already running at http://localhost:4201

If you stopped it, restart:
```bash
cd apps/frontend
npx ng serve --port 4201
```

### Step 4: Test the Integration (1 minute)

1. Open http://localhost:4201 in browser
2. Select a video file
3. Choose country and language
4. Click **Upload**
5. You should see success alert with Job ID
6. Status panel shows upload in progress

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Frontend                       │
│                   (Angular on :4201)                        │
│                                                             │
│  [Select File] → [Choose Country] → [Choose Language]      │
│                        ↓                                    │
│                   [Upload Button]                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST /api/v1/upload
                         │
┌────────────────────────▼────────────────────────────────────┐
│              API Gateway (Spring Boot :8080)               │
│                                                             │
│  UploadController                                          │
│    • Receives multipart upload                             │
│    • Validates file & language                             │
│    • Stores file in MinIO                                  │
│    • Creates Job in PostgreSQL                             │
│    • Returns jobId to frontend                             │
└──────────────┬─────────────────┬──────────────┬────────────┘
               │                 │              │
         [MinIO]          [PostgreSQL]    [RabbitMQ]
      (File Storage)       (Job Tracker)  (Message Queue)
               │                 │              │
         [videos/]        [jobs table]  [dubbing_queue]
```

## File Locations & Key Components

### Frontend
```
apps/frontend/src/app/
├── services/
│   ├── api.service.ts          ← Updated to use real API
│   └── language.service.ts      ← Language configuration
├── components/
│   └── upload/
│       ├── upload.component.ts  ← Main upload logic
│       ├── upload.component.html
│       └── upload.component.scss
└── app.module.ts               ← Angular module configuration
```

### Backend
```
apps/api-gateway/src/main/java/com/dubber/apigateway/
├── ApiGatewayApplication.java  ← CORS & main app
├── web/
│   └── UploadController.java    ← REST endpoints
├── service/
│   └── MinioService.java        ← File upload/download
├── repository/
│   └── JobRepository.java       ← Database access
├── model/
│   ├── Job.java                 ← JPA entity
│   └── JobStatus.java           ← Status enum
└── config/
    ├── MinioConfig.java         ← MinIO client setup
    ├── MinioProperties.java      ← MinIO configuration
    └── AppProperties.java        ← App configuration
```

### Configuration
```
apps/api-gateway/src/main/resources/
└── application.yml              ← Database, MinIO, server config
```

## Testing the API Directly

### Using curl or Postman

**1. Upload a file:**
```bash
curl -X POST http://localhost:8080/api/v1/upload \
  -F "file=@video.mp4" \
  -F "targetLang=hi" \
  -F "options={}"
```

**Response:**
```json
{"jobId": 1}
```

**2. Check job status:**
```bash
curl http://localhost:8080/api/v1/job/1
```

**Response:**
```json
{
  "id": 1,
  "sourceObjectKey": "1733659200000_video.mp4",
  "outputObjectKey": null,
  "targetLanguage": "hi",
  "optionsJson": "{}",
  "status": "QUEUED",
  "createdAt": "2025-12-08T12:00:00Z",
  "updatedAt": "2025-12-08T12:00:00Z"
}
```

**3. Get download link (after processing):**
```bash
curl http://localhost:8080/api/v1/job/1/download
```

## Troubleshooting

### Frontend Issue: "Upload failed: 404 Not Found"
**Cause:** Backend API Gateway is not running
**Solution:**
1. Check if port 8080 is accessible: `curl http://localhost:8080`
2. Start Spring Boot: `mvn spring-boot:run`
3. Check logs for errors

### Backend Issue: "Connection refused" to PostgreSQL
**Cause:** Database not running
**Solution:**
1. Verify PostgreSQL is running: `docker ps | grep postgres`
2. Start PostgreSQL: `docker-compose up -d postgres`
3. Create database: `createdb -U dubber dubber`

### Backend Issue: "Connection refused" to MinIO
**Cause:** MinIO not running
**Solution:**
1. Verify MinIO is running: `docker ps | grep minio`
2. Start MinIO: `docker-compose up -d minio`
3. Create bucket: Go to http://localhost:9001, login, create "videos" bucket

### CORS Error in Browser Console
**Cause:** Frontend and backend CORS not configured
**Solution:** Already fixed! CORS is configured in `ApiGatewayApplication.java`

## Environment Variables (Optional)

If your services are on different hosts/ports, set these:

```bash
# Database
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dubber
export SPRING_DATASOURCE_USERNAME=dubber
export SPRING_DATASOURCE_PASSWORD=dubber

# MinIO
export MINIO_ENDPOINT=http://localhost:9000
export MINIO_ACCESS_KEY=minio
export MINIO_SECRET_KEY=minio123
```

## Next Steps

### 1. Implement Microservices (Optional)
The infrastructure is ready for the FastAPI microservices:
- **Orchestrator** - Routes jobs to ASR/Translate/TTS
- **Service ASR** - Speech-to-text transcription
- **Service Translate** - Language translation
- **Service TTS** - Text-to-speech synthesis
- **Worker Audio** - Celery background job processor

### 2. Message Queue Integration
When microservices are ready, the API Gateway can send messages to RabbitMQ:
```java
// In UploadController after job creation
rabbitTemplate.convertAndSend("dubbing_queue", job.getId());
```

### 3. Job Status Updates
Microservices can update job status via:
```bash
PUT http://localhost:8080/api/v1/job/{id}/status?status=PROCESSING
```

### 4. Add Authentication
For production, add JWT/OAuth2:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig { ... }
```

## Success Checklist

- [ ] PostgreSQL running with "dubber" database
- [ ] MinIO running with "videos" bucket
- [ ] Spring Boot API Gateway running on :8080
- [ ] Angular frontend running on :4201
- [ ] Can upload file without errors
- [ ] Job ID appears after upload
- [ ] Job status retrievable via GET /job/{id}
- [ ] No CORS errors in browser console

## Production Considerations

1. **Database:** Use managed PostgreSQL service (AWS RDS, Azure DB)
2. **Object Storage:** Use S3, Azure Blob, or self-hosted MinIO
3. **Message Queue:** Use managed RabbitMQ or Redis
4. **API Gateway:** Deploy on Kubernetes or serverless
5. **Frontend:** Deploy to CDN (CloudFlare, AWS CloudFront)
6. **Authentication:** Add JWT tokens and API keys
7. **Monitoring:** Add logging, metrics, tracing
8. **Rate Limiting:** Implement request throttling
9. **Error Handling:** Comprehensive error responses

## Documentation References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MinIO Java SDK](https://docs.min.io/minio/baremetal/sdk/java/API.html)
- [Angular HttpClient](https://angular.io/guide/http)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose](https://docs.docker.com/compose/)

---

**You're now ready to use the real API!** 🚀

Start with the infrastructure, then the backend, then test with the frontend.

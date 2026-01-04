# Real API Implementation - Setup Guide

## Overview
Now that the mock API is working, we'll connect the frontend to the real Spring Boot backend API Gateway.

## Prerequisites

### 1. **PostgreSQL Database**
```bash
# Start PostgreSQL (if using Docker)
docker run --name postgres-dubber -e POSTGRES_USER=dubber -e POSTGRES_PASSWORD=dubber -e POSTGRES_DB=dubber -p 5432:5432 -d postgres:15

# Or use your local PostgreSQL installation
# Create database
createdb -U postgres dubber
```

### 2. **MinIO Object Storage**
```bash
# Start MinIO (if using Docker)
docker run --name minio-dubber -e MINIO_ROOT_USER=minio -e MINIO_ROOT_PASSWORD=minio123 -p 9000:9000 -p 9001:9001 -d minio/minio:latest

# Or use your local MinIO installation
# Create bucket: videos
```

### 3. **Redis Cache** (Optional for now)
```bash
docker run --name redis-dubber -p 6379:6379 -d redis:7
```

### 4. **RabbitMQ Message Queue** (Optional for now)
```bash
docker run --name rabbitmq-dubber -p 5672:5672 -p 15672:15672 -d rabbitmq:3-management
```

## Quick Start with Docker Compose

We have a pre-configured docker-compose file. Run:

```bash
cd dubber-monorepo/infra
docker-compose -f docker-compose.dev.yml up -d
```

This will start:
- PostgreSQL 15
- MinIO
- Redis
- RabbitMQ
- And eventually all microservices

## Building & Running the Spring Boot API Gateway

### Option 1: Run from IDE (Recommended for Development)

1. **Open the project in your IDE** (IntelliJ, Eclipse, or VS Code with Java Extension)
   - Navigate to: `apps/api-gateway`
   - Open `pom.xml` - IDE should auto-detect it's a Maven project

2. **Run the application**
   - Right-click on `ApiGatewayApplication.java`
   - Select "Run" or press Ctrl+Shift+F10 (IntelliJ)
   - Server will start on `http://localhost:8080`

### Option 2: Command Line Build & Run

```bash
# Navigate to api-gateway
cd apps/api-gateway

# Build the project (download dependencies)
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## Verifying the Backend Setup

### 1. **Check API Gateway is running**
```bash
curl http://localhost:8080/api/v1/health
# Should return: {"status":"UP"}
```

### 2. **Check Database Connection**
The application logs should show:
```
... HikariPool-1 - Starting...
... HikariPool-1 - Pool initialized
```

### 3. **Check MinIO Connection**
The application logs should show successful MinIO client initialization.

## Testing the Integration

### Manual Test via Postman

1. **Upload File**
```
POST http://localhost:8080/api/v1/upload
Form Data:
  - file: [select your video file]
  - targetLang: hi
  - options: {}

Response:
  {"jobId": 1}
```

2. **Get Job Status**
```
GET http://localhost:8080/api/v1/job/1

Response:
  {
    "id": 1,
    "sourceObjectKey": "1733659200000_video.mp4",
    "targetLanguage": "hi",
    "status": "QUEUED",
    "createdAt": "2025-12-08T12:00:00Z",
    "updatedAt": "2025-12-08T12:00:00Z"
  }
```

3. **Get Download URL** (After processing is complete)
```
GET http://localhost:8080/api/v1/job/1/download

Response (when complete):
  {"url": "http://localhost:9000/videos/output_video.mp4?..."}
```

## Frontend Configuration

The frontend is already configured to use the real API:
- API Base URL: `http://localhost:8080/api/v1`
- File upload: `POST /upload`
- Status check: `GET /job/{id}`
- Download: `GET /job/{id}/download`

**Frontend still running at:** http://localhost:4201/

## Common Issues & Solutions

### Issue: "Connection refused" when uploading
**Solution:** Make sure Spring Boot API Gateway is running on port 8080
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # Mac/Linux
```

### Issue: "Database error" 
**Solution:** Ensure PostgreSQL is running and database "dubber" exists
```bash
# Check PostgreSQL
psql -U dubber -d dubber -c "SELECT 1"
```

### Issue: "MinIO connection error"
**Solution:** Ensure MinIO is running and bucket "videos" exists
```bash
# Check MinIO (via web console)
http://localhost:9001
# Username: minio
# Password: minio123
```

### Issue: CORS errors in browser console
**Solution:** Add CORS configuration to Spring Boot (if needed)
Update `ApiGatewayApplication.java` with:
```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4201")
                .allowedMethods("*")
                .allowCredentials(true);
        }
    };
}
```

## Next Steps

1. **Start PostgreSQL & MinIO** (via Docker or local installation)
2. **Run Spring Boot API Gateway**
3. **Open Frontend** at http://localhost:4201/
4. **Test Upload Workflow**:
   - Select video file
   - Choose language
   - Click Upload
   - Monitor status
   - Download dubbed video (once microservices are running)

## Architecture Flow

```
Frontend (Angular) on :4201
    ↓
    ↓ HTTP POST /api/v1/upload
    ↓
API Gateway (Spring Boot) on :8080
    ↓
    ├→ Stores file in MinIO
    ├→ Creates Job record in PostgreSQL
    └→ Sends message to RabbitMQ
        ↓
    Orchestrator (FastAPI)
        ↓
    ASR Service (Speech Recognition)
    Translator Service (Language Translation)
    TTS Service (Text-to-Speech)
    Worker (Celery - Background Job)
        ↓
    All store results back in MinIO
    Update job status in PostgreSQL
```

## Environment Variables (if needed)

Set these before running Spring Boot:
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dubber
export SPRING_DATASOURCE_USERNAME=dubber
export SPRING_DATASOURCE_PASSWORD=dubber
export MINIO_ENDPOINT=http://localhost:9000
export MINIO_ACCESS_KEY=minio
export MINIO_SECRET_KEY=minio123
```

## Success Indicators

✅ Frontend loads at http://localhost:4201/
✅ Can select file and language
✅ Upload button works (no "not found" error)
✅ Job ID appears after upload
✅ Status changes from QUEUED → PROCESSING
✅ Download link appears when COMPLETED
✅ Can download dubbed video

You're all set! 🚀

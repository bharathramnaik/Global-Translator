# API Gateway - Dubber

Spring Boot 3.3 REST API Gateway for the Dubber video dubbing platform.

## Overview

The API Gateway is the main entry point for the application, handling:
- Video file uploads to MinIO
- Job creation and tracking
- Database persistence
- API documentation via Swagger

## Tech Stack

- Spring Boot 3.3.4
- Spring Data JPA
- PostgreSQL
- MinIO SDK
- Lombok
- SpringDoc OpenAPI (Swagger)

## Prerequisites

- Java 21+
- PostgreSQL 15
- MinIO

## Building

```bash
./mvnw clean package
```

## Running Locally

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

Access Swagger UI at `http://localhost:8080/swagger-ui.html`

## Configuration

### application.yml

Key configuration properties:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/dubber
    username: dubber
    password: dubber
  jpa:
    hibernate:
      ddl-auto: update

minio:
  endpoint: http://localhost:9000
  access-key: minio
  secret-key: minio123

app:
  minio:
    bucket: videos
```

### Environment Variables

- `SPRING_DATASOURCE_URL` - PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `MINIO_ENDPOINT` - MinIO endpoint URL
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key

## API Endpoints

### POST `/api/v1/upload`
Upload a video for dubbing.

**Parameters:**
- `file` - Video file (multipart)
- `targetLang` - Target language code (e.g., "hi", "en")
- `options` - JSON string with options (optional)

**Response:**
```json
{
  "jobId": 123
}
```

### GET `/api/v1/job/{id}`
Get job status and details.

**Response:**
```json
{
  "id": 123,
  "sourceObjectKey": "1234567890_video.mp4",
  "outputObjectKey": null,
  "targetLanguage": "hi",
  "status": "QUEUED",
  "createdAt": "2024-12-08T10:00:00Z",
  "updatedAt": "2024-12-08T10:00:00Z"
}
```

### GET `/api/v1/job/{id}/download`
Get presigned download URL for completed job.

**Response:**
```json
{
  "url": "http://minio:9000/videos/..."
}
```

## Project Structure

```
src/main/java/com/dubber/apigateway/
├── ApiGatewayApplication.java
├── config/
│   └── MinioConfig.java
├── model/
│   ├── Job.java
│   └── JobStatus.java
├── repository/
│   └── JobRepository.java
├── service/
│   └── MinioService.java
└── web/
    └── UploadController.java
```

## Database Schema

### Jobs Table

```sql
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  source_object_key VARCHAR(255),
  output_object_key VARCHAR(255),
  target_language VARCHAR(50),
  options_json TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## Docker

Build and run with Docker:

```bash
docker build -t dubber-api-gateway .
docker run -p 8080:8080 \
           -e SPRING_DATASOURCE_URL="jdbc:postgresql://postgres:5432/dubber" \
           -e SPRING_DATASOURCE_USERNAME="dubber" \
           -e SPRING_DATASOURCE_PASSWORD="dubber" \
           -e MINIO_ENDPOINT="http://minio:9000" \
           -e MINIO_ACCESS_KEY="minio" \
           -e MINIO_SECRET_KEY="minio123" \
           dubber-api-gateway
```

## Dependencies

- Spring Boot Web
- Spring Data JPA
- PostgreSQL Driver
- MinIO SDK
- Lombok
- SpringDoc OpenAPI

## Future Enhancements

- Authentication & Authorization
- Rate limiting
- Request validation
- Error handling with custom exceptions
- Logging and monitoring
- API versioning
- Caching strategies
- Transaction management
- Test coverage

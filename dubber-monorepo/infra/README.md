# Infrastructure - Dubber Monorepo

Docker Compose configuration for local development and deployment.

## Overview

The `docker-compose.dev.yml` file orchestrates all services needed for the Dubber platform:

- **Databases:** PostgreSQL
- **Storage:** MinIO (S3-compatible)
- **Caching & Queue:** Redis
- **Message Broker:** RabbitMQ
- **Applications:** API Gateway, Frontend, Python Microservices

## Services

### Infrastructure Services

#### PostgreSQL
- **Image:** postgres:15
- **Port:** 5432
- **Credentials:** dubber/dubber
- **Database:** dubber
- **Volume:** pgdata

#### MinIO
- **Image:** minio/minio
- **Ports:** 9000 (API), 9001 (Console)
- **Credentials:** minio/minio123
- **Volume:** minio-data
- **Console:** http://localhost:9001

#### Redis
- **Image:** redis:7
- **Port:** 6379
- **Function:** Caching, Celery backend

#### RabbitMQ
- **Image:** rabbitmq:3-management
- **Ports:** 5672 (AMQP), 15672 (Management)
- **Credentials:** guest/guest
- **Console:** http://localhost:15672

### Application Services

#### API Gateway
- **Port:** 8080
- **Framework:** Spring Boot 3.3
- **Dependencies:** PostgreSQL, MinIO
- **Swagger:** http://localhost:8080/swagger-ui.html

#### Service ASR (Automatic Speech Recognition)
- **Port:** 8100
- **Framework:** FastAPI
- **Dependencies:** Redis
- **Docs:** http://localhost:8100/docs

#### Service Translate
- **Port:** 8200
- **Framework:** FastAPI
- **Dependencies:** None
- **Docs:** http://localhost:8200/docs

#### Service TTS (Text-to-Speech)
- **Port:** 8300
- **Framework:** FastAPI
- **Dependencies:** None
- **Docs:** http://localhost:8300/docs

#### Worker Audio
- **Framework:** Celery
- **Dependencies:** MinIO, Redis, RabbitMQ
- **Function:** Async audio processing

#### Orchestrator
- **Port:** 8400
- **Framework:** FastAPI
- **Dependencies:** All services
- **Docs:** http://localhost:8400/docs

## Quick Start

### Start All Services

```bash
cd infra
docker-compose -f docker-compose.dev.yml up --build
```

### Stop All Services

```bash
docker-compose -f docker-compose.dev.yml down
```

### Stop and Remove Volumes

```bash
docker-compose -f docker-compose.dev.yml down -v
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f api-gateway

# Last 100 lines
docker-compose -f docker-compose.dev.yml logs --tail=100
```

## Service URLs

| Service | URL | Docs/Console |
|---------|-----|---|
| PostgreSQL | localhost:5432 | - |
| MinIO API | http://localhost:9000 | - |
| MinIO Console | http://localhost:9001 | http://localhost:9001 |
| Redis | localhost:6379 | - |
| RabbitMQ AMQP | localhost:5672 | - |
| RabbitMQ Console | - | http://localhost:15672 |
| API Gateway | http://localhost:8080 | http://localhost:8080/swagger-ui.html |
| ASR Service | http://localhost:8100 | http://localhost:8100/docs |
| Translate Service | http://localhost:8200 | http://localhost:8200/docs |
| TTS Service | http://localhost:8300 | http://localhost:8300/docs |
| Orchestrator | http://localhost:8400 | http://localhost:8400/docs |

## Configuration

### Database Initialization

PostgreSQL automatically creates the `dubber` database on first start. Spring Boot's JPA will create tables based on entity definitions.

### MinIO Bucket Creation

MinIO starts with no buckets. The first upload via API Gateway will create the required bucket.

### RabbitMQ Default User

Default credentials: `guest/guest`

### Redis Persistence

Redis runs in-memory. Data is lost on container restart.

## Development Workflow

### Testing the Pipeline

1. Start services:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

2. Upload a video:
   ```bash
   curl -X POST http://localhost:8080/api/v1/upload \
     -F "file=@test.mp4" \
     -F "targetLang=hi"
   ```

3. Check job status:
   ```bash
   curl http://localhost:8080/api/v1/job/1
   ```

4. Access Swagger UI:
   - API Gateway: http://localhost:8080/swagger-ui.html
   - Python services: http://localhost:{port}/docs

### Viewing Service Logs

```bash
# Follow API Gateway logs
docker-compose -f docker-compose.dev.yml logs -f api-gateway

# Follow Worker logs
docker-compose -f docker-compose.dev.yml logs -f worker-audio

# View RabbitMQ console
# Open http://localhost:15672 in browser
```

### Accessing Databases

#### PostgreSQL

```bash
docker-compose -f docker-compose.dev.yml exec postgres psql -U dubber -d dubber
```

#### Redis

```bash
docker-compose -f docker-compose.dev.yml exec redis redis-cli
```

#### RabbitMQ Management

- Open http://localhost:15672
- Username: guest
- Password: guest

#### MinIO Console

- Open http://localhost:9001
- Username: minio
- Password: minio123

## Production Considerations

### Environment-Specific Files

Create `docker-compose.prod.yml` for production:
- Use official Docker registries instead of local builds
- Remove volume mounts for logs
- Add resource limits
- Use environment-specific credentials
- Enable proper networking

### Persistent Storage

- PostgreSQL: Use Docker volumes or external database
- MinIO: Use S3 bucket or persistent volume
- Redis: Use external Redis or implement persistence

### Monitoring & Logging

- Add Prometheus for metrics
- Use ELK Stack for centralized logging
- Implement health checks
- Add alerting

### Security

- Use Docker secrets for credentials
- Implement network policies
- Use HTTPS/TLS
- Implement authentication
- Set resource limits

## Troubleshooting

### Port Conflicts

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs <service-name>

# Rebuild service
docker-compose -f docker-compose.dev.yml build --no-cache <service-name>
```

### Database Connection Issues

```bash
# Ensure PostgreSQL is ready
docker-compose -f docker-compose.dev.yml exec postgres pg_isready

# Check PostgreSQL logs
docker-compose -f docker-compose.dev.yml logs postgres
```

### Network Issues Between Services

```bash
# Test connectivity from one service to another
docker-compose -f docker-compose.dev.yml exec api-gateway ping postgres
docker-compose -f docker-compose.dev.yml exec api-gateway ping minio
```

## Common Commands

```bash
# Build images
docker-compose -f docker-compose.dev.yml build

# Build specific service
docker-compose -f docker-compose.dev.yml build api-gateway

# Run in background
docker-compose -f docker-compose.dev.yml up -d

# Pull latest images
docker-compose -f docker-compose.dev.yml pull

# Scale service (if stateless)
docker-compose -f docker-compose.dev.yml up --scale service-asr=3

# Run one-off command
docker-compose -f docker-compose.dev.yml exec api-gateway bash
```

## Future Enhancements

- [ ] Kubernetes configuration (helm charts)
- [ ] Environment variable management
- [ ] Multi-environment support
- [ ] Health check endpoints
- [ ] Load balancing
- [ ] Service mesh integration
- [ ] Backup strategies

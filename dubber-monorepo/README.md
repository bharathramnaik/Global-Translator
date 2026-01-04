# Dubber Monorepo – Video Dubbing Platform

A microservices-based platform for automatic video dubbing with support for multiple languages. Built with Spring Boot, FastAPI, Angular, and modern DevOps practices.

## Architecture

This monorepo follows a microservices pattern with the following structure:

```
dubber-monorepo/
├── apps/
│   ├── api-gateway/           # Spring Boot API Gateway
│   └── frontend/              # Angular web application
├── services/
│   ├── service-asr/           # Automatic Speech Recognition (Python/FastAPI)
│   ├── service-translate/     # Translation Service (Python/FastAPI)
│   ├── service-tts/           # Text-to-Speech Service (Python/FastAPI)
│   ├── worker-audio/          # Celery Worker (Audio Processing)
│   └── orchestrator/          # Orchestration Service (Python/FastAPI)
├── infra/
│   └── docker-compose.dev.yml # Development environment
├── libs/
│   └── common-models/         # Shared DTOs and models
└── README.md
```

## Technology Stack

- **Backend**: Spring Boot 3.3.4 (Java 21)
- **Microservices**: FastAPI, Uvicorn
- **Frontend**: Angular 17+
- **Message Queue**: RabbitMQ
- **Cache & Task Queue**: Redis + Celery
- **Object Storage**: MinIO
- **Database**: PostgreSQL 15
- **Container**: Docker & Docker Compose

## Prerequisites

- Docker & Docker Compose
- Java 21 (for local Spring Boot development)
- Node.js 18+ (for Angular development)
- Python 3.11 (for FastAPI services)

## Quick Start

### Running with Docker Compose

Navigate to the infrastructure directory and start all services:

```bash
cd infra
docker-compose -f docker-compose.dev.yml up --build
```

This will spin up:
- **PostgreSQL** on `localhost:5432`
- **MinIO** on `localhost:9000` (console at `localhost:9001`)
- **Redis** on `localhost:6379`
- **RabbitMQ** on `localhost:5672` (console at `localhost:15672`)
- **API Gateway** on `http://localhost:8080`
- **ASR Service** on `http://localhost:8100/docs`
- **Translate Service** on `http://localhost:8200/docs`
- **TTS Service** on `http://localhost:8300/docs`
- **Orchestrator** on `http://localhost:8400/docs`

### Frontend Setup (Local Development)

From the `apps/frontend` directory:

```bash
cd apps/frontend
npm install
ng serve --proxy-config proxy.conf.json
```

Access the frontend at `http://localhost:4200`

### API Gateway (Local Development)

From the `apps/api-gateway` directory:

```bash
cd apps/api-gateway
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

### Python Services (Local Development)

Each Python service can be run independently:

```bash
cd services/service-asr
pip install -r requirements.txt
uvicorn main:app --reload --port 8100
```

## API Endpoints

### API Gateway

- `POST /api/v1/upload` - Upload video for dubbing
  - Parameters: `file`, `targetLang`, `options` (optional)
  - Response: `{ jobId: number }`

- `GET /api/v1/job/{id}` - Get job status
  - Response: Job object with status

- `GET /api/v1/job/{id}/download` - Get download URL for completed job
  - Response: `{ url: string }`

### ASR Service

- `POST /transcribe` - Transcribe audio
- `GET /health` - Service health check

### Translate Service

- `POST /translate` - Translate text
- `GET /health` - Service health check

### TTS Service

- `POST /synthesize` - Synthesize speech
- `GET /audio/{filename}` - Download generated audio
- `GET /health` - Service health check

### Orchestrator

- `POST /orchestrate` - Orchestrate the dubbing pipeline
- `GET /health` - Service health check

## Configuration

### Environment Variables

#### API Gateway
- `SPRING_DATASOURCE_URL` - PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `MINIO_ENDPOINT` - MinIO endpoint URL
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key

#### Worker Audio
- `RABBITMQ_URL` - RabbitMQ connection string
- `REDIS_URL` - Redis connection string
- `MINIO_ENDPOINT` - MinIO endpoint
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key

#### Orchestrator
- `API_GATEWAY_URL` - API Gateway URL
- `ASR_URL` - ASR Service URL
- `TRANSLATE_URL` - Translation Service URL
- `TTS_URL` - TTS Service URL
- `RABBITMQ_URL` - RabbitMQ connection string

## Database Schema

The API Gateway uses JPA/Hibernate for ORM. The main entity is:

### Job Table

```sql
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  source_object_key VARCHAR(255),
  output_object_key VARCHAR(255),
  target_language VARCHAR(50),
  options_json TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Development Workflow

### Adding a New Service

1. Create a new directory under `services/`
2. Add `requirements.txt` and `main.py` for Python services
3. Add a `Dockerfile` following the pattern in existing services
4. Update `infra/docker-compose.dev.yml` to include the new service
5. Add environment variables for dependencies

### Building Docker Images

```bash
# Build all services
docker-compose -f infra/docker-compose.dev.yml build

# Build a specific service
docker-compose -f infra/docker-compose.dev.yml build service-asr
```

### Viewing Logs

```bash
# View all logs
docker-compose -f infra/docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f infra/docker-compose.dev.yml logs -f api-gateway
```

## Testing

### API Testing

Use the Swagger UI available at:
- API Gateway: `http://localhost:8080/swagger-ui.html`
- Python services: `http://localhost:{port}/docs`

### Example Upload Request

```bash
curl -X POST http://localhost:8080/api/v1/upload \
  -F "file=@video.mp4" \
  -F "targetLang=hi" \
  -F "options={\"quality\":\"high\"}"
```

## Deployment

### Production Considerations

1. Use environment-specific Docker Compose files
2. Implement proper secret management (Docker Secrets, HashiCorp Vault)
3. Set up persistent volumes for PostgreSQL and MinIO
4. Configure proper logging and monitoring (ELK Stack, Prometheus)
5. Use a proper reverse proxy (Nginx, Traefik)
6. Implement health checks and restart policies
7. Set up CI/CD pipelines (GitHub Actions, Jenkins)

### Example Production Deployment

```bash
docker-compose -f infra/docker-compose.prod.yml up -d
```

## Common Issues & Solutions

### Port Already in Use

```bash
# Find and kill process using port
lsof -i :8080
kill -9 <PID>
```

### Database Connection Errors

Ensure PostgreSQL is running and accessible:
```bash
docker-compose -f infra/docker-compose.dev.yml logs postgres
```

### Service Communication Issues

Check network connectivity:
```bash
docker-compose -f infra/docker-compose.dev.yml exec api-gateway ping postgres
```

## Future Enhancements

- [ ] Implement complete ASR pipeline with Whisper
- [ ] Integrate IndicTrans2 for Indian language translation
- [ ] Add Coqui TTS for speech synthesis
- [ ] Implement Demucs for audio separation
- [ ] Add FFmpeg integration for audio/video merging
- [ ] Implement proper authentication & authorization
- [ ] Add comprehensive error handling
- [ ] Set up monitoring and alerting
- [ ] Add rate limiting and throttling
- [ ] Implement caching strategies

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.

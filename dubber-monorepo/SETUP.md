# Setup Guide - Dubber Monorepo

Complete setup guide for the Dubber video dubbing platform.

## Prerequisites

### Required

- **Docker & Docker Compose** - For containerized services
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version && docker-compose --version`

- **Java 21+** - For API Gateway development
  - Download: https://www.oracle.com/java/technologies/downloads/
  - Verify: `java --version`

- **Node.js 18+** - For Angular frontend
  - Download: https://nodejs.org/
  - Verify: `node --version && npm --version`

- **Python 3.11+** - For FastAPI services
  - Download: https://www.python.org/
  - Verify: `python --version`

- **Git** - For version control
  - Download: https://git-scm.com/
  - Verify: `git --version`

### Recommended

- **VS Code** - Code editor
- **Postman** or **Insomnia** - API testing
- **DBeaver** - Database management
- **Redis CLI** - Redis debugging

## Initial Setup

### 1. Clone the Repository

```bash
cd c:\Projects\Global\ Translator
# Already created in dubber-monorepo
cd dubber-monorepo
```

### 2. Initialize Git (if needed)

```bash
git init
git add .
git commit -m "Initial commit: Dubber monorepo setup"
```

### 3. Project Structure Verification

Verify the directory structure:

```bash
tree /F /L 2
```

Expected structure:
```
dubber-monorepo/
├── apps/
│   ├── api-gateway/      # Spring Boot backend
│   └── frontend/         # Angular web UI
├── services/
│   ├── service-asr/      # Speech recognition
│   ├── service-translate/ # Translation
│   ├── service-tts/      # Text-to-speech
│   ├── worker-audio/     # Celery worker
│   └── orchestrator/     # Pipeline orchestration
├── infra/
│   ├── docker-compose.dev.yml
│   └── README.md
├── libs/
│   └── common-models/
├── README.md
└── .gitignore
```

## Running the Project

### Option 1: Full Stack with Docker Compose (Recommended for First Time)

```bash
# Navigate to infra directory
cd infra

# Start all services
docker-compose -f docker-compose.dev.yml up --build

# Wait for all services to be healthy (2-3 minutes)
```

Access:
- API Gateway: http://localhost:8080
- Frontend: http://localhost:4200 (after manual setup)
- MinIO Console: http://localhost:9001
- RabbitMQ Console: http://localhost:15672

### Option 2: Local Development (Requires all Prerequisites)

#### Terminal 1: Start Infrastructure

```bash
cd infra
docker-compose -f docker-compose.dev.yml up postgres minio redis rabbitmq
```

#### Terminal 2: Start API Gateway

```bash
cd apps/api-gateway
./mvnw spring-boot:run
```

#### Terminal 3: Start ASR Service

```bash
cd services/service-asr
pip install -r requirements.txt
uvicorn main:app --reload --port 8100
```

#### Terminal 4: Start Translate Service

```bash
cd services/service-translate
pip install -r requirements.txt
uvicorn main:app --reload --port 8200
```

#### Terminal 5: Start TTS Service

```bash
cd services/service-tts
pip install -r requirements.txt
uvicorn main:app --reload --port 8300
```

#### Terminal 6: Start Orchestrator

```bash
cd services/orchestrator
pip install -r requirements.txt
uvicorn main:app --reload --port 8400
```

#### Terminal 7: Start Frontend

```bash
cd apps/frontend
npm install
ng serve --proxy-config proxy.conf.json
```

## Configuration

### API Gateway Configuration

Edit `apps/api-gateway/src/main/resources/application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/dubber
    username: dubber
    password: dubber
```

### Frontend Configuration

Proxy configuration is in `apps/frontend/proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Testing the Setup

### 1. Check Services Health

```bash
# API Gateway
curl http://localhost:8080/swagger-ui.html

# ASR Service
curl http://localhost:8100/health

# Translate Service
curl http://localhost:8200/health

# TTS Service
curl http://localhost:8300/health

# Orchestrator
curl http://localhost:8400/health
```

### 2. Test API Upload

```bash
# Create a test video file
echo "dummy video content" > test.mp4

# Upload
curl -X POST http://localhost:8080/api/v1/upload \
  -F "file=@test.mp4" \
  -F "targetLang=hi" \
  -F "options={}"
```

Expected response:
```json
{
  "jobId": 1
}
```

### 3. Check Job Status

```bash
curl http://localhost:8080/api/v1/job/1
```

### 4. Access UIs

- **API Gateway Swagger:** http://localhost:8080/swagger-ui.html
- **Frontend:** http://localhost:4200 (after starting)
- **MinIO Console:** http://localhost:9001 (guest/guest)
- **RabbitMQ Console:** http://localhost:15672 (guest/guest)

## Development Workflow

### Adding a New Endpoint to API Gateway

1. Create a new controller in `apps/api-gateway/src/main/java/com/dubber/apigateway/web/`
2. Add necessary services
3. Rebuild: `./mvnw clean package`
4. Run: `./mvnw spring-boot:run`

### Adding a New Python Microservice

1. Create new directory in `services/`
2. Create `main.py` with FastAPI app
3. Create `requirements.txt` with dependencies
4. Create `Dockerfile`
5. Update `infra/docker-compose.dev.yml`
6. Start: `docker-compose -f docker-compose.dev.yml up --build <service-name>`

### Updating Frontend

1. Edit components in `apps/frontend/src/app/`
2. Changes auto-reload with `ng serve`
3. Build for production: `npm run build`

## Troubleshooting

### Cannot Connect to Database

```bash
# Check PostgreSQL container
docker-compose -f infra/docker-compose.dev.yml logs postgres

# Try to connect
docker-compose -f infra/docker-compose.dev.yml exec postgres psql -U dubber -d dubber
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>
```

### Services Not Communicating

Check network connectivity:

```bash
docker-compose -f infra/docker-compose.dev.yml exec api-gateway ping postgres
docker-compose -f infra/docker-compose.dev.yml exec orchestrator ping api-gateway
```

### Maven Build Fails

```bash
# Clear cache
cd apps/api-gateway
./mvnw clean

# Update dependencies
./mvnw dependency:resolve
```

### npm Dependency Issues

```bash
cd apps/frontend
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Implement ASR Logic** - Integrate Whisper in `services/service-asr/main.py`
2. **Implement Translation** - Add NLLB model in `services/service-translate/main.py`
3. **Implement TTS** - Add Coqui TTS in `services/service-tts/main.py`
4. **Implement Audio Processing** - Add FFmpeg in `services/worker-audio/`
5. **Add Authentication** - Implement JWT in API Gateway
6. **Add Monitoring** - Set up Prometheus and Grafana
7. **Add Logging** - Set up ELK Stack
8. **Deploy** - Create production Docker Compose file

## Common Commands Reference

```bash
# Docker Compose
docker-compose -f infra/docker-compose.dev.yml up -d    # Start background
docker-compose -f infra/docker-compose.dev.yml down      # Stop all
docker-compose -f infra/docker-compose.dev.yml logs -f   # View logs
docker-compose -f infra/docker-compose.dev.yml ps        # List services

# Java/Maven
./mvnw clean package          # Build JAR
./mvnw spring-boot:run       # Run locally
./mvnw test                  # Run tests

# Python/FastAPI
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Angular
ng serve                     # Development server
npm run build               # Production build
ng test                     # Run tests

# Git
git status
git add .
git commit -m "message"
git push
```

## Support & Resources

- **Docker:** https://docs.docker.com/
- **Spring Boot:** https://spring.io/projects/spring-boot
- **FastAPI:** https://fastapi.tiangolo.com/
- **Angular:** https://angular.io/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **MinIO:** https://docs.min.io/
- **Celery:** https://docs.celeryproject.io/

## License

MIT License

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

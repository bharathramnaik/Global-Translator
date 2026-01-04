# 🗂️ Complete Directory Tree & File Guide

## Project Root Structure

```
dubber-monorepo/                        (Root Directory)
│
├── 📄 START_HERE.md                    ⭐ Read this first!
├── 📄 README.md                        Complete project documentation
├── 📄 SETUP.md                         Detailed setup instructions
├── 📄 PROJECT_SETUP_COMPLETE.md        Project summary
├── 📄 IMPLEMENTATION_CHECKLIST.md      Development roadmap
├── 📄 .gitignore                       Git ignore rules
│
├── 📁 apps/                            Application Layer
│   ├── api-gateway/                    Spring Boot REST API
│   │   ├── pom.xml                     Maven configuration
│   │   ├── mvnw                        Maven wrapper script
│   │   ├── Dockerfile                  Docker build config
│   │   ├── README.md                   Service documentation
│   │   ├── .gitignore                  Local git ignores
│   │   │
│   │   ├── .mvn/wrapper/
│   │   │   └── MavenWrapperDownloader.java
│   │   │
│   │   └── src/main/
│   │       ├── java/com/dubber/apigateway/
│   │       │   ├── ApiGatewayApplication.java    Main class
│   │       │   ├── config/
│   │       │   │   └── MinioConfig.java          Bean configuration
│   │       │   ├── model/
│   │       │   │   ├── Job.java                  Entity model
│   │       │   │   └── JobStatus.java            Enum
│   │       │   ├── repository/
│   │       │   │   └── JobRepository.java        JPA interface
│   │       │   ├── service/
│   │       │   │   └── MinioService.java         File service
│   │       │   └── web/
│   │       │       └── UploadController.java     REST endpoints
│   │       │
│   │       └── resources/
│   │           └── application.yml               Configuration
│   │
│   └── frontend/                       Angular Web Application
│       ├── package.json                NPM configuration
│       ├── angular.json                Angular CLI config
│       ├── tsconfig.json               TypeScript config
│       ├── tsconfig.app.json           App-specific TS config
│       ├── proxy.conf.json             Dev proxy config
│       ├── Dockerfile                  Docker build config
│       ├── nginx.conf                  Nginx server config
│       ├── README.md                   Service documentation
│       ├── .gitignore                  Local git ignores
│       │
│       └── src/
│           ├── main.ts                 Bootstrap file
│           ├── index.html              HTML entry point
│           ├── styles.scss             Global styles
│           │
│           └── app/
│               ├── app.module.ts       Root module
│               ├── app.component.ts    Root component
│               ├── app.component.html  Root template
│               ├── app.component.scss  Root styles
│               ├── app-routing.module.ts  Route config
│               │
│               ├── components/upload/
│               │   ├── upload.component.ts     Component logic
│               │   ├── upload.component.html   Component template
│               │   └── upload.component.scss   Component styles
│               │
│               └── services/
│                   └── api.service.ts       HTTP client
│
├── 📁 services/                        Microservices
│   │
│   ├── service-asr/                    Speech Recognition Service
│   │   ├── main.py                     FastAPI application
│   │   ├── requirements.txt            Python dependencies
│   │   ├── Dockerfile                  Docker build config
│   │   └── README.md                   Service documentation
│   │
│   ├── service-translate/              Translation Service
│   │   ├── main.py                     FastAPI application
│   │   ├── requirements.txt            Python dependencies
│   │   ├── Dockerfile                  Docker build config
│   │   └── README.md                   Service documentation
│   │
│   ├── service-tts/                    Text-to-Speech Service
│   │   ├── main.py                     FastAPI application
│   │   ├── requirements.txt            Python dependencies
│   │   ├── Dockerfile                  Docker build config
│   │   └── README.md                   Service documentation
│   │
│   ├── worker-audio/                   Celery Worker
│   │   ├── main.py                     FastAPI health endpoint
│   │   ├── celery_app.py               Celery configuration
│   │   ├── requirements.txt            Python dependencies
│   │   ├── Dockerfile                  Docker build config
│   │   └── README.md                   Service documentation
│   │
│   └── orchestrator/                   Pipeline Orchestrator
│       ├── main.py                     FastAPI application
│       ├── requirements.txt            Python dependencies
│       ├── Dockerfile                  Docker build config
│       └── README.md                   Service documentation
│
├── 📁 infra/                           Infrastructure
│   ├── docker-compose.dev.yml          Complete environment config
│   └── README.md                       Infrastructure documentation
│
├── 📁 libs/                            Shared Libraries
│   └── common-models/
│       └── README.md                   Shared models documentation
│
└── [Total: 73 files in organized structure]
```

---

## 📊 File Count by Category

| Category | Count | Files |
|----------|-------|-------|
| **Java Files** | 8 | Spring Boot components |
| **Python Files** | 11 | FastAPI + Celery services |
| **TypeScript Files** | 8 | Angular components |
| **Configuration Files** | 15+ | YAML, JSON, XML |
| **Documentation** | 11 | Markdown files |
| **Docker** | 8 | Dockerfiles for all services |
| **HTML/SCSS** | 7 | Frontend templates and styles |
| **Build/Config** | 5 | pom.xml, package.json, etc. |
| **Total** | **73** | Complete project |

---

## 🔑 Key Files by Purpose

### Configuration Files
```
Root Level:
- .gitignore              Global git configuration
- START_HERE.md           Quick start guide
- SETUP.md                Setup instructions

API Gateway:
- pom.xml                 Maven dependencies
- application.yml        Spring Boot config
- .mvn/wrapper/          Maven configuration

Frontend:
- package.json            NPM dependencies
- angular.json            Angular CLI config
- tsconfig.json          TypeScript config
- proxy.conf.json        Dev proxy config

Infrastructure:
- docker-compose.dev.yml Docker Compose setup
```

### Core Application Files
```
API Gateway:
- ApiGatewayApplication.java    Main entry point
- UploadController.java          REST endpoints
- MinioService.java             File storage service

Frontend:
- app.module.ts                 Root module
- upload.component.ts          Main component
- api.service.ts               HTTP client

Services (Each):
- main.py                      FastAPI app

Worker:
- celery_app.py               Celery config
```

### Docker Files
```
- apps/api-gateway/Dockerfile
- apps/frontend/Dockerfile
- services/service-asr/Dockerfile
- services/service-translate/Dockerfile
- services/service-tts/Dockerfile
- services/worker-audio/Dockerfile
- services/orchestrator/Dockerfile
- infra/docker-compose.dev.yml
```

### Documentation Files
```
Project Level:
- README.md
- SETUP.md
- START_HERE.md
- PROJECT_SETUP_COMPLETE.md
- IMPLEMENTATION_CHECKLIST.md

Service Level:
- apps/api-gateway/README.md
- apps/frontend/README.md
- services/*/README.md (5 files)
- infra/README.md
- libs/common-models/README.md
```

---

## 🎯 File Purposes Quick Reference

### Must Read First
1. **START_HERE.md** - Quick overview
2. **README.md** - Full documentation
3. **SETUP.md** - Setup instructions

### Development Focus
- **apps/api-gateway/** - Backend development
- **apps/frontend/** - Frontend development
- **services/** - Microservices development

### Deployment Focus
- **infra/docker-compose.dev.yml** - Local dev setup
- **Dockerfile** files - Container images
- **requirements.txt** - Python dependencies
- **pom.xml** - Java dependencies
- **package.json** - Node dependencies

### Reference
- Individual **README.md** files in each service
- **IMPLEMENTATION_CHECKLIST.md** - Development tasks

---

## 📋 File Access Patterns

### For Backend Developers
```
apps/api-gateway/
├── pom.xml                 → Dependencies
├── src/main/
│   ├── java/              → Source code
│   └── resources/         → Configuration
└── Dockerfile            → Build
```

### For Frontend Developers
```
apps/frontend/
├── package.json          → Dependencies
├── angular.json          → Build config
├── src/app/             → Components/Services
└── Dockerfile           → Build
```

### For Python/ML Developers
```
services/service-*/
├── requirements.txt      → Dependencies
├── main.py              → Service code
└── Dockerfile           → Build
```

### For DevOps Engineers
```
infra/
├── docker-compose.dev.yml  → Complete setup
└── README.md              → Documentation
```

---

## 🔄 Common File Navigation

### To modify an API endpoint:
1. Edit: `apps/api-gateway/src/main/java/com/dubber/apigateway/web/UploadController.java`
2. Rebuild: `./mvnw clean package`
3. Test: Swagger UI at localhost:8080/swagger-ui.html

### To update frontend:
1. Edit: `apps/frontend/src/app/components/upload/`
2. Reload: Browser auto-refreshes with `ng serve`
3. Build: `npm run build`

### To modify a microservice:
1. Edit: `services/service-*/main.py`
2. Rebuild: `docker-compose build service-name`
3. Restart: `docker-compose restart service-name`

### To change configuration:
1. Edit: appropriate `configuration.yml` or `.env` file
2. Rebuild/restart affected services
3. Verify via health endpoints

---

## 📂 Directory Nesting Levels

```
Level 0: dubber-monorepo/
Level 1: apps/, services/, infra/, libs/
Level 2: api-gateway/, frontend/, service-asr/, etc.
Level 3: src/, .mvn/, config/, etc.
Level 4: main/, java/, resources/, etc.
Level 5: com/dubber/apigateway/ (Java packages)
```

---

## 🚀 File Execution Flow

### Startup Order
```
1. Docker Compose reads: infra/docker-compose.dev.yml
2. Builds Docker images from: apps/*/Dockerfile, services/*/Dockerfile
3. Starts containers with config from: .yml files
4. Application starts from: *Application.java, main.py
5. Configuration loaded from: application.yml, environment variables
```

### Build Process
```
Java:
1. Maven reads: pom.xml
2. Downloads dependencies
3. Compiles: src/main/java/**
4. Packages: target/app.jar
5. Docker builds: FROM eclipse-temurin:21

Python:
1. pip reads: requirements.txt
2. Installs dependencies
3. Docker copies: main.py, celery_app.py
4. Entrypoint: uvicorn/celery command

Frontend:
1. npm reads: package.json
2. Installs dependencies
3. ng build compiles: src/app/**
4. Docker serves: dist/frontend
```

---

## 🔍 Finding Specific Code

### API Endpoints
**Location:** `apps/api-gateway/src/main/java/com/dubber/apigateway/web/UploadController.java`
**Methods:** upload(), getJob(), getDownloadUrl()

### Database Entities
**Location:** `apps/api-gateway/src/main/java/com/dubber/apigateway/model/Job.java`
**Related:** `JobStatus.java`, `JobRepository.java`

### Frontend Components
**Location:** `apps/frontend/src/app/components/upload/`
**Files:** upload.component.ts/html/scss

### HTTP Client
**Location:** `apps/frontend/src/app/services/api.service.ts`
**Methods:** upload(), getJob(), getDownload()

### FastAPI Services
**Location:** `services/service-*/main.py`
**Pattern:** @app.post(), @app.get()

### Configuration
**Location:** `apps/api-gateway/src/main/resources/application.yml`
**Frontend:** `apps/frontend/proxy.conf.json`
**Docker:** `infra/docker-compose.dev.yml`

---

## 💾 File Dependencies

```
Docker Compose starts:
├── PostgreSQL (requires: no files)
├── MinIO (requires: no files)
├── Redis (requires: no files)
├── RabbitMQ (requires: no files)
└── Applications:
    ├── api-gateway (requires: pom.xml, Dockerfile)
    ├── frontend (requires: package.json, Dockerfile)
    └── services/* (requires: requirements.txt, Dockerfile)
```

---

## ✅ Complete File Checklist

### Root Files
- [x] .gitignore
- [x] README.md
- [x] SETUP.md
- [x] START_HERE.md
- [x] PROJECT_SETUP_COMPLETE.md
- [x] IMPLEMENTATION_CHECKLIST.md

### API Gateway (8 Java + Config)
- [x] pom.xml
- [x] Dockerfile
- [x] mvnw
- [x] application.yml
- [x] 8 Java source files
- [x] .gitignore
- [x] README.md

### Frontend (20+ Files)
- [x] package.json
- [x] angular.json
- [x] tsconfig.json/app.json
- [x] proxy.conf.json
- [x] Dockerfile
- [x] nginx.conf
- [x] 8 TypeScript files
- [x] 3 HTML files
- [x] 4 SCSS files
- [x] .gitignore
- [x] README.md

### Services (5 x 5 files)
- [x] ASR: main.py, requirements.txt, Dockerfile, README.md
- [x] Translate: main.py, requirements.txt, Dockerfile, README.md
- [x] TTS: main.py, requirements.txt, Dockerfile, README.md
- [x] Worker: main.py, celery_app.py, requirements.txt, Dockerfile, README.md
- [x] Orchestrator: main.py, requirements.txt, Dockerfile, README.md

### Infrastructure
- [x] docker-compose.dev.yml
- [x] README.md

### Library
- [x] common-models/README.md

**Total Verified:** ✅ 73 files

---

**Navigation Guide Complete!**

Start with **START_HERE.md** for quick orientation.

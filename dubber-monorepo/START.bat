@echo off
REM Quick Start Script for Dubber Video Dubbing Platform
REM This script starts all required services

echo.
echo ========================================
echo Dubber Platform - Quick Start
echo ========================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Docker is not installed or not in PATH
    echo Please install Docker or start PostgreSQL, MinIO, Redis manually
    echo See REAL_API_SETUP.md for manual setup instructions
) else (
    echo Docker found. Starting infrastructure...
    echo.
    echo Starting PostgreSQL, MinIO, Redis, RabbitMQ...
    docker-compose -f infra/docker-compose.dev.yml up -d
    if %errorlevel% equ 0 (
        echo.
        echo ✓ Infrastructure services started
        echo   - PostgreSQL: localhost:5432
        echo   - MinIO: localhost:9000 (Web: localhost:9001)
        echo   - Redis: localhost:6379
        echo   - RabbitMQ: localhost:5672 (Web: localhost:15672)
        echo.
        echo Waiting 10 seconds for services to be ready...
        timeout /t 10 /nobreak
    ) else (
        echo ERROR: Failed to start infrastructure
        echo See REAL_API_SETUP.md for troubleshooting
        exit /b 1
    )
)

echo.
echo ========================================
echo Starting Backend API Gateway...
echo ========================================
echo.
cd apps\api-gateway
start "API Gateway" cmd /k "mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo ========================================
echo Starting Frontend Application...
echo ========================================
echo.
cd ..\..
cd apps\frontend
start "Frontend" cmd /k "npx ng serve --port 4201"

echo.
echo ========================================
echo ✓ All services starting...
echo ========================================
echo.
echo Backend API:  http://localhost:8080
echo Frontend:     http://localhost:4201
echo MinIO Web:    http://localhost:9001
echo RabbitMQ Web: http://localhost:15672
echo.
echo Open http://localhost:4201 in your browser
echo.
pause

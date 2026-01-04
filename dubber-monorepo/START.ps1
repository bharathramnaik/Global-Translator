#!/usr/bin/env pwsh
# Quick Start Script for Dubber Video Dubbing Platform (PowerShell)

$projectRoot = Get-Location

Write-Host ""
Write-Host "========================================"
Write-Host "Dubber Platform - Quick Start"
Write-Host "========================================"
Write-Host ""

# Check Docker
Write-Host "Checking Docker..."
$dockerInstalled = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)

if ($dockerInstalled) {
    Write-Host "Docker found. Starting infrastructure..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting PostgreSQL, MinIO, Redis, RabbitMQ..."
    
    Push-Location "$projectRoot\infra"
    docker-compose -f docker-compose.dev.yml up -d
    
    if ($LASTEXITCODE -eq 0) {
        Pop-Location
        Write-Host ""
        Write-Host "✓ Infrastructure services started" -ForegroundColor Green
        Write-Host "  - PostgreSQL: localhost:5432"
        Write-Host "  - MinIO: localhost:9000 (Web: localhost:9001)"
        Write-Host "  - Redis: localhost:6379"
        Write-Host "  - RabbitMQ: localhost:5672 (Web: localhost:15672)"
        Write-Host ""
        Write-Host "Waiting 10 seconds for services to be ready..."
        Start-Sleep -Seconds 10
    } else {
        Pop-Location
        Write-Host "ERROR: Failed to start infrastructure" -ForegroundColor Red
        Write-Host "See REAL_API_SETUP.md for troubleshooting"
        exit 1
    }
} else {
    Write-Host "WARNING: Docker is not installed or not in PATH" -ForegroundColor Yellow
    Write-Host "Please install Docker or start PostgreSQL, MinIO, Redis manually"
    Write-Host "See REAL_API_SETUP.md for manual setup instructions"
    Write-Host ""
}

Write-Host ""
Write-Host "========================================"
Write-Host "Starting Backend API Gateway..."
Write-Host "========================================"
Write-Host ""

# Start API Gateway
Push-Location "$projectRoot\apps\api-gateway"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\apps\api-gateway'; mvn spring-boot:run"
Pop-Location
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================"
Write-Host "Starting Frontend Application..."
Write-Host "========================================"
Write-Host ""

# Start Frontend
Push-Location "$projectRoot\apps\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\apps\frontend'; npx ng serve --port 4201"
Pop-Location

Write-Host ""
Write-Host "========================================"
Write-Host "✓ All services starting..." -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Backend API:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend:     http://localhost:4201" -ForegroundColor Cyan
Write-Host "MinIO Web:    http://localhost:9001" -ForegroundColor Cyan
Write-Host "RabbitMQ Web: http://localhost:15672" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open http://localhost:4201 in your browser" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue..."


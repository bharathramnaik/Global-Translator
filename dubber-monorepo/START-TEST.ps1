# Global Translator - Test Environment Quick Start
# OPTIMIZED FOR LOW RAM SYSTEMS (4GB or less)
# This script runs only essential services to save memory

param(
    [switch]$Minimal,      # Run only database + minio + redis (for frontend dev)
    [switch]$NoFrontend,   # Skip frontend container (run Angular locally)
    [switch]$Cleanup       # Clean up containers and volumes
)

$ErrorActionPreference = "Continue"
$RootDir = $PSScriptRoot

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   GLOBAL TRANSLATOR - TEST ENVIRONMENT        " -ForegroundColor Cyan
Write-Host "   Optimized for Low RAM Systems               " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -NoNewline
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host " NOT RUNNING!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop first." -ForegroundColor Yellow
    exit 1
}
Write-Host " OK" -ForegroundColor Green

# Get Docker memory info
$dockerMem = docker info --format "{{.MemTotal}}" 2>$null
$dockerMemGB = [math]::Round($dockerMem / 1GB, 1)
Write-Host "Docker Memory: ${dockerMemGB}GB allocated" -ForegroundColor Gray

# Cleanup mode
if ($Cleanup) {
    Write-Host ""
    Write-Host "Cleaning up test environment..." -ForegroundColor Yellow
    Push-Location "$RootDir\infra"
    docker-compose -f docker-compose.test.yml down -v --remove-orphans
    docker system prune -f
    Pop-Location
    Write-Host "Cleanup complete!" -ForegroundColor Green
    exit 0
}

# Navigate to infra directory
Push-Location "$RootDir\infra"

try {
    # Determine which services to start
    if ($Minimal) {
        Write-Host ""
        Write-Host "Starting MINIMAL services (saves RAM)..." -ForegroundColor Yellow
        Write-Host "  - PostgreSQL, MinIO, Redis only" -ForegroundColor Gray
        Write-Host "  - Run frontend locally: cd apps/frontend && ng serve --port 4202" -ForegroundColor Gray
        Write-Host ""
        
        docker-compose -f docker-compose.test.yml up -d postgres-test minio-test redis-test
        
    }
    elseif ($NoFrontend) {
        Write-Host ""
        Write-Host "Starting services WITHOUT frontend container..." -ForegroundColor Yellow
        Write-Host "  - Run frontend locally to save RAM" -ForegroundColor Gray
        Write-Host ""
        
        docker-compose -f docker-compose.test.yml up -d postgres-test minio-test redis-test api-gateway-test orchestrator-test
        
    }
    else {
        Write-Host ""
        Write-Host "Starting ALL services..." -ForegroundColor Yellow
        Write-Host "  (Use -Minimal or -NoFrontend to save RAM)" -ForegroundColor Gray
        Write-Host ""
        
        docker-compose -f docker-compose.test.yml up -d
    }

    # Wait for services
    Write-Host ""
    Write-Host "Waiting for services to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    # Check service status
    Write-Host ""
    Write-Host "Service Status:" -ForegroundColor Cyan
    docker-compose -f docker-compose.test.yml ps

    # Show access information
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "   TEST ENVIRONMENT READY!                     " -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access Points:" -ForegroundColor White
    Write-Host "  Frontend:      http://localhost:4202" -ForegroundColor Cyan
    Write-Host "  API Gateway:   http://localhost:8180" -ForegroundColor Cyan
    Write-Host "  API Docs:      http://localhost:8180/swagger-ui.html" -ForegroundColor Cyan
    Write-Host "  MinIO Console: http://localhost:9101 (minio/minio_test)" -ForegroundColor Cyan
    Write-Host "  PostgreSQL:    localhost:5433 (dubber/dubber_test)" -ForegroundColor Cyan
    Write-Host ""
    
    if ($Minimal) {
        Write-Host "To run frontend locally:" -ForegroundColor Yellow
        Write-Host "  cd apps/frontend" -ForegroundColor White
        Write-Host "  ng serve --configuration=test --port 4202" -ForegroundColor White
        Write-Host ""
    }
    
    Write-Host "To stop services:" -ForegroundColor Yellow
    Write-Host "  .\START-TEST.ps1 -Cleanup" -ForegroundColor White
    Write-Host ""
    Write-Host "Memory Usage:" -ForegroundColor Yellow
    docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"

}
finally {
    Pop-Location
}

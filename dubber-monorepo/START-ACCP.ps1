# Global Translator - Acceptance Environment Startup Script
# Starts all services for the Acceptance environment

param(
    [switch]$SkipDocker,
    [switch]$SkipBackend,
    [switch]$SkipFrontend
)

$ErrorActionPreference = "Stop"
$RootDir = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Global Translator - ACCP Environment  " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        docker info 2>&1 | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Function to wait for service
function Wait-ForService {
    param(
        [string]$Url,
        [string]$ServiceName,
        [int]$MaxAttempts = 30
    )
    
    Write-Host "Waiting for $ServiceName..." -NoNewline
    $attempts = 0
    while ($attempts -lt $MaxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host " Ready!" -ForegroundColor Green
                return $true
            }
        } catch {
            # Service not ready yet
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $attempts++
    }
    Write-Host " Timeout!" -ForegroundColor Red
    return $false
}

# Step 1: Start Docker Infrastructure
if (-not $SkipDocker) {
    Write-Host "[1/3] Starting Docker Infrastructure (Acceptance)..." -ForegroundColor Yellow
    
    if (-not (Test-DockerRunning)) {
        Write-Host "ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
        exit 1
    }
    
    Push-Location "$RootDir\infra"
    try {
        docker-compose -f docker-compose.accp.yml up -d
        Write-Host "Docker services started." -ForegroundColor Green
    } finally {
        Pop-Location
    }
    
    # Wait for PostgreSQL
    Write-Host "Waiting for database to be ready..."
    Start-Sleep -Seconds 15
} else {
    Write-Host "[1/3] Skipping Docker Infrastructure" -ForegroundColor Gray
}

# Step 2: Start API Gateway
if (-not $SkipBackend) {
    Write-Host ""
    Write-Host "[2/3] Starting API Gateway (Acceptance Profile)..." -ForegroundColor Yellow
    
    Push-Location "$RootDir\apps\api-gateway"
    try {
        # Set environment for acceptance
        $env:SPRING_PROFILES_ACTIVE = "accp"
        $env:SERVER_PORT = "8280"
        
        # Start in background
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run", "-Dspring.profiles.active=accp", "-Dserver.port=8280" -WindowStyle Normal
        Write-Host "API Gateway starting on port 8280..." -ForegroundColor Green
    } finally {
        Pop-Location
    }
    
    # Wait for API Gateway
    Wait-ForService -Url "http://localhost:8280/actuator/health" -ServiceName "API Gateway"
} else {
    Write-Host "[2/3] Skipping API Gateway" -ForegroundColor Gray
}

# Step 3: Start Frontend
if (-not $SkipFrontend) {
    Write-Host ""
    Write-Host "[3/3] Starting Frontend (Acceptance Configuration)..." -ForegroundColor Yellow
    
    Push-Location "$RootDir\apps\frontend"
    try {
        Start-Process -FilePath "npx" -ArgumentList "ng", "serve", "--configuration=accp", "--port=4203" -WindowStyle Normal
        Write-Host "Frontend starting on port 4203..." -ForegroundColor Green
    } finally {
        Pop-Location
    }
} else {
    Write-Host "[3/3] Skipping Frontend" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  ACCEPTANCE Environment Started!      " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Access Points:" -ForegroundColor White
Write-Host "  Frontend:   http://localhost:4203" -ForegroundColor Green
Write-Host "  API:        http://localhost:8280" -ForegroundColor Green
Write-Host "  MinIO:      http://localhost:9201" -ForegroundColor Green
Write-Host "  RabbitMQ:   http://localhost:15674" -ForegroundColor Green
Write-Host ""
Write-Host "This environment simulates production settings." -ForegroundColor Yellow
Write-Host "Press Ctrl+C in each terminal window to stop services."

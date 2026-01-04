@echo off
REM Start Dubber Backend API Gateway
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo  Starting Dubber API Gateway Backend
echo ==========================================
echo.

cd /d "C:\Projects\Global Translator\dubber-monorepo\apps\api-gateway"

REM Set Java 23 as default
set JAVA_HOME=C:\Program Files\Java\jdk-23

REM Run Spring Boot
echo Starting on port 8080...
echo Press Ctrl+C to stop
echo.

mvn spring-boot:run

pause

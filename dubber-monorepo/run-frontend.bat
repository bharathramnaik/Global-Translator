@echo off
REM Start Dubber Frontend
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo  Starting Dubber Frontend
echo ==========================================
echo.

cd /d "C:\Projects\Global Translator\dubber-monorepo\apps\frontend"

REM Install dependencies if needed
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

REM Start Angular dev server
echo Starting on port 4201...
echo Press Ctrl+C to stop
echo.

call npx ng serve --port 4201 --open

pause

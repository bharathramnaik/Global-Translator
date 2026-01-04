# Startup Issues - Solution

## Problem
The PowerShell startup script has syntax issues. The batch file (.bat) works better on Windows.

## Solution 1: Use Batch File (Easiest)

Simply run:
```
cd c:\Projects\Global Translator\dubber-monorepo
START.bat
```

This will:
1. Start Docker containers
2. Open new windows for Backend and Frontend
3. Automatically navigate to correct directories

---

## Solution 2: Manual Steps (Most Reliable)

Open **3 separate Command Prompt or PowerShell windows**:

### Window 1: Start Infrastructure
```powershell
cd "c:\Projects\Global Translator\dubber-monorepo\infra"
docker-compose -f docker-compose.dev.yml up -d
```

Wait for all containers to start (about 10 seconds).

### Window 2: Start Backend
```powershell
cd "c:\Projects\Global Translator\dubber-monorepo\apps\api-gateway"
mvn spring-boot:run
```

Wait for: `Started ApiGatewayApplication in X seconds`

### Window 3: Start Frontend
```powershell
cd "c:\Projects\Global Translator\dubber-monorepo\apps\frontend"
npx ng serve --port 4201
```

Wait for: `Compiled successfully`

---

## Step 3: Open Browser

Open: **http://localhost:4201**

That's it! All services are running.

---

## If Batch File Doesn't Work

Try the manual approach with individual windows instead. That's the most reliable method.

---

## Verification Commands

Check if services are running:

```powershell
# Check Docker containers
docker ps

# Check if backend is running
curl http://localhost:8080

# Check if frontend is running
curl http://localhost:4201
```

---

**Recommended:** Use the **manual steps in 3 windows** - it's the most reliable and easiest to troubleshoot.

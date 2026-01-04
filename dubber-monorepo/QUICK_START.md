# 🚀 Quick Start - Manual Steps (Recommended)

## Instead of the Startup Scripts, Follow These Simple Steps

The startup scripts can have PowerShell issues. Here's the **easiest way** to start everything:

---

## Step 1: Start Infrastructure (Docker)

Open **Command Prompt** or **PowerShell** and run:

```bash
cd c:\Projects\Global Translator\dubber-monorepo\infra
docker-compose -f docker-compose.dev.yml up -d
```

This starts:
- ✅ PostgreSQL on port 5432
- ✅ MinIO on port 9000 (web: 9001)
- ✅ Redis on port 6379
- ✅ RabbitMQ on port 5672

**Wait 10 seconds for services to start.**

---

## Step 2: Start Backend API Gateway

Open a **NEW Command Prompt/PowerShell window** and run:

```bash
cd c:\Projects\Global Translator\dubber-monorepo\apps\api-gateway
mvn spring-boot:run
```

Wait for it to show:
```
Started ApiGatewayApplication in X seconds
```

**Keep this window open.**

---

## Step 3: Frontend is Already Running

The frontend is already running at:
**http://localhost:4201**

If you stopped it, open a **NEW Command Prompt/PowerShell window** and run:

```bash
cd c:\Projects\Global Translator\dubber-monorepo\apps\frontend
npx ng serve --port 4201
```

---

## Step 4: Test It

1. Open browser: **http://localhost:4201**
2. Select a video file
3. Choose country & language
4. Click Upload
5. Watch job progress
6. Download when complete

---

## ✅ You Should See

```
Window 1 (Docker):
  PostgreSQL container running
  MinIO container running
  Redis container running
  RabbitMQ container running

Window 2 (Backend):
  Started ApiGatewayApplication in X seconds
  Server running on localhost:8080

Window 3 (Frontend):
  √ Compiled successfully
  Angular Live Development Server listening on localhost:4201
```

---

## 🔍 Verify Each Service

**Check PostgreSQL:**
```bash
netstat -ano | findstr :5432
```

**Check MinIO:**
```bash
netstat -ano | findstr :9000
```

**Check Backend:**
```bash
netstat -ano | findstr :8080
```

**Check Frontend:**
```bash
netstat -ano | findstr :4201
```

All should show something listening on those ports.

---

## 🆘 If Something Doesn't Work

### "Port already in use"
Find and kill the process:
```bash
# Find process on port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### "Docker not found"
```bash
# Check if Docker is installed
docker --version

# If not, install from: https://www.docker.com/products/docker-desktop
```

### "mvn not found"
```bash
# Check if Maven is installed
mvn --version

# If not, install from: https://maven.apache.org/
```

### "npm not found"
```bash
# Check if Node is installed
npm --version

# If not, install from: https://nodejs.org/
```

### "Angular not compiling"
```bash
cd apps/frontend
npm install
npx ng serve --port 4201
```

---

## 🎯 Summary

**3 Simple Commands in 3 Windows:**

| Window | Command |
|--------|---------|
| 1 | `cd infra && docker-compose -f docker-compose.dev.yml up -d` |
| 2 | `cd apps/api-gateway && mvn spring-boot:run` |
| 3 | `cd apps/frontend && npx ng serve --port 4201` |

Then open: **http://localhost:4201**

That's it! The platform is running. 🚀

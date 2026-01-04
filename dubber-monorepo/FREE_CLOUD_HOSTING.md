# Free Cloud Hosting Guide for Global Translator

This guide helps you deploy your application using **100% FREE** cloud resources.

---

## Quick Answer to Your Questions

| Question | Answer |
|----------|--------|
| **Nginx approval?** | No - it's your own config inside Docker, no external approval needed |
| **Deploy every time?** | No - once deployed, CI/CD auto-deploys when you push to GitHub |
| **Google One?** | Not suitable (consumer storage). Use **Google Cloud Free Tier** instead |
| **Free database?** | Yes! Several options below with generous free tiers |

---

## Recommended FREE Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    FREE HOSTING STACK                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend:     Vercel / Cloudflare Pages (unlimited)        │
│  Backend API:  Render / Railway / Google Cloud Run          │
│  Database:     Supabase / Neon (500MB free PostgreSQL)      │
│  File Storage: Cloudflare R2 (10GB free, no egress fees)    │
│  Redis Cache:  Upstash (10,000 requests/day free)           │
│  Queue:        Upstash Redis (can replace RabbitMQ)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. FREE Database Options

### Option A: Supabase (RECOMMENDED)
- **Free tier**: 500MB PostgreSQL + Auth + Storage
- **URL**: https://supabase.com
- **Setup time**: 5 minutes

```yaml
# Update application-test.yml / application-accp.yml
spring:
  datasource:
    url: jdbc:postgresql://db.xxxx.supabase.co:5432/postgres
    username: postgres
    password: YOUR_SUPABASE_PASSWORD
```

### Option B: Neon
- **Free tier**: 0.5GB storage, 3GB data transfer
- **URL**: https://neon.tech
- **Best for**: Serverless (auto-scales to zero)

### Option C: CockroachDB
- **Free tier**: 5GB storage
- **URL**: https://cockroachlabs.cloud
- **Note**: PostgreSQL compatible

### Option D: PlanetScale
- **Free tier**: 5GB storage, 1 billion row reads/month
- **URL**: https://planetscale.com
- **Note**: MySQL (need minor code changes)

---

## 2. FREE Frontend Hosting

### Vercel (RECOMMENDED)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd apps/frontend
npm run build -- --configuration=production
vercel --prod
```

**Free includes:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Preview deployments for PRs

### Cloudflare Pages (Alternative)
```bash
# Deploy via Cloudflare dashboard
# Or use Wrangler CLI
npm i -g wrangler
wrangler pages deploy dist/dubber
```

---

## 3. FREE Backend Hosting

### Option A: Render
- **Free tier**: 750 hours/month (sleeps after 15 min inactivity)
- **URL**: https://render.com

```yaml
# render.yaml - place in repo root
services:
  - type: web
    name: dubber-api
    env: docker
    dockerfilePath: ./apps/api-gateway/Dockerfile
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: accp
      - key: SPRING_DATASOURCE_URL
        fromDatabase:
          name: dubber-db
          property: connectionString
```

### Option B: Google Cloud Run (RECOMMENDED for your case)
- **Free tier**: 2 million requests/month, 360,000 GB-seconds
- **No sleep** - always available
- **URL**: https://cloud.google.com/run

```bash
# Build and deploy
gcloud run deploy dubber-api \
  --source ./apps/api-gateway \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option C: Fly.io
- **Free tier**: 3 shared VMs, 160GB outbound data
- **URL**: https://fly.io

---

## 4. FREE File Storage (for Videos)

### Cloudflare R2 (BEST)
- **Free**: 10GB storage, 10 million reads, 1 million writes
- **No egress fees** (unlike AWS S3)
- **S3 compatible** (works with MinIO client)

```yaml
# Update your application
minio:
  endpoint: https://YOUR_ACCOUNT.r2.cloudflarestorage.com
  access-key: YOUR_R2_ACCESS_KEY
  secret-key: YOUR_R2_SECRET_KEY
```

### Backblaze B2 (Alternative)
- **Free**: 10GB storage
- **URL**: https://www.backblaze.com/b2

---

## 5. FREE Redis/Queue

### Upstash (RECOMMENDED)
- **Free tier**: 10,000 commands/day
- **URL**: https://upstash.com

Replace RabbitMQ with Redis-based queuing:
```yaml
spring:
  redis:
    host: YOUR_UPSTASH_ENDPOINT
    port: 6379
    password: YOUR_UPSTASH_PASSWORD
    ssl: true
```

---

## 6. Complete FREE Architecture

```mermaid
graph TB
    subgraph "Frontend (Vercel/Cloudflare)"
        FE[Angular App]
    end
    
    subgraph "Backend (Google Cloud Run)"
        API[API Gateway]
    end
    
    subgraph "Database (Supabase)"
        DB[(PostgreSQL)]
    end
    
    subgraph "Storage (Cloudflare R2)"
        S3[Video Files]
    end
    
    subgraph "Cache (Upstash)"
        REDIS[Redis]
    end
    
    FE --> API
    API --> DB
    API --> S3
    API --> REDIS
```

---

## 7. Step-by-Step Free Deployment

### Step 1: Create Free Accounts (5 minutes each)
1. [Supabase](https://supabase.com) - Database
2. [Vercel](https://vercel.com) - Frontend
3. [Google Cloud](https://cloud.google.com) - Backend (free tier)
4. [Cloudflare](https://cloudflare.com) - R2 Storage
5. [Upstash](https://upstash.com) - Redis

### Step 2: Configure Environment Variables
Create a `.env.cloud` file (don't commit this):
```bash
# Database (from Supabase dashboard)
SPRING_DATASOURCE_URL=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password

# Storage (from Cloudflare R2 dashboard)
MINIO_ENDPOINT=https://xxx.r2.cloudflarestorage.com
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key

# Redis (from Upstash dashboard)
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
```

### Step 3: Deploy Frontend
```bash
cd apps/frontend
npm run build -- --configuration=production
npx vercel --prod
```

### Step 4: Deploy Backend
```bash
# Using Google Cloud Run
gcloud run deploy dubber-api \
  --source ./apps/api-gateway \
  --set-env-vars "$(cat .env.cloud | tr '\n' ',')"
```

---

## 8. Deployment Flow (No Manual Deploy Needed)

Once set up, the CI/CD pipeline handles everything:

```
You push code → GitHub Actions builds → Auto-deploys to cloud
     ↓                    ↓                      ↓
  git push         Tests pass            App updates
```

**Your local machine is NOT needed after initial setup!**

---

## 9. Resource Limits Comparison

| Service | Free Tier | Enough For |
|---------|-----------|------------|
| Supabase DB | 500MB | ~100K jobs |
| Cloudflare R2 | 10GB | ~100 videos |
| Google Cloud Run | 2M requests | ~67K/day |
| Vercel | Unlimited | Unlimited |
| Upstash Redis | 10K/day | Moderate usage |

---

## 10. Performance Tips for Low RAM

Since your local machine has low RAM:

1. **Use Docker with limits:**
```yaml
services:
  api-gateway:
    deploy:
      resources:
        limits:
          memory: 512M
```

2. **Run fewer services locally:**
```powershell
# Only run frontend locally, use cloud for everything else
cd apps/frontend
ng serve
```

3. **Use cloud for heavy processing:**
   - Video processing runs in cloud, not your machine
   - Once deployed, your machine is only needed for code editing

---

## Quick Reference Card

| Need | Free Service | Link |
|------|-------------|------|
| PostgreSQL | Supabase | supabase.com |
| Frontend Host | Vercel | vercel.com |
| Backend Host | Cloud Run | cloud.google.com/run |
| File Storage | Cloudflare R2 | cloudflare.com |
| Redis Cache | Upstash | upstash.com |
| CI/CD | GitHub Actions | github.com |

**Total Monthly Cost: $0** 🎉

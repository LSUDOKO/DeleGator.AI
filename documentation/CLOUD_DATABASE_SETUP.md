# ⚡ Quick Cloud Database Setup (5 minutes)

**Problem:** PostgreSQL and Redis not installed locally  
**Solution:** Use free cloud services (no installation needed!)

---

## Option 1: Neon (PostgreSQL) - FASTEST ⚡

### Step 1: Get Free PostgreSQL from Neon

1. **Go to:** https://neon.tech/
2. **Sign up** (free, no credit card needed)
3. **Create a project** (takes 10 seconds)
4. **Copy the connection string** - looks like:
   ```
   postgresql://user:password@ep-cool-name.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Update Backend .env

Open `backend/.env` and replace the DATABASE_URL:

```bash
DATABASE_URL="postgresql://user:password@ep-cool-name.region.aws.neon.tech/neondb?sslmode=require"
```

---

## Option 2: Upstash (Redis) - FASTEST ⚡

### Step 1: Get Free Redis from Upstash

1. **Go to:** https://upstash.com/
2. **Sign up** (free, no credit card)
3. **Create a Redis database**
4. **Copy connection details:**
   - Endpoint (host)
   - Port (usually 6379)
   - Password

### Step 2: Update Backend .env

Open `backend/.env` and update Redis settings:

```bash
REDIS_HOST=your-endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password-here
```

---

## Alternative: ElephantSQL (PostgreSQL) + Upstash (Redis)

### PostgreSQL from ElephantSQL

1. **Go to:** https://www.elephantsql.com/
2. **Sign up** (free tier: 20MB storage)
3. **Create instance**
4. **Copy URL** from details page
5. **Update** `backend/.env`:
   ```bash
   DATABASE_URL="postgres://user:pass@hostname/database"
   ```

### Redis from Upstash
(Same as Option 2 above)

---

## After Setup: Run Migrations

Once you have your DATABASE_URL configured:

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Start API
npm run start:api
```

---

## Quick Comparison

| Service | Database | Free Tier | Speed | Link |
|---------|----------|-----------|-------|------|
| **Neon** | PostgreSQL | 3GB storage | ⚡⚡⚡ Fastest | https://neon.tech |
| **ElephantSQL** | PostgreSQL | 20MB storage | ⚡⚡ Fast | https://elephantsql.com |
| **Upstash** | Redis | 10K commands/day | ⚡⚡⚡ Fastest | https://upstash.com |

---

## Recommended: Neon + Upstash

**Total time:** 5 minutes  
**Cost:** $0 (free forever)  
**Setup difficulty:** Very easy

---

## Still Want Local Installation?

If you prefer local databases, see: `LOCAL_DATABASE_SETUP.md`

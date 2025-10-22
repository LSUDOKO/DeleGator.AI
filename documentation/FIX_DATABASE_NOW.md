# 🚨 Fix Database Connection - Choose Your Path

**Current Error:** `Can't reach database server at localhost:5432`

**Cause:** PostgreSQL and Redis are not installed/running

---

## 🎯 Choose One Path (Pick the Fastest!)

### Path 1: Cloud Databases (⚡ FASTEST - 5 minutes)
**Best for:** Hackathons, demos, quick testing  
**Advantages:** No installation, works immediately, free

#### Steps:
1. **Get Neon PostgreSQL** (2 min)
   - Go to https://neon.tech
   - Sign up (free, no card)
   - Create project
   - Copy connection string

2. **Get Upstash Redis** (2 min)
   - Go to https://upstash.com
   - Sign up (free, no card)
   - Create database
   - Copy host/port/password

3. **Update backend/.env** (1 min)
   ```bash
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
   REDIS_HOST=xxx.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-password
   ```

4. **Run migrations & start**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run start:api
   ```

**See:** `CLOUD_DATABASE_SETUP.md` for detailed instructions

---

### Path 2: Local Installation (🐢 SLOWER - 15-30 minutes)
**Best for:** Long-term development, offline work  
**Advantages:** Full control, no internet dependency

#### Ubuntu/Debian:
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql

# Install Redis
sudo apt install redis-server -y
sudo systemctl start redis-server

# Setup database
sudo -u postgres psql
CREATE DATABASE rebased;
CREATE USER rebased WITH PASSWORD 'rebased123';
GRANT ALL PRIVILEGES ON DATABASE rebased TO rebased;
\q

# Update backend/.env
DATABASE_URL="postgresql://rebased:rebased123@localhost:5432/rebased?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Run migrations
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run start:api
```

**See:** `LOCAL_DATABASE_SETUP.md` for detailed instructions

---

### Path 3: Frontend Only (⚡ INSTANT - 2 minutes)
**Best for:** Just want to see the UI  
**Note:** Backend features won't work, but you can still demo the frontend

#### Steps:
```bash
cd frontend
npm run dev
# Visit http://localhost:5173
```

This lets you show:
- ✅ Beautiful UI
- ✅ AI chat interface
- ✅ Visual strategy builder
- ✅ Wallet connection
- ⚠️ Can't create real strategies (no backend)

---

## 🏆 Recommended for Hackathon: Path 1 (Cloud)

**Why?**
- Fastest setup (5 min vs 30 min)
- No system configuration needed
- Free tier is generous
- More reliable for demos
- Easy to share with team

**Free Tiers:**
- Neon: 3GB storage, 100 hours compute/month
- Upstash: 10K commands/day

---

## 📋 Quick Decision Matrix

| Factor | Cloud (Path 1) | Local (Path 2) | Frontend Only (Path 3) |
|--------|----------------|----------------|------------------------|
| Setup Time | ⚡ 5 min | 🐢 30 min | ⚡⚡ 2 min |
| Cost | 💰 Free | 💰 Free | 💰 Free |
| Installation | ❌ None | ✅ Required | ❌ None |
| Full Features | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Internet | ✅ Required | ❌ Not needed | ✅ Required |
| Best For | 🏆 Hackathon | 💻 Development | 🎨 UI Demo |

---

## 🚀 Next Commands (Based on Your Choice)

### If you chose Path 1 (Cloud):
```bash
# After getting cloud database credentials:
nano backend/.env
# Update DATABASE_URL, REDIS_HOST, etc.

cd backend
npm run prisma:generate
npm run prisma:migrate
npm run start:api
```

### If you chose Path 2 (Local):
```bash
# Install databases first, then:
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run start:api
```

### If you chose Path 3 (Frontend Only):
```bash
cd frontend
npm run dev
```

---

## 💡 My Recommendation

**For your hackathon, go with Path 1 (Cloud Databases):**

1. Open https://neon.tech → Sign up → Create project → Copy URL
2. Open https://upstash.com → Sign up → Create Redis → Copy details
3. Update `backend/.env` with credentials
4. Run: `npm run prisma:migrate && npm run start:api`

**Total time:** 5 minutes  
**Result:** Fully working backend with all features!

---

## Need Help?

- **Cloud Setup:** See `CLOUD_DATABASE_SETUP.md`
- **Local Setup:** See `LOCAL_DATABASE_SETUP.md`
- **General Guide:** See `SETUP_GUIDE.md`

**Current issue:** Your backend can't start because databases aren't configured.  
**Solution:** Pick a path above and follow the steps! 🚀

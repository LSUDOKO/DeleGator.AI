# 🚀 Quick Start Guide - DeleGator.AI

## ✅ Everything is Fixed and Ready!

### What Was Fixed

1. ✅ **Import errors fixed** - Changed `@rebased/queue` to `@app/queue`
2. ✅ **Database setup** - Local PostgreSQL configured and migrations applied
3. ✅ **Envio configuration** - Restored DeleGator.AI config (was overwritten)
4. ✅ **Environment variables** - All secrets and URLs configured

---

## 🎯 Start Your App (3 Commands)

### Terminal 1: Start Backend API
```bash
cd backend
npm run start:api
```
**Runs on:** http://localhost:3000

### Terminal 2: Start Bot Worker
```bash
cd backend
npm run start:bot
```
**Does:** Monitors strategies and executes rebalances

### Terminal 3: Start Envio (Optional)
```bash
cd backend/apps/indexer/envio
export PATH="$HOME/.local/bin:$PATH"
npm run dev
```
**Provides:** GraphQL API on http://localhost:8080

---

## 📊 What's Running

```
┌─────────────────────────────────────┐
│     Backend API (Port 3000)         │
│  • REST endpoints                   │
│  • Webhook receiver                 │
│  • Database: delegator_ai           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Bot Worker (Background)         │
│  • Strategy monitoring              │
│  • Auto rebalancing                 │
│  • Event processing                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Envio Indexer (Port 8080)         │
│  • Blockchain event indexing        │
│  • GraphQL API                      │
│  • Database: envio_indexer          │
└─────────────────────────────────────┘
```

---

## 🗄️ Databases

Both databases are on local PostgreSQL:

1. **delegator_ai** - Main application data
2. **envio_indexer** - Blockchain indexed data

**Check databases:**
```bash
psql -U postgres -l
```

---

## ✅ Verification

### Check Backend API
```bash
curl http://localhost:3000/health
```

### Check Bot Worker
Look for this in logs:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
```

### Check Envio
```bash
curl http://localhost:8080/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ ChainStats { chainId } }"}'
```

---

## 🔧 Configuration Summary

### Backend `.env`
- ✅ `DATABASE_URL` - Points to local PostgreSQL
- ✅ `WEBHOOK_SECRET` - Matches Envio secret
- ✅ All other vars from `.env.example`

### Envio `.env`
- ✅ `DATABASE_URL` - Points to envio_indexer
- ✅ `WEBHOOK_SECRET` - Matches backend secret
- ✅ `BACKEND_WEBHOOK_URL` - Points to localhost:3000

---

## 🐛 Common Issues

### "Can't reach database"
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Verify it's running
sudo systemctl status postgresql
```

### "Module not found"
```bash
# Rebuild
cd backend
npm install
npm run build
```

### "Port already in use"
```bash
# Kill existing processes
pkill -f "nest start"
pkill -f "envio dev"
```

---

## 📝 Important Files

- `SETUP_COMPLETE_FINAL.md` - Detailed setup documentation
- `START_ALL.sh` - Auto-start script (opens terminals)
- `backend/.env` - Backend configuration
- `backend/apps/indexer/envio/.env` - Envio configuration

---

## 🎉 You're Ready!

Just run the 2-3 commands above and your DeleGator.AI backend will be fully operational!

**Questions?** Check `SETUP_COMPLETE_FINAL.md` for detailed docs.

---

**Happy Building! 🚀**

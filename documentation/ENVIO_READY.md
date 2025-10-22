# 🎉 Envio HyperIndex - Ready to Run!

## ✅ Setup Complete

All Envio files are in place and ready to use!

### What's Been Set Up

```
✅ Envio CLI installed (v2.30.1)
✅ Contract ABIs copied (5 contracts)
✅ Configuration files created
✅ GraphQL schema defined
✅ Event handlers implemented
✅ Backend webhook endpoint added
✅ Documentation complete
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Secrets

**Edit:** `backend/apps/indexer/envio/.env`

```bash
WEBHOOK_SECRET=delegator-ai-secret-change-this
BACKEND_WEBHOOK_URL=http://localhost:3000/indexer/webhook
ENVIO_POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/envio_indexer
```

**Edit:** `backend/.env` (add this line)

```bash
WEBHOOK_SECRET=delegator-ai-secret-change-this
```

**⚠️ Important:** Secrets must match!

### Step 2: Create Database (if using local PostgreSQL)

```bash
createdb envio_indexer
```

**Or skip this** if using cloud PostgreSQL (Neon, ElephantSQL)

### Step 3: Start Services

**Terminal 1 - Backend API:**
```bash
cd backend
npm run start:api
```

**Terminal 2 - Envio Indexer:**
```bash
cd backend/apps/indexer/envio
npm run init    # First time only
npm run dev     # Start indexing
```

---

## 🔍 What You'll Get

### GraphQL API
**URL:** http://localhost:8080/v1/graphql

Query indexed blockchain data:
- Strategies
- Delegations
- Rebalances
- Price feeds
- Swap history
- Chain statistics

### Real-time Indexing
- Events indexed as they happen
- Automatic backfilling
- Reorg handling
- Webhook notifications to backend

### Backend Integration
- Events trigger BotWorker
- Automatic rebalance execution
- WebSocket notifications
- PostgreSQL storage

---

## 📊 Architecture

```
Blockchain (Monad + Base)
       ↓
   Envio HyperIndex
       ↓
   ├─→ GraphQL Store (port 8080)
   └─→ Backend Webhook (port 3000)
       ↓
   Bull Queue → Event Processor → BotWorker
```

---

## 🎯 Example Flow

1. **User creates strategy** via frontend
2. **StrategyCreated event** emitted on blockchain
3. **Envio indexes event** in real-time
4. **Stores in GraphQL** database
5. **Sends webhook** to backend
6. **Backend enqueues** event for processing
7. **Event processor** updates PostgreSQL
8. **WebSocket notification** sent to user
9. **BotWorker monitors** for rebalance conditions

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `ENVIO_INTEGRATION.md` | Complete integration guide |
| `backend/apps/indexer/envio/README.md` | Envio documentation |
| `backend/apps/indexer/envio/STATUS.md` | Current setup status |
| `backend/apps/indexer/envio/.env.example` | Environment template |

---

## 🐛 Troubleshooting

### Can't connect to database
```bash
# Check PostgreSQL is running
pg_isready

# Or use cloud database (easier)
# Update ENVIO_POSTGRES_URL in .env
```

### Webhook failing
```bash
# Check secrets match
grep WEBHOOK_SECRET backend/apps/indexer/envio/.env
grep WEBHOOK_SECRET backend/.env

# Check backend is running
curl http://localhost:3000/health
```

### Envio won't start
```bash
cd backend/apps/indexer/envio

# Regenerate code
npm run codegen

# Reset database (WARNING: deletes data)
npx envio reset
```

---

## ✅ Verification Checklist

Before running:
- [ ] Backend `.env` has `WEBHOOK_SECRET`
- [ ] Envio `.env` has matching `WEBHOOK_SECRET`
- [ ] PostgreSQL database `envio_indexer` exists (or cloud URL configured)
- [ ] Backend API running on port 3000
- [ ] Contract ABIs in `backend/apps/indexer/envio/abis/`

Then run:
```bash
cd backend/apps/indexer/envio
npm run dev
```

---

## 🎉 You're Ready!

Everything is set up. Just:

1. **Configure secrets** in both `.env` files
2. **Create database** (or use cloud)
3. **Run `npm run dev`** in envio directory

**GraphQL API will be at:** http://localhost:8080/v1/graphql

**Happy indexing!** 🚀

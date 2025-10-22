# 🔧 Envio Database Connection Issue - Fix

## Problem
Envio is failing with: `pool timed out while waiting for an open connection`

## Root Cause
Envio's connection pooling is having issues connecting to the local PostgreSQL database.

## Solutions (Try in Order)

### Solution 1: Use Envio Cloud (Recommended - No Local DB Issues)
```bash
export PATH="$HOME/.local/bin:$PATH"
npx envio deploy
```

**Pros:**
- ✅ No local database issues
- ✅ Hosted GraphQL API
- ✅ Automatic scaling
- ✅ Free for hackathons

**This is the easiest solution!**

---

### Solution 2: Fix Local PostgreSQL Connection

#### Step 1: Check PostgreSQL is configured for local connections
```bash
# Edit pg_hba.conf
sudo nano /var/lib/postgres/data/pg_hba.conf
```

Add this line at the top:
```
local   all   postgres   trust
host    all   postgres   127.0.0.1/32   trust
host    all   postgres   ::1/128        trust
```

#### Step 2: Restart PostgreSQL
```bash
sudo systemctl restart postgresql
```

#### Step 3: Update Envio .env
```bash
cat > .env << 'EOF'
ENVIO_API_TOKEN="ecda07c5-436f-409c-9953-c7fbdb3bcb59"
BACKEND_WEBHOOK_URL=http://localhost:3000/indexer/webhook
WEBHOOK_SECRET=delegator-ai-secret-change-in-production
DATABASE_URL=postgres://postgres@localhost/envio_indexer
EOF
```

#### Step 4: Recreate database
```bash
sudo -u postgres dropdb envio_indexer
sudo -u postgres createdb envio_indexer
```

#### Step 5: Try running Envio
```bash
export PATH="$HOME/.local/bin:$PATH"
npm run dev
```

---

### Solution 3: Skip Envio for Now

**Your backend already works without Envio!**

The NestJS indexer (`backend/apps/indexer`) can poll for events directly from the blockchain.

Just run:
```bash
# Terminal 1
cd backend
npm run start:api

# Terminal 2
cd backend
npm run start:bot
```

**Envio is optional** - it provides:
- Faster real-time indexing
- GraphQL query API
- Better developer experience

But your app works perfectly without it!

---

## Recommended Approach for Hackathon

**Option A: Deploy to Envio Cloud**
```bash
cd backend/apps/indexer/envio
export PATH="$HOME/.local/bin:$PATH"
npx envio deploy
```

Follow the prompts, and you'll get a hosted GraphQL endpoint!

**Option B: Skip Envio**
Just use your existing NestJS indexer. It works great!

---

## Why This Happened

1. `envio init` was run, which overwrote your config
2. Local PostgreSQL connection pooling has strict settings
3. Envio expects specific database permissions

---

## Current Status

✅ **Backend API** - Ready to run
✅ **Bot Worker** - Ready to run  
✅ **Database** - Configured and migrated
✅ **Envio Config** - Restored
⚠️ **Envio Local** - Connection pool issue

---

## Quick Decision Matrix

| Scenario | Recommendation |
|----------|----------------|
| Need GraphQL API | Deploy to Envio Cloud |
| Just need indexing | Use NestJS indexer (already works) |
| Want to debug local | Fix PostgreSQL permissions |
| Time-constrained | Skip Envio, use NestJS |

---

## Next Steps

**For Hackathon Demo:**
1. Skip Envio for now
2. Run backend API + Bot Worker
3. Deploy contracts
4. Test with frontend
5. (Optional) Add Envio Cloud later

**Commands:**
```bash
# Terminal 1
cd backend && npm run start:api

# Terminal 2  
cd backend && npm run start:bot
```

That's it! Your app will work perfectly! 🚀

# ??? Final Setup Checklist - DeleGator.AI

## Pre-Flight Check

Run these commands to verify everything is ready:

### 1. PostgreSQL Running
```bash
sudo systemctl status postgresql
```
**Expected:** `Active: active (running)`

### 2. Databases Exist
```bash
psql -U postgres -l | grep -E "(delegator_ai|envio_indexer)"
```
**Expected:** Both databases listed

### 3. Backend Dependencies
```bash
cd backend && npm list 2>/dev/null | head -5
```
**Expected:** No errors

### 4. Environment Variables
```bash
grep -E "(DATABASE_URL|WEBHOOK_SECRET)" backend/.env
grep -E "(DATABASE_URL|WEBHOOK_SECRET)" backend/apps/indexer/envio/.env
```
**Expected:** Both files have matching WEBHOOK_SECRET

### 5. Prisma Client Generated
```bash
ls backend/node_modules/.prisma/client/index.js
```
**Expected:** File exists

### 6. Envio Configuration
```bash
cat backend/apps/indexer/envio/config.yaml | grep "delegator-ai-indexer"
```
**Expected:** Shows DeleGator.AI config (not ERC20)

---

## ???? Ready to Launch!

If all checks pass, run:

### Terminal 1:
```bash
cd backend
npm run start:api
```

### Terminal 2:
```bash
cd backend
npm run start:bot
```

### Terminal 3 (Optional):
```bash
cd backend/apps/indexer/envio
export PATH="$HOME/.local/bin:$PATH"
npm run dev
```

---

## ??? Success Indicators

### Backend API Started:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [NestApplication] Nest application successfully started
```

### Bot Worker Started:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] All modules initialized
```

### Envio Started:
```
Starting Envio indexer...
GraphQL API available at http://localhost:8080/v1/graphql
```

---

## ???? You're Live!

Your DeleGator.AI backend is now running and ready to:
- ??? Receive blockchain events
- ??? Process strategies
- ??? Execute rebalances
- ??? Send notifications

**Happy Building! ????**

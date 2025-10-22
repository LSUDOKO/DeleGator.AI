# ✅ Envio Setup Status

## Completed Steps

- ✅ **Envio CLI installed** (v2.30.1)
- ✅ **Contract ABIs copied** (5 contracts)
- ✅ **Configuration created** (config.yaml)
- ✅ **GraphQL schema defined** (schema.graphql)
- ✅ **Event handlers implemented** (src/EventHandlers.ts)
- ✅ **Environment file created** (.env)
- ✅ **Package dependencies installed**

## Files Ready

```
backend/apps/indexer/envio/
├── ✅ config.yaml              # Network & contract config
├── ✅ schema.graphql           # GraphQL entities
├── ✅ src/EventHandlers.ts     # Event processing logic
├── ✅ package.json             # Dependencies
├── ✅ .env                     # Environment variables
└── ✅ abis/                    # Contract ABIs (5 files)
    ├── DelegationManager.json
    ├── PythOracle.json
    ├── RebalanceExecutor.json
    ├── StrategyRegistry.json
    └── UniswapHelper.json
```

## Next Steps

### 1. Configure Environment Variables

Edit `.env` and update:

```bash
# Backend webhook URL (where Envio sends events)
BACKEND_WEBHOOK_URL=http://localhost:3000/indexer/webhook

# Shared secret for webhook authentication
WEBHOOK_SECRET=your-secret-here-change-this

# Envio database (separate from main app database)
ENVIO_POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/envio_indexer
```

### 2. Add Webhook Secret to Backend

Edit `backend/.env` and add:

```bash
WEBHOOK_SECRET=your-secret-here-change-this
```

**⚠️ Important:** The `WEBHOOK_SECRET` must match in both files!

### 3. Create Envio Database

```bash
# If PostgreSQL is installed locally:
createdb envio_indexer

# Or using psql:
psql -U postgres -c "CREATE DATABASE envio_indexer;"
```

**Alternative:** Use a cloud PostgreSQL service (Neon, ElephantSQL, etc.)

### 4. Initialize Envio

```bash
npm run init
```

This will:
- Set up the Envio project structure
- Generate TypeScript types
- Prepare the indexer

### 5. Start Envio Indexer

```bash
npm run dev
```

This will:
- Start indexing from block 0 (or last synced block)
- Expose GraphQL API at `http://localhost:8080/v1/graphql`
- Send events to backend webhook
- Auto-reload on code changes

## Testing

### 1. Check Envio is Running

```bash
# GraphQL playground
open http://localhost:8080/v1/graphql

# Or via curl
curl http://localhost:8080/v1/graphql -H "Content-Type: application/json" -d '{
  "query": "{ ChainStats { chainId totalStrategies } }"
}'
```

### 2. Check Backend Webhook

```bash
# Ensure backend API is running
curl http://localhost:3000/health

# Check indexer webhook endpoint
curl http://localhost:3000/indexer/health
```

### 3. Monitor Logs

```bash
# Envio logs (in the terminal running npm run dev)
# Backend logs (in the terminal running npm run start:api)
```

## Troubleshooting

### Envio won't start

```bash
# Check database connection
psql $ENVIO_POSTGRES_URL -c "SELECT 1;"

# Reset Envio (WARNING: deletes indexed data)
npx envio reset
```

### Webhook errors

```bash
# Verify secrets match
grep WEBHOOK_SECRET .env
grep WEBHOOK_SECRET ../../../.env

# Check backend is running
curl http://localhost:3000/health
```

### Missing types/compilation errors

```bash
# Regenerate code
npm run codegen
```

## Running the Full Stack

**Terminal 1 - Backend API:**
```bash
cd backend
npm run start:api
```

**Terminal 2 - Envio Indexer:**
```bash
cd backend/apps/indexer/envio
npm run dev
```

**Terminal 3 - Bot Worker (optional):**
```bash
cd backend
npm run start:bot
```

**Terminal 4 - Frontend (optional):**
```bash
cd frontend
npm run dev
```

## What Happens Next

Once Envio starts:

1. **Indexes blockchain events** from Monad + Base
2. **Stores data** in GraphQL database
3. **Sends webhooks** to backend API
4. **Backend processes** events and triggers BotWorker
5. **Users can query** indexed data via GraphQL

## GraphQL API

**Endpoint:** http://localhost:8080/v1/graphql

**Example Queries:**

```graphql
# Get all strategies
query {
  Strategy {
    id
    user
    tokens
    weights
    isActive
  }
}

# Get rebalance history
query {
  Rebalance(order_by: { executedAt: desc }) {
    txHash
    driftBps
    status
    executedAt
  }
}

# Get chain stats
query {
  ChainStats {
    chainId
    totalStrategies
    totalRebalances
    successfulRebalances
  }
}
```

## Documentation

- **Full Guide:** `ENVIO_INTEGRATION.md` (in project root)
- **Envio README:** `README.md` (this directory)
- **Envio Docs:** https://docs.envio.dev/

---

**Status:** Ready to initialize and run! 🚀

**Next command:** `npm run init`

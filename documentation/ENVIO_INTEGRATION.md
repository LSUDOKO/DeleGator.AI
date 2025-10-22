# 🔍 Envio HyperIndex Integration - Complete Guide

## 🎉 What's Been Added

I've integrated **Envio HyperIndex** as your real-time blockchain indexer! This gives you:

✅ **GraphQL API** - Query indexed blockchain data  
✅ **Real-time indexing** - Events indexed as they happen  
✅ **Backend integration** - Triggers your BotWorker automatically  
✅ **Dual storage** - Envio GraphQL store + your PostgreSQL database  
✅ **Multi-chain** - Monad Testnet + Base Sepolia  

---

## 📁 New Files Created

### Envio Project (`backend/apps/indexer/envio/`)

```
backend/apps/indexer/envio/
├── config.yaml              # Envio configuration (networks, contracts, events)
├── schema.graphql           # GraphQL entities (Strategy, Delegation, Rebalance, etc.)
├── src/
│   └── EventHandlers.ts     # Event handlers (store + webhook relay)
├── package.json             # Envio dependencies
├── .env.example             # Environment template
├── README.md                # Complete documentation
├── setup.sh                 # Automated setup script
└── copy-abis.sh             # Copy contract ABIs from Foundry
```

### Backend API (`backend/apps/api/src/indexer/`)

```
backend/apps/api/src/indexer/
├── indexer.controller.ts    # POST /indexer/webhook endpoint
└── indexer.module.ts        # NestJS module
```

### Updated Files

- `backend/apps/api/src/app.module.ts` - Added IndexerModule
- `backend/apps/indexer/src/EventHandlers.ts` - Cleaned up (removed old Greeter example)
- `backend/apps/indexer/src/listeners/chain-listener.service.ts` - Fixed logIndex
- `backend/apps/indexer/src/processors/event.processor.ts` - Fixed Prisma schema compatibility

---

## 🏗️ Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  BLOCKCHAIN (Monad Testnet + Base Sepolia)                  │
│  • StrategyRegistry                                          │
│  • DelegationManager                                         │
│  • RebalanceExecutor                                         │
│  • PythOracle                                                │
│  • UniswapHelper                                             │
└────────────────┬────────────────────────────────────────────┘
                 │ Events emitted
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ENVIO HYPERINDEX                                            │
│  • Indexes events in real-time                               │
│  • Stores in GraphQL database                                │
│  • Exposes GraphQL API (port 8080)                           │
└────────┬────────────────────────────────┬───────────────────┘
         │                                │
         │ Store                          │ Webhook
         ▼                                ▼
┌──────────────────┐          ┌──────────────────────────────┐
│  GraphQL Store   │          │  Backend API (port 3000)     │
│  (Query data)    │          │  POST /indexer/webhook       │
└──────────────────┘          └────────────┬─────────────────┘
                                           │
                                           │ Enqueue
                                           ▼
                              ┌──────────────────────────────┐
                              │  Bull Queue (Redis)          │
                              │  • IndexerJobData            │
                              │  • Priority-based            │
                              └────────────┬─────────────────┘
                                           │
                                           │ Process
                                           ▼
                              ┌──────────────────────────────┐
                              │  Event Processor             │
                              │  • Updates PostgreSQL        │
                              │  • Sends WebSocket events    │
                              │  • Triggers BotWorker        │
                              └────────────┬─────────────────┘
                                           │
                                           ▼
                              ┌──────────────────────────────┐
                              │  BotWorker                   │
                              │  • Monitors strategies       │
                              │  • Calculates drift          │
                              │  • Executes rebalances       │
                              └──────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Install Envio CLI

```bash
npm install -g @envio-dev/cli
```

### 2. Setup Envio Project

```bash
cd backend/apps/indexer/envio

# Copy ABIs from contract output
./copy-abis.sh

# Run automated setup
./setup.sh

# Or manual setup:
cp .env.example .env
npm install
```

### 3. Configure Environment

Edit `backend/apps/indexer/envio/.env`:

```bash
# Backend webhook URL
BACKEND_WEBHOOK_URL=http://localhost:3000/indexer/webhook

# Shared secret (must match backend)
WEBHOOK_SECRET=delegator-ai-secret-change-in-production

# Envio database
ENVIO_POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/envio_indexer
```

Edit `backend/.env` (add this line):

```bash
# Webhook secret (must match Envio)
WEBHOOK_SECRET=delegator-ai-secret-change-in-production
```

### 4. Create Envio Database

```bash
createdb envio_indexer
```

### 5. Start Services

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

---

## 📊 What Gets Indexed

### Contracts & Events

| Contract | Events Indexed |
|----------|----------------|
| **StrategyRegistry** | StrategyCreated, StrategyUpdated, StrategyDeactivated |
| **DelegationManager** | DelegationCreated, DelegationRevoked |
| **RebalanceExecutor** | RebalanceExecuted, RebalanceFailed |
| **PythOracle** | PriceFeedUpdated |
| **UniswapHelper** | SwapExecuted |

### GraphQL Entities

- **Strategy** - User strategies with tokens, weights, intervals
- **Delegation** - ERC-7710 delegations linking users to bot
- **Rebalance** - Execution history (success/failed)
- **PriceFeed** - Latest token prices from Pyth
- **Swap** - DEX swap history
- **ChainStats** - Aggregate statistics per chain

---

## 🔍 Querying Data

### GraphQL Playground

Once Envio is running: **http://localhost:8080/v1/graphql**

### Example Queries

**Get all active strategies:**
```graphql
query {
  Strategy(where: { isActive: { _eq: true } }) {
    id
    user
    tokens
    weights
    rebalanceInterval
    delegations {
      delegate
      isActive
    }
  }
}
```

**Get rebalance history:**
```graphql
query {
  Rebalance(order_by: { executedAt: desc }, limit: 10) {
    txHash
    driftBps
    gasUsed
    status
    executedAt
    strategy {
      user
      tokens
    }
  }
}
```

**Get chain statistics:**
```graphql
query {
  ChainStats {
    chainId
    totalStrategies
    activeStrategies
    totalRebalances
    successfulRebalances
    totalGasUsed
  }
}
```

---

## 🔄 How Rebalancing Works

### Complete Flow

1. **Price Update** (Pyth Oracle)
   ```
   PriceFeedUpdated event → Envio indexes → Webhook to backend
   ```

2. **Drift Calculation** (BotWorker)
   ```
   Backend receives price update → Calculates drift for active strategies
   ```

3. **Threshold Check**
   ```
   If drift > threshold (e.g., 5%) → Trigger rebalance
   ```

4. **Delegation Verification** (DelegationManager)
   ```
   Check if user has active delegation → Verify bot permissions
   ```

5. **Execute Rebalance** (RebalanceExecutor)
   ```
   Call rebalance() → Swap via UniswapHelper → Emit RebalanceExecuted
   ```

6. **Index Result** (Envio)
   ```
   RebalanceExecuted event → Store in GraphQL → Webhook to backend
   ```

7. **Notify User** (Backend)
   ```
   Update PostgreSQL → Send WebSocket notification → Update UI
   ```

---

## 🛠️ Development

### Update Schema

```bash
cd backend/apps/indexer/envio

# Edit schema.graphql
nano schema.graphql

# Regenerate code
envio codegen
```

### Update Event Handlers

```bash
# Edit src/EventHandlers.ts
nano src/EventHandlers.ts

# Changes auto-reload in dev mode
```

### Add New Contract

1. Add to `config.yaml`:
   ```yaml
   - name: NewContract
     address: ["0x..."]
     abi_file_path: abis/NewContract.json
     events:
       - event: NewEvent(...)
   ```

2. Copy ABI:
   ```bash
   cp ../../../../../contract/out/NewContract.sol/NewContract.json abis/
   ```

3. Add handler in `src/EventHandlers.ts`

4. Restart Envio

---

## 🐛 Troubleshooting

### Envio Won't Start

```bash
# Check database
psql $ENVIO_POSTGRES_URL -c "SELECT 1;"

# Reset and restart
envio reset
envio dev
```

### Webhook Failing

```bash
# Check backend is running
curl http://localhost:3000/health

# Check webhook secret matches
grep WEBHOOK_SECRET backend/.env
grep WEBHOOK_SECRET backend/apps/indexer/envio/.env

# View backend logs
cd backend && npm run start:api
```

### Missing ABIs

```bash
cd backend/apps/indexer/envio
./copy-abis.sh
```

### Events Not Appearing

```bash
# Check Envio logs
envio logs

# Check current block
curl http://localhost:8080/v1/graphql -H "Content-Type: application/json" -d '{
  "query": "{ ChainStats { chainId lastUpdatedAtBlock } }"
}'

# Backfill from specific block
envio backfill --from-block 12345
```

---

## 📈 Monitoring

### Envio Status

```bash
# View logs
envio logs

# Check sync status
envio status
```

### Backend Queue

```bash
# Check queue health
curl http://localhost:3000/indexer/health
```

### GraphQL Queries

```bash
# Get latest indexed block
curl http://localhost:8080/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ ChainStats { chainId lastUpdatedAtBlock } }"}'
```

---

## 🚢 Deployment

### Envio Cloud (Recommended)

```bash
cd backend/apps/indexer/envio

# Login
envio login

# Deploy
envio deploy

# View deployments
envio deployments
```

### Self-Hosted

```bash
# Build
envio codegen

# Run in production
envio start
```

---

## ✅ Testing Checklist

Before running in production:

- [ ] PostgreSQL running (main app + Envio)
- [ ] Redis running
- [ ] Backend API running on port 3000
- [ ] `WEBHOOK_SECRET` matches in both `.env` files
- [ ] Contract ABIs copied to `envio/abis/`
- [ ] Envio database created (`envio_indexer`)
- [ ] Contract addresses correct in `config.yaml`
- [ ] RPC URLs accessible

Then:
```bash
# Terminal 1
cd backend && npm run start:api

# Terminal 2
cd backend/apps/indexer/envio && npm run dev
```

---

## 🎯 Key Benefits

### Why Envio?

1. **Real-time** - Events indexed instantly (< 1 second)
2. **GraphQL** - Powerful querying with relations
3. **Reliable** - Handles reorgs, retries, backfills
4. **Scalable** - Production-ready infrastructure
5. **Developer-friendly** - TypeScript, hot reload, great DX

### vs. NestJS Indexer

| Feature | Envio | NestJS Indexer |
|---------|-------|----------------|
| Speed | ⚡⚡⚡ Real-time | ⚡ Polling-based |
| Query | GraphQL API | REST API |
| Storage | PostgreSQL + GraphQL | PostgreSQL only |
| Reorg handling | ✅ Built-in | ⚠️ Manual |
| Backfilling | ✅ Easy | ⚠️ Complex |
| Monitoring | ✅ Dashboard | ⚠️ Custom |

**You can run both!** Envio for real-time + GraphQL, NestJS for custom logic.

---

## 📚 Resources

- **Envio Docs:** https://docs.envio.dev/
- **GraphQL Tutorial:** https://hasura.io/learn/graphql/intro-graphql/introduction/
- **Envio Examples:** https://github.com/enviodev/hyperindex-examples
- **DeleGator.AI Contracts:** `contract/src/`

---

## 🎉 Summary

You now have:

✅ **Envio HyperIndex** - Real-time blockchain indexer  
✅ **GraphQL API** - Query indexed data at http://localhost:8080/v1/graphql  
✅ **Backend Webhook** - POST /indexer/webhook receives events  
✅ **BotWorker Integration** - Automatic rebalance execution  
✅ **Dual Storage** - Envio GraphQL + PostgreSQL  
✅ **Multi-chain** - Monad + Base Sepolia  

### Next Steps

1. **Start Envio:**
   ```bash
   cd backend/apps/indexer/envio
   ./copy-abis.sh
   ./setup.sh
   npm run dev
   ```

2. **Test GraphQL:**
   - Open http://localhost:8080/v1/graphql
   - Run example queries

3. **Deploy Strategy:**
   - Use frontend to create a strategy
   - Watch it appear in Envio GraphQL
   - See webhook trigger in backend logs

4. **Monitor Rebalances:**
   - Query Rebalance entity in GraphQL
   - See real-time execution history

---

**Built with ❤️ for DeleGator.AI hackathon** 🚀

**"Real-time indexing, non-custodial execution, AI-powered automation."**

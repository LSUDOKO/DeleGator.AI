# 🚀 DeleGator.AI - Quick Reference Card

## ⚡ Super Quick Start (5 minutes)

```bash
# 1. Run the setup script
./quick-setup.sh

# 2. Get Privy App ID from https://dashboard.privy.io
# Update frontend/.env: VITE_PRIVY_APP_ID=your-app-id

# 3. Start frontend only (demo mode)
cd frontend && npm run dev
# Visit: http://localhost:5173
```

---

## 🔑 Required API Keys & Setup

| What | Where to Get | Required For | Free? |
|------|--------------|--------------|-------|
| **Privy App ID** | [dashboard.privy.io](https://dashboard.privy.io) | Wallet connection | ✅ Yes |
| **OpenAI API Key** | [platform.openai.com](https://platform.openai.com/api-keys) | AI strategy generation | ⚠️ Paid |
| **Bot Private Key** | MetaMask wallet export | Automated execution | ✅ Free |
| **PostgreSQL** | Local or [elephantsql.com](https://elephantsql.com) | Data storage | ✅ Free tier |
| **Redis** | Local or [upstash.com](https://upstash.com) | Job queues | ✅ Free tier |

---

## 📋 Deployed Contract Addresses (Monad Testnet)

```
DelegationManager:   0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3
StrategyRegistry:    0xD2D554C6CCC071c84696a37Fb97A377E7426bA7A
RebalanceExecutor:   0x4986DC56206C1bf061C376e1F1706d6498dfD50D
PythOracle:          0xD705648251CaaeE2c9653A9E079DA1ef3D477285
UniswapHelper:       0x485086A79d5aECD8de04E383227D43d575c75C2D
RebalancerConfig:    0x2A530D32D59CEaCFFdc9c071e29735A9E9955F61
```

**Block Explorer:** https://testnet.monadexplorer.com

---

## 🌐 Network Configuration (MetaMask)

### Monad Testnet
```
Network Name:    Monad Testnet
RPC URL:         https://testnet-rpc.monad.xyz
Chain ID:        10143
Currency Symbol: MON
Block Explorer:  https://testnet.monadexplorer.com
```

**Get Testnet Tokens:** Join Monad Discord, use faucet channel

---

## 🖥️ Service URLs (When Running)

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application UI |
| API Server | http://localhost:3000 | REST API & WebSocket |
| API Docs | http://localhost:3000/api | Swagger documentation |
| Prisma Studio | http://localhost:5555 | Database GUI (optional) |

---

## 📦 Essential Commands

### Setup
```bash
# Automated setup (recommended)
./quick-setup.sh

# Manual setup
cd frontend && npm install
cd backend && npm install
cd backend && npm run prisma:generate
cd backend && npm run prisma:migrate
```

### Start Services
```bash
# Frontend only (demo mode)
cd frontend && npm run dev

# Full stack (4 terminals)
cd backend && npm run start:api      # Terminal 1
cd backend && npm run start:bot      # Terminal 2  
cd backend && npm run start:indexer  # Terminal 3
cd frontend && npm run dev           # Terminal 4
```

### Contracts
```bash
cd contract
forge build              # Compile
forge test               # Test
forge script ...         # Deploy (already deployed!)
```

---

## ⚙️ Environment Configuration

### Frontend `.env` (Required)
```bash
VITE_PRIVY_APP_ID=your-privy-app-id-here
VITE_BACKEND_URL=http://localhost:3000
VITE_MONAD_DELEGATION_MANAGER=0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3
VITE_MONAD_STRATEGY_REGISTRY=0xD2D554C6CCC071c84696a37Fb97A377E7426bA7A
```

### Backend `.env` (If running full stack)
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/rebased"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your-long-random-secret-here-minimum-32-characters

# Bot (use a testnet wallet)
BOT_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# AI (optional)
OPENAI_API_KEY=sk-your-openai-key-here

# Contracts (already configured)
MONAD_DELEGATION_MANAGER=0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3
MONAD_REGISTRY=0xD2D554C6CCC071c84696a37Fb97A377E7426bA7A
MONAD_EXECUTOR=0x4986DC56206C1bf061C376e1F1706d6498dfD50D
```

---

## 🧪 Health Checks

```bash
# Backend API
curl http://localhost:3000/health

# Frontend
curl http://localhost:5173

# PostgreSQL
pg_isready

# Redis
redis-cli ping

# Check if services are running
lsof -i :3000  # API
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
```

---

## 🔧 Common Issues & Quick Fixes

### Can't connect to database
```bash
# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql # macOS

# Check connection
psql -U postgres -c "SELECT version();"
```

### Redis connection refused
```bash
# Start Redis
sudo service redis-server start  # Linux
brew services start redis        # macOS

# Test connection
redis-cli ping
```

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma client errors
```bash
cd backend
npm run prisma:generate
```

### MetaMask transaction failures
- Switch to Monad Testnet (Chain ID: 10143)
- Get testnet tokens from Discord faucet
- Check you have enough MON for gas

---

## 🎯 Demo Flow (5 minutes)

1. **Start Frontend**
   ```bash
   cd frontend && npm run dev
   ```

2. **Open Browser**
   - Visit: http://localhost:5173
   - Connect MetaMask wallet

3. **Add Monad Testnet**
   - Network Name: Monad Testnet
   - RPC: https://testnet-rpc.monad.xyz
   - Chain ID: 10143

4. **Create Strategy**
   - Option A: AI Chat → "Rebalance to 60% ETH, 40% USDC"
   - Option B: Visual Builder → Drag blocks

5. **View Results**
   - Check dashboard
   - View strategy details
   - Monitor portfolio

---

## 📊 Architecture Diagram

```
┌──────────────┐
│   Frontend   │ ← http://localhost:5173
│  React + AI  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Backend    │ ← http://localhost:3000
│  NestJS API  │
│  Bot Worker  │
│   Indexer    │
└──────┬───────┘
       │
       ├─► PostgreSQL (data)
       ├─► Redis (queues)
       │
       ▼
┌──────────────┐
│ Smart Contracts │ ← Monad Testnet
│  Deployed ✓  │
└──────────────┘
```

---

## 🎨 Project Structure

```
rebased-main/
├── frontend/           # React + TypeScript UI
│   ├── src/           # Components, pages, hooks
│   └── .env           # Frontend config
│
├── backend/           # NestJS microservices
│   ├── apps/          # API, Bot, Indexer
│   ├── libs/          # Shared libraries
│   └── .env           # Backend config
│
├── contract/          # Solidity smart contracts
│   ├── src/           # Contract code
│   ├── script/        # Deploy scripts
│   └── .env           # Deployment config
│
├── SETUP_GUIDE.md     # Detailed setup instructions
├── PROJECT_STATUS.md  # Current project status
├── QUICK_REFERENCE.md # This file
└── quick-setup.sh     # Automated setup script
```

---

## 📚 Documentation Links

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `SETUP_GUIDE.md` | Complete setup instructions |
| `PROJECT_STATUS.md` | Current status & checklist |
| `QUICK_REFERENCE.md` | This quick reference |
| `backend/README.md` | Backend documentation |
| `frontend/README.md` | Frontend documentation |
| `contract/README.md` | Smart contract docs |

---

## 🆘 Getting Help

### Check Logs
```bash
# Backend logs
cd backend && npm run start:api    # See console output

# Frontend logs  
cd frontend && npm run dev         # See console output

# System logs
journalctl -u postgresql           # PostgreSQL
journalctl -u redis               # Redis
```

### Test Components
```bash
# Test API
curl http://localhost:3000/health

# Test database
cd backend && npm run prisma:studio

# Test contracts
cd contract && forge test

# Test frontend build
cd frontend && npm run build
```

---

## 🏆 Hackathon Key Features

1. **AI Strategy Builder** - Natural language → blockchain
2. **Non-Custodial** - MetaMask Smart Accounts (ERC-7710)
3. **Real-Time** - WebSocket updates, live monitoring
4. **Automated** - Bot executes on your behalf
5. **Beautiful UI** - Modern, responsive design

---

## 🚀 Ready to Go?

```bash
# Quickest path to demo:
./quick-setup.sh
# Choose option 2 (Frontend Only)
# Get Privy App ID
# Update frontend/.env
cd frontend && npm run dev
# Visit http://localhost:5173
```

---

**Need more details?** → See `SETUP_GUIDE.md`  
**Want full status?** → See `PROJECT_STATUS.md`  
**Ready to code?** → See component READMEs

**"DeleGator.AI — The AI that acts, but never takes custody."** 🧠

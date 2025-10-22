# 🚀 DeleGator.AI - Complete Setup Guide

## 📋 Current Status

### ✅ What's Ready
- ✅ Smart contracts deployed to Monad Testnet
- ✅ Forge/Foundry installed and working
- ✅ Project structure complete
- ✅ All source code implemented

### ⚠️ What Needs Setup
- ⚠️ Backend dependencies not installed
- ⚠️ Frontend dependencies not installed  
- ⚠️ Backend `.env` file missing
- ⚠️ Docker not available (PostgreSQL & Redis needed)

---

## 🎯 Quick Start (Choose Your Path)

### Path 1: Full Stack Development (Recommended)
Complete setup with all services running locally.

### Path 2: Frontend Only
Just run the frontend with existing deployed contracts.

### Path 3: Smart Contracts Only
Work on contracts and deployment.

---

## 📦 Prerequisites

### Required
- ✅ **Node.js 20+** - [Download](https://nodejs.org/)
- ✅ **npm or yarn**
- ✅ **Git**

### For Backend (if running full stack)
- **PostgreSQL 16+** - [Download](https://www.postgresql.org/download/)
- **Redis 7+** - [Download](https://redis.io/download/)
- OR use cloud services (ElephantSQL, Upstash Redis)

### For Smart Contracts (already set up)
- ✅ **Foundry/Forge** - Already installed!

---

## 🏗️ Setup Instructions

## Part 1: Backend Setup

### Step 1.1: Install Dependencies

```bash
cd backend
npm install
```

### Step 1.2: Create Environment File

```bash
cp .env.example .env
```

### Step 1.3: Configure Backend `.env`

Edit `backend/.env` with your values:

```bash
# REQUIRED - Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rebased?schema=public"

# REQUIRED - Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# REQUIRED - JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random

# REQUIRED - Bot Private Key (for automated execution)
# IMPORTANT: Use a testnet wallet with some test ETH on Monad
BOT_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# OPTIONAL - OpenAI (for AI strategy generation)
OPENAI_API_KEY=sk-your-openai-key-here

# Contract Addresses (Already deployed!)
MONAD_REGISTRY=0xD2D554C6CCC071c84696a37Fb97A377E7426bA7A
MONAD_EXECUTOR=0x4986DC56206C1bf061C376e1F1706d6498dfD50D
MONAD_ORACLE=0xD705648251CaaeE2c9653A9E079DA1ef3D477285
MONAD_UNISWAP_HELPER=0x485086A79d5aECD8de04E383227D43d575c75C2D
MONAD_CONFIG=0x2A530D32D59CEaCFFdc9c071e29735A9E9955F61
MONAD_DELEGATION_MANAGER=0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3
```

### Step 1.4: Setup Database

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (if not installed)
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS:
brew install postgresql@16

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql@16  # macOS

# Create database
createdb rebased

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rebased?schema=public"
```

#### Option B: Cloud PostgreSQL (Easier!)

1. Go to [ElephantSQL](https://www.elephantsql.com/) (Free tier available)
2. Create a new instance
3. Copy the connection URL
4. Update `DATABASE_URL` in `.env`

### Step 1.5: Setup Redis

#### Option A: Local Redis

```bash
# Install Redis
# Ubuntu/Debian:
sudo apt-get install redis-server

# macOS:
brew install redis

# Start Redis
sudo service redis-server start  # Linux
brew services start redis  # macOS
```

#### Option B: Cloud Redis (Easier!)

1. Go to [Upstash](https://upstash.com/) (Free tier available)
2. Create a Redis database
3. Copy host, port, and password
4. Update Redis settings in `.env`

### Step 1.6: Run Database Migrations

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### Step 1.7: Start Backend Services

```bash
# Terminal 1 - API Server
npm run start:api

# Terminal 2 - Bot Worker (monitors and executes rebalances)
npm run start:bot

# Terminal 3 - Indexer (listens to blockchain events)
npm run start:indexer
```

Backend will be available at: **http://localhost:3000**
API Docs (Swagger): **http://localhost:3000/api**

---

## Part 2: Frontend Setup

### Step 2.1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2.2: Configure Environment

Your frontend already has a `.env` file. Verify it has:

```bash
# Check your .env file
cat .env
```

It should contain:

```bash
# Privy App ID (for wallet authentication)
VITE_PRIVY_APP_ID=your-privy-app-id-here

# Backend API
VITE_BACKEND_URL=http://localhost:3000

# Contract Addresses (Monad Testnet)
VITE_MONAD_DELEGATION_MANAGER=0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3
VITE_MONAD_STRATEGY_REGISTRY=0xD2D554C6CCC071c84696a37Fb97A377E7426bA7A
```

**Get Privy App ID:**
1. Go to [https://dashboard.privy.io](https://dashboard.privy.io)
2. Create a free account
3. Create a new app
4. Copy the App ID
5. Update `VITE_PRIVY_APP_ID` in `.env`

### Step 2.3: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## Part 3: Contract Deployment (Optional - Already Done!)

Your contracts are already deployed to Monad Testnet! But if you need to redeploy:

### Step 3.1: Configure Contract Environment

```bash
cd contract
# .env already exists, verify it has your private key
```

### Step 3.2: Deploy to Monad Testnet

```bash
export PRIVATE_KEY=0xYOUR_PRIVATE_KEY
export CHAIN_NAME=monad
export PYTH_CONTRACT=0x2880aB155794e7179c9eE2e38200202908C17B43
export UNISWAP_V2_ROUTER=0xfb8e1c3b833f9e67a71c859a132cf783b645e436
export UNISWAP_V2_FACTORY=0x733e88f248b742db6c14c0b1713af5ad7fdd59d0

forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz \
  --broadcast \
  --legacy
```

---

## 🧪 Testing Your Setup

### Test 1: Backend Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T..."
}
```

### Test 2: Frontend Access

Open browser: **http://localhost:5173**

You should see the DeleGator.AI landing page with:
- AI chat interface
- Visual strategy builder (drag-and-drop canvas)
- MetaMask connection button

### Test 3: Create a Strategy

1. Connect your MetaMask wallet
2. Switch to Monad Testnet:
   - Network Name: Monad Testnet
   - RPC URL: https://testnet-rpc.monad.xyz
   - Chain ID: 10143
   - Currency Symbol: MON
3. Use the AI chat: "Create a rebalancing strategy with 70% ETH and 30% USDC"
4. Or use the visual builder to drag blocks

---

## 🎯 Simplified Setup (Frontend Only)

If you just want to demo the frontend without running backend:

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Update .env to use deployed backend (if available)
VITE_BACKEND_URL=https://your-deployed-backend.com

# 3. Start frontend
npm run dev
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (Port 5173)                               │
│  • AI Chat & Strategy Builder                       │
│  • MetaMask Integration                             │
│  • Visual Canvas                                    │
└────────────┬────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────┐
│  BACKEND (Port 3000)                                │
│  ├─ API Server: REST + WebSocket                    │
│  ├─ Bot Worker: Monitors & Executes                 │
│  └─ Indexer: Blockchain Events                      │
└────────────┬────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────┐
│  INFRASTRUCTURE                                     │
│  ├─ PostgreSQL: Strategy & user data                │
│  └─ Redis: Queues & pub/sub                         │
└────────────┬────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────┐
│  SMART CONTRACTS (Monad Testnet)                    │
│  ├─ DelegationManager: 0xdb9B...7dB3                │
│  ├─ StrategyRegistry: 0xD2D5...bA7A                 │
│  ├─ RebalanceExecutor: 0x4986...D50D                │
│  ├─ PythOracle: 0xD705...7285                       │
│  └─ UniswapHelper: 0x485...5C2D                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 Important Keys & Secrets

### What You Need:

1. **Privy App ID** (Frontend authentication)
   - Get from: https://dashboard.privy.io
   - Free tier available
   - Used for: MetaMask wallet connection

2. **Bot Private Key** (Backend automation)
   - Create a new wallet for testing
   - Fund it with Monad testnet tokens
   - Get testnet tokens from: Monad Discord faucet
   - Used for: Executing rebalances on behalf of users

3. **OpenAI API Key** (Optional - AI features)
   - Get from: https://platform.openai.com/api-keys
   - Used for: Natural language strategy generation
   - Can skip if just testing without AI chat

4. **JWT Secret** (Backend security)
   - Generate a random string (32+ characters)
   - Used for: Securing API authentication
   - Example: `openssl rand -hex 32`

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot connect to database"

**Solution:**
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start it if not running
sudo service postgresql start

# Test connection
psql -U postgres -c "SELECT version();"
```

### Issue 2: "Redis connection failed"

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Start it if not running
sudo service redis-server start
```

### Issue 3: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "Prisma Client not generated"

**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Issue 5: Frontend can't connect to backend

**Solution:**
- Check backend is running: `curl http://localhost:3000/health`
- Check CORS settings in `backend/.env`:
  ```bash
  CORS_ORIGIN=http://localhost:5173,http://localhost:3000
  ```

### Issue 6: MetaMask transactions failing

**Solution:**
- Ensure you're on Monad Testnet (Chain ID: 10143)
- Get testnet tokens from Monad Discord faucet
- Check contract addresses match in frontend .env

---

## 🎉 Success Checklist

- [ ] Backend API running on port 3000
- [ ] Backend bot worker monitoring strategies
- [ ] Backend indexer listening to events
- [ ] Frontend running on port 5173
- [ ] Can connect MetaMask wallet
- [ ] Can create a strategy using AI chat
- [ ] Can create a strategy using visual builder
- [ ] Can see strategy on dashboard

---

## 📚 Additional Resources

### Documentation
- **Backend Docs**: `backend/README.md`
- **Frontend Docs**: `frontend/README.md`
- **Contract Docs**: `contract/README.md`
- **API Docs**: http://localhost:3000/api (when running)

### Contract Explorers
- **Monad Testnet**: https://testnet.monadexplorer.com
- **View deployed contracts**: Use addresses from `contract/deployments-monad.json`

### Community & Support
- **MetaMask Delegation Toolkit**: https://docs.metamask.io/delegation-toolkit
- **Monad Testnet**: https://docs.monad.xyz
- **Privy Docs**: https://docs.privy.io

---

## 🏆 Hackathon Highlights

This project showcases:

1. **🤖 AI Agent Integration**
   - Natural language strategy creation with OpenAI
   - Converts English to executable on-chain logic

2. **🔐 Non-Custodial Delegation**
   - MetaMask Smart Accounts (ERC-7710)
   - Users retain full custody
   - Revocable permissions

3. **⚡ Real-Time Automation**
   - Envio-powered indexing
   - Automatic rebalancing
   - Event-driven architecture

4. **🎨 Beautiful UI**
   - Drag-and-drop visual builder
   - Real-time preview
   - Modern design with shadcn/ui

5. **🌐 Multi-Chain Ready**
   - Deployed on Monad Testnet
   - Supports Base Sepolia
   - Extensible architecture

---

## 💡 Next Steps

1. **Get testnet tokens**
   - Join Monad Discord
   - Request testnet MON tokens
   - Fund your wallet

2. **Create your first strategy**
   - Use AI: "Rebalance to 60% ETH, 40% USDC if drift > 5%"
   - Or use visual builder

3. **Enable delegation**
   - Authorize the bot to execute
   - Set permissions and limits
   - Monitor in real-time

4. **Watch it work!**
   - Bot monitors your portfolio
   - Executes rebalances automatically
   - View activity in dashboard

---

## 🤝 Contributing

This is a hackathon project built for innovation and learning!

**Built with:** NestJS, React, Viem, Foundry, MetaMask Delegation Toolkit, OpenAI

**"DeleGator.AI — The AI that acts, but never takes custody."** 🧠

---

Good luck with your hackathon! 🚀

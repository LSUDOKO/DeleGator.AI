#!/bin/bash

# DeleGator.AI - Quick Setup Script
# This script automates the basic setup process

set -e  # Exit on error

echo "🤖 DeleGator.AI - Quick Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_status "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_status "npm installed: $NPM_VERSION"
else
    print_error "npm not found. Please install npm"
    exit 1
fi

# Check Forge (optional)
if command -v forge &> /dev/null; then
    FORGE_VERSION=$(forge --version | head -n1)
    print_status "Forge installed: $FORGE_VERSION"
else
    print_warning "Forge not found (only needed for contract development)"
fi

echo ""
echo "================================"
echo "Setup Options:"
echo "1. Full Stack (Backend + Frontend)"
echo "2. Frontend Only"
echo "3. Backend Only"
echo "================================"
read -p "Choose setup option (1-3): " SETUP_OPTION

case $SETUP_OPTION in
    1)
        echo "Setting up Full Stack..."
        SETUP_BACKEND=true
        SETUP_FRONTEND=true
        ;;
    2)
        echo "Setting up Frontend Only..."
        SETUP_BACKEND=false
        SETUP_FRONTEND=true
        ;;
    3)
        echo "Setting up Backend Only..."
        SETUP_BACKEND=true
        SETUP_FRONTEND=false
        ;;
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""

# Setup Backend
if [ "$SETUP_BACKEND" = true ]; then
    echo "================================"
    echo "📦 Setting up Backend..."
    echo "================================"
    
    cd backend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        echo "Installing backend dependencies (this may take a few minutes)..."
        npm install
        print_status "Backend dependencies installed"
    else
        print_status "Backend dependencies already installed"
    fi
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating backend .env file..."
        cp .env.example .env
        print_status "Backend .env created from .env.example"
        print_warning "IMPORTANT: You need to configure backend/.env with your settings!"
        print_warning "  - DATABASE_URL (PostgreSQL connection)"
        print_warning "  - REDIS_HOST and REDIS_PORT"
        print_warning "  - BOT_PRIVATE_KEY (for automated execution)"
        print_warning "  - OPENAI_API_KEY (optional, for AI features)"
    else
        print_status "Backend .env already exists"
    fi
    
    # Check if database is accessible
    echo ""
    read -p "Do you have PostgreSQL and Redis running? (y/n): " DB_READY
    
    if [ "$DB_READY" = "y" ] || [ "$DB_READY" = "Y" ]; then
        echo "Generating Prisma client..."
        npm run prisma:generate
        print_status "Prisma client generated"
        
        echo ""
        read -p "Run database migrations now? (y/n): " RUN_MIGRATIONS
        if [ "$RUN_MIGRATIONS" = "y" ] || [ "$RUN_MIGRATIONS" = "Y" ]; then
            npm run prisma:migrate
            print_status "Database migrations completed"
        fi
    else
        print_warning "Skipping database setup. See SETUP_GUIDE.md for database installation instructions."
    fi
    
    cd ..
    echo ""
fi

# Setup Frontend
if [ "$SETUP_FRONTEND" = true ]; then
    echo "================================"
    echo "🎨 Setting up Frontend..."
    echo "================================"
    
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies (this may take a few minutes)..."
        npm install
        print_status "Frontend dependencies installed"
    else
        print_status "Frontend dependencies already installed"
    fi
    
    # Check .env
    if [ ! -f ".env" ]; then
        echo "Creating frontend .env file..."
        cp .env.example .env
        print_status "Frontend .env created from .env.example"
        print_warning "IMPORTANT: You need to configure frontend/.env with:"
        print_warning "  - VITE_PRIVY_APP_ID (get from https://dashboard.privy.io)"
    else
        print_status "Frontend .env already exists"
    fi
    
    cd ..
    echo ""
fi

# Final instructions
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next Steps:"
echo ""

if [ "$SETUP_BACKEND" = true ]; then
    echo "📦 Backend:"
    echo "  1. Configure backend/.env (see SETUP_GUIDE.md for details)"
    echo "  2. Ensure PostgreSQL and Redis are running"
    echo "  3. Start backend services:"
    echo "     Terminal 1: cd backend && npm run start:api"
    echo "     Terminal 2: cd backend && npm run start:bot"
    echo "     Terminal 3: cd backend && npm run start:indexer"
    echo ""
fi

if [ "$SETUP_FRONTEND" = true ]; then
    echo "🎨 Frontend:"
    echo "  1. Get Privy App ID from https://dashboard.privy.io"
    echo "  2. Update VITE_PRIVY_APP_ID in frontend/.env"
    echo "  3. Start frontend:"
    echo "     cd frontend && npm run dev"
    echo ""
fi

echo "📚 Documentation:"
echo "  - Full setup guide: SETUP_GUIDE.md"
echo "  - Backend docs: backend/README.md"
echo "  - Frontend docs: frontend/README.md"
echo "  - Contract docs: contract/README.md"
echo ""
echo "🚀 Happy Hacking!"
echo ""

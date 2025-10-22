#!/bin/bash

# Quick start script for Envio HyperIndex

set -e

echo "🚀 DeleGator.AI - Starting Envio HyperIndex"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "ENVIO_INTEGRATION.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check prerequisites
echo "Checking prerequisites..."

# Check Envio CLI
if ! command -v envio &> /dev/null; then
    echo "❌ Envio CLI not found"
    echo "Install: npm install -g @envio-dev/cli"
    exit 1
fi
echo "✅ Envio CLI found"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found (needed for Envio database)"
fi

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend API is running"
else
    echo "⚠️  Backend API not running on port 3000"
    echo "   Start it with: cd backend && npm run start:api"
fi

echo ""
echo "==========================================="
echo ""

# Navigate to Envio directory
cd backend/apps/indexer/envio

# Check if setup has been run
if [ ! -f ".env" ]; then
    echo "📝 First time setup..."
    echo ""
    
    # Copy ABIs
    if [ ! -d "abis" ]; then
        echo "Copying contract ABIs..."
        ./copy-abis.sh
    fi
    
    # Run setup
    ./setup.sh
    
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/apps/indexer/envio/.env"
    echo "   and backend/.env to configure WEBHOOK_SECRET"
    echo ""
    read -p "Press Enter when ready to continue..."
fi

# Check if ABIs exist
if [ ! -d "abis" ] || [ -z "$(ls -A abis 2>/dev/null)" ]; then
    echo "Copying contract ABIs..."
    ./copy-abis.sh
fi

# Check if database exists
if command -v psql &> /dev/null; then
    if psql -lqt | cut -d \| -f 1 | grep -qw envio_indexer; then
        echo "✅ Envio database exists"
    else
        echo "Creating Envio database..."
        createdb envio_indexer || echo "⚠️  Failed to create database"
    fi
fi

echo ""
echo "==========================================="
echo "🔍 Starting Envio HyperIndex..."
echo "==========================================="
echo ""
echo "GraphQL API will be at: http://localhost:8080/v1/graphql"
echo "Webhook endpoint: http://localhost:3000/indexer/webhook"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start Envio
npm run dev

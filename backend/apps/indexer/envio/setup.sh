#!/bin/bash

# DeleGator.AI Envio Setup Script

set -e

echo "🔍 DeleGator.AI Envio HyperIndex Setup"
echo "======================================"
echo ""

# Check if Envio CLI is installed
if ! command -v envio &> /dev/null; then
    echo "❌ Envio CLI not found"
    echo "Installing Envio CLI..."
    npm install -g envio
    echo "✅ Envio CLI installed"
else
    echo "✅ Envio CLI found: $(envio --version)"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env created"
    echo "⚠️  Please edit .env and configure:"
    echo "   - BACKEND_WEBHOOK_URL"
    echo "   - WEBHOOK_SECRET"
    echo "   - ENVIO_POSTGRES_URL"
else
    echo "✅ .env file exists"
fi

# Check PostgreSQL
echo ""
echo "Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL found"
    
    # Try to create database
    echo "Creating Envio database..."
    createdb envio_indexer 2>/dev/null && echo "✅ Database 'envio_indexer' created" || echo "ℹ️  Database 'envio_indexer' may already exist"
else
    echo "⚠️  PostgreSQL not found - you'll need it for Envio"
    echo "   Install: https://www.postgresql.org/download/"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Generate code
echo ""
echo "Generating Envio code..."
envio codegen || echo "⚠️  Codegen failed - make sure ABIs exist in ../abis/"

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Ensure backend API is running (port 3000)"
echo "3. Run: npm run dev"
echo ""
echo "GraphQL API will be at: http://localhost:8080/v1/graphql"
echo "======================================"

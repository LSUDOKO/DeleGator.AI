#!/bin/bash

echo "🚀 Starting DeleGator.AI Backend Services"
echo "=========================================="
echo ""

# Check if PostgreSQL is running
if ! sudo systemctl is-active --quiet postgresql; then
    echo "📊 Starting PostgreSQL..."
    sudo systemctl start postgresql
    sleep 2
fi

echo "✅ PostgreSQL is running"
echo ""

# Check if databases exist
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw delegator_ai; then
    echo "⚠️  Database 'delegator_ai' not found. Creating..."
    sudo -u postgres createdb delegator_ai
    cd backend && npx prisma migrate dev --schema=libs/database/src/schema.prisma --name init
    cd ..
fi

echo "✅ Database 'delegator_ai' exists"
echo ""

# Function to start a service in a new terminal
start_service() {
    local name=$1
    local command=$2
    local dir=$3
    
    echo "🔄 Starting $name..."
    
    # Try different terminal emulators
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$name" -- bash -c "cd $dir && $command; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e bash -c "cd $dir && $command; exec bash" &
    elif command -v xterm &> /dev/null; then
        xterm -title "$name" -e "cd $dir && $command; exec bash" &
    else
        echo "⚠️  No terminal emulator found. Please run manually:"
        echo "   cd $dir && $command"
        return 1
    fi
    
    sleep 1
    echo "✅ $name started in new terminal"
}

# Get the current directory
CURRENT_DIR=$(pwd)

echo "Starting services in separate terminals..."
echo ""

# Start Backend API
start_service "Backend API" "npm run start:api" "$CURRENT_DIR/backend"

# Wait a bit for API to start
sleep 3

# Start Bot Worker
start_service "Bot Worker" "npm run start:bot" "$CURRENT_DIR/backend"

echo ""
echo "=========================================="
echo "✅ All services started!"
echo "=========================================="
echo ""
echo "Services running:"
echo "  • Backend API: http://localhost:3000"
echo "  • Bot Worker: Processing in background"
echo ""
echo "Optional: Start Envio Indexer"
echo "  cd backend/apps/indexer/envio"
echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
echo "  npm run dev"
echo ""
echo "Check logs in the opened terminal windows."
echo ""
echo "To stop all services:"
echo "  pkill -f 'nest start'"
echo ""

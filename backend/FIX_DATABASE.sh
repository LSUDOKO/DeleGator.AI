#!/bin/bash

echo "🔧 Fixing Database Connection Issues..."

# Option 1: Use local PostgreSQL instead of Neon
echo ""
echo "Option 1: Switch to Local PostgreSQL"
echo "======================================="
echo "Your local PostgreSQL is already running!"
echo ""
echo "To use local database, update backend/.env:"
echo 'DATABASE_URL="postgresql://postgres@localhost:5432/delegator_ai"'
echo ""
echo "Then create the database:"
echo "sudo -u postgres createdb delegator_ai"
echo ""
echo "And run migrations:"
echo "cd backend && npx prisma migrate dev"
echo ""

# Option 2: Wake up Neon database
echo "Option 2: Wake Up Neon Database"
echo "================================"
echo "Neon databases auto-pause after inactivity."
echo "To wake it up, visit: https://console.neon.tech"
echo "Or run a simple query to wake it:"
echo ""

# Try to wake up Neon
echo "Attempting to wake up Neon database..."
psql "postgresql://neondb_owner:npg_wP5yjp4QGvNk@ep-wispy-moon-a43htg9v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT 1;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Neon database is now awake!"
else
    echo "❌ Could not reach Neon database. Using local PostgreSQL is recommended."
    echo ""
    echo "Quick Setup for Local Database:"
    echo "================================"
    echo "1. Create database:"
    echo "   sudo -u postgres createdb delegator_ai"
    echo ""
    echo "2. Update backend/.env:"
    echo "   DATABASE_URL=\"postgresql://postgres@localhost:5432/delegator_ai\""
    echo ""
    echo "3. Run migrations:"
    echo "   cd backend && npx prisma migrate dev"
    echo ""
    echo "4. Restart your app:"
    echo "   npm run start:api"
    echo "   npm run start:bot"
fi

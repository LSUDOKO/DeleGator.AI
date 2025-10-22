#!/bin/bash

echo "🔄 Switching to Local PostgreSQL Database..."
echo ""

# Backup current .env
cp .env .env.backup.$(date +%s)
echo "✅ Backed up current .env"

# Update DATABASE_URL to use local PostgreSQL
sed -i 's|DATABASE_URL=.*|DATABASE_URL="postgresql://postgres@localhost:5432/delegator_ai"|' .env
echo "✅ Updated DATABASE_URL in .env"

# Show the change
echo ""
echo "New DATABASE_URL:"
grep DATABASE_URL .env
echo ""

# Add WEBHOOK_SECRET if not exists
if ! grep -q "WEBHOOK_SECRET" .env; then
    echo 'WEBHOOK_SECRET=delegator-ai-secret-change-in-production' >> .env
    echo "✅ Added WEBHOOK_SECRET to .env"
fi

echo ""
echo "📊 Running Prisma migrations..."
npx prisma migrate dev --name init

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Now you can run:"
echo "  npm run start:api"
echo "  npm run start:bot"

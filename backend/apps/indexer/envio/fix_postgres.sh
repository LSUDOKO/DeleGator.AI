#!/bin/bash

echo "🔧 Fixing PostgreSQL for Envio..."
echo ""

# Backup pg_hba.conf
sudo cp /var/lib/postgres/data/pg_hba.conf /var/lib/postgres/data/pg_hba.conf.backup

# Add trust authentication for local connections
echo "Adding trust authentication..."
sudo bash -c 'cat > /var/lib/postgres/data/pg_hba.conf << EOF
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                trust
host    all             postgres        127.0.0.1/32            trust
host    all             postgres        ::1/128                 trust
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
EOF'

echo "✅ Updated pg_hba.conf"
echo ""

# Restart PostgreSQL
echo "Restarting PostgreSQL..."
sudo systemctl restart postgresql
sleep 2

if sudo systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL restarted successfully"
else
    echo "❌ PostgreSQL failed to restart"
    echo "Restoring backup..."
    sudo cp /var/lib/postgres/data/pg_hba.conf.backup /var/lib/postgres/data/pg_hba.conf
    sudo systemctl restart postgresql
    exit 1
fi

echo ""
echo "Recreating envio_indexer database..."
sudo -u postgres dropdb --if-exists envio_indexer
sudo -u postgres createdb envio_indexer

echo "✅ Database recreated"
echo ""

# Test connection
echo "Testing connection..."
if psql -U postgres -d envio_indexer -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Connection test successful!"
    echo ""
    echo "Now try running Envio:"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo "  npm run dev"
else
    echo "❌ Connection test failed"
    exit 1
fi

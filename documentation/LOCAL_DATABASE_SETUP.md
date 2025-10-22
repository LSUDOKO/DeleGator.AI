# 🖥️ Local Database Setup (15-30 minutes)

**For:** Users who want to install PostgreSQL and Redis locally on Linux

---

## PostgreSQL Installation

### Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check if running
sudo systemctl status postgresql
```

### Arch Linux

```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Initialize database
sudo -u postgres initdb -D /var/lib/postgres/data

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Setup Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE rebased;
CREATE USER rebased WITH PASSWORD 'rebased123';
GRANT ALL PRIVILEGES ON DATABASE rebased TO rebased;
\q

# Test connection
psql -U rebased -d rebased -h localhost
# Password: rebased123
```

### Update backend/.env

```bash
DATABASE_URL="postgresql://rebased:rebased123@localhost:5432/rebased?schema=public"
```

---

## Redis Installation

### Ubuntu/Debian

```bash
# Install Redis
sudo apt install redis-server -y

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

### Arch Linux

```bash
# Install Redis
sudo pacman -S redis

# Start service
sudo systemctl start redis
sudo systemctl enable redis

# Test
redis-cli ping
```

### Update backend/.env

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## Verification

### Check PostgreSQL

```bash
# Check if running
pg_isready -h localhost -p 5432

# Check version
psql --version

# Connect to database
psql -U rebased -d rebased -h localhost
```

### Check Redis

```bash
# Check if running
redis-cli ping

# Check info
redis-cli info server

# Test set/get
redis-cli SET test "hello"
redis-cli GET test
```

---

## Troubleshooting

### PostgreSQL Not Starting

```bash
# Check logs
sudo journalctl -u postgresql -n 50

# Check if port is in use
sudo lsof -i :5432

# Restart service
sudo systemctl restart postgresql
```

### Redis Not Starting

```bash
# Check logs
sudo journalctl -u redis -n 50

# Check if port is in use
sudo lsof -i :6379

# Restart service
sudo systemctl restart redis
```

### Connection Refused

```bash
# PostgreSQL: Edit pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add line:
# host    all             all             127.0.0.1/32            md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## After Installation

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start API
npm run start:api
```

---

## Using Docker Compose (If Docker Available)

If you later install Docker, you can use the provided docker-compose:

```bash
cd backend

# Start services
docker-compose up -d postgres redis

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Quick Commands Reference

```bash
# PostgreSQL
sudo systemctl start postgresql
sudo systemctl stop postgresql
sudo systemctl restart postgresql
sudo systemctl status postgresql

# Redis
sudo systemctl start redis-server
sudo systemctl stop redis-server
sudo systemctl restart redis-server
sudo systemctl status redis-server

# Test connections
pg_isready
redis-cli ping
```

---

## Recommended: Cloud Services

For faster setup without local installation, see: `CLOUD_DATABASE_SETUP.md`

**Cloud advantages:**
- ✅ No installation needed
- ✅ Works immediately
- ✅ Free tier available
- ✅ Managed backups
- ✅ Better for hackathons/demos

# Database Migration Guide: Changing Database Name

**Date**: 2025-01-27  
**Change**: Database name from `healthy` to `health_management`

## Overview

This guide walks you through migrating from the `healthy` database to `health_management` database. This is useful if you've already created the database with the old name and want to switch to the new name.

## Option 1: Rename Existing Database (Recommended if data exists)

If you already have data in the `healthy` database and want to keep it:

### Step 1: Connect to PostgreSQL

```bash
psql -U postgres
```

### Step 2: Rename the Database

```sql
-- Disconnect all active connections first
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'healthy'
  AND pid <> pg_backend_pid();

-- Rename the database
ALTER DATABASE healthy RENAME TO health_management;
```

### Step 3: Exit psql

```sql
\q
```

### Step 4: Update Environment Variables

Update your `backend/.env` file:

```env
DATABASE_URL=postgresql+psycopg://postgres:William1!@localhost:5432/health_management
```

### Step 5: Verify Connection

```bash
cd backend
python -c "from app.config import settings; print(settings.database_url)"
```

## Option 2: Create New Database (Fresh Start)

If you don't have important data or want a fresh start:

### Step 1: Connect to PostgreSQL

```bash
psql -U postgres
```

### Step 2: Create New Database

```sql
CREATE DATABASE health_management;
```

### Step 3: (Optional) Drop Old Database

```sql
-- Only if you want to remove the old database
DROP DATABASE IF EXISTS healthy;
```

### Step 4: Exit psql

```sql
\q
```

### Step 5: Update Environment Variables

Update your `backend/.env` file:

```env
DATABASE_URL=postgresql+psycopg://postgres:William1!@localhost:5432/health_management
```

### Step 6: Run Migrations

```bash
cd backend
alembic upgrade head
```

### Step 7: Migrate Data (if needed)

If you had data in the old database and want to keep it:

```bash
# Option A: Export from old database and import to new
pg_dump -U postgres healthy > healthy_backup.sql
psql -U postgres health_management < healthy_backup.sql

# Option B: Use the migration script from db.json
python scripts/migrate_db_json.py
```

## Option 3: Update Connection String Only (If database already renamed)

If you've already renamed the database or created `health_management`:

### Step 1: Update `.env` file

```bash
cd backend
# Edit .env file
DATABASE_URL=postgresql+psycopg://postgres:William1!@localhost:5432/health_management
```

### Step 2: Test Connection

```bash
# Test database connection
python -c "
from app.database import engine
import asyncio
async def test():
    async with engine.begin() as conn:
        print('✓ Database connection successful!')
asyncio.run(test())
"
```

## Verification Steps

After migration, verify everything works:

### 1. Check Database Exists

```bash
psql -U postgres -l | grep health_management
```

### 2. Verify Tables Exist

```bash
psql -U postgres -d health_management -c "\dt"
```

You should see the `patients` table.

### 3. Test API Connection

```bash
cd backend
uvicorn app.main:app --reload
```

Then visit:
- http://localhost:8000/health
- http://localhost:8000/docs

### 4. Run Tests

```bash
cd backend
pytest tests/ -v
```

## Troubleshooting

### Error: "database does not exist"

**Solution**: Make sure you created the database:
```sql
CREATE DATABASE health_management;
```

### Error: "connection refused"

**Solution**: Check PostgreSQL is running:
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

### Error: "authentication failed"

**Solution**: Check your password in `.env` matches your PostgreSQL user password.

### Error: "relation does not exist"

**Solution**: Run migrations:
```bash
cd backend
alembic upgrade head
```

## Quick Reference

**Old Database Name**: `healthy`  
**New Database Name**: `health_management`

**Connection String Format**:
```
postgresql+psycopg://postgres:PASSWORD@localhost:5432/health_management
```

**Key Files to Update**:
- `backend/.env` (your local environment)
- `backend/.env.example` (template - already updated)
- Any deployment environment variables (Render, etc.)

## Next Steps

After migration:
1. ✅ Verify database connection works
2. ✅ Run migrations: `alembic upgrade head`
3. ✅ Test API endpoints
4. ✅ Update production environment variables if deployed
5. ✅ Run full test suite: `pytest`

## Production Deployment

If you're deploying to Render or another service:

1. **Update Render Environment Variables**:
   - Go to your Render dashboard
   - Find your PostgreSQL database service
   - Update the database name in connection string
   - Or create a new database with `health_management` name

2. **Update Backend Service Environment Variables**:
   - Update `DATABASE_URL` to point to `health_management`
   - Redeploy the service

3. **Verify Production**:
   - Check health endpoint: `https://your-backend.onrender.com/health`
   - Test API endpoints

---

**Need Help?** Check the main documentation:
- Quickstart: `specs/003-fastapi-postgresql/quickstart.md`
- Migration Summary: `docs/003-fastapi-postgresql-migration.md`


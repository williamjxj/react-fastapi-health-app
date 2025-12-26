# Supabase Connection Setup - Quick Reference

## Your Supabase Project

- **Project Reference**: `drzmgazvrdoytoemjorj`
- **Project URL**: https://drzmgazvrdoytoemjorj.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj

## Quick Start

### 1. Get Connection Strings

Go to: https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj/settings/database

**For Application (Connection Pooler - Port 6543):**
- Click "Connection pooling" tab
- Select "Session" mode
- Copy the connection string
- Format: `postgresql://postgres.drzmgazvrdoytoemjorj:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`

**For Migrations (Direct Connection - Port 5432):**
- Click "Connection string" tab
- Select "URI" format
- Copy the connection string
- Format: `postgresql://postgres.drzmgazvrdoytoemjorj:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres`

### 2. Configure Environment

```bash
cd backend
cp .env.supabase .env
# Edit .env and replace [PASSWORD] and [region] with actual values
```

### 3. Test Connection

```bash
# Install dependencies first (if not already installed)
poetry install
# or
pip install -r requirements.txt

# Test connection
python scripts/test_supabase_connection.py
```

### 4. Run Schema Migration

```bash
alembic upgrade head
```

### 5. Migrate Data (if needed)

```bash
python scripts/migrate_to_supabase.py
```

## Connection String Format

The connection strings in `.env.supabase` are pre-configured with your project reference. You just need to:

1. Replace `[PASSWORD]` with your database password
2. Replace `[region]` with your Supabase region (e.g., `us-east-1`)

**Important**: Both connection strings must include `?sslmode=require` (already included in template).

## Files Created/Updated

- ✅ `.env.supabase` - Template with your project reference
- ✅ `scripts/test_supabase_connection.py` - Connection test script
- ✅ `scripts/get_supabase_connection.py` - Helper script with instructions
- ✅ `app/config.py` - Updated to support `DATABASE_URL_MIGRATION`
- ✅ `docs/supabase-connection-setup.md` - Detailed setup guide

## Next Steps

1. Get connection strings from Supabase dashboard
2. Update `.env` file with actual credentials
3. Test connection: `python scripts/test_supabase_connection.py`
4. Run migrations: `alembic upgrade head`
5. Start application: `uvicorn app.main:app --reload`

## Troubleshooting

See `docs/supabase-connection-setup.md` for detailed troubleshooting guide.

## References

- [Supabase Python Docs](https://supabase.com/docs/reference/python/introduction)
- [Supabase Dashboard](https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj)


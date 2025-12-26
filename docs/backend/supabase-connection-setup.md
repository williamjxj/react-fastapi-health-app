# Supabase Connection Setup Guide

**Project**: drzmgazvrdoytoemjorj  
**Dashboard**: https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj

## Quick Setup Steps

### Step 1: Get Connection Strings from Supabase Dashboard

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj/settings/database

2. **Get Connection Pooler String** (for application):
   - Click on "Connection pooling" tab
   - Select "Session" mode
   - Copy the connection string
   - It should look like:
     ```
     postgresql://postgres.drzmgazvrdoytoemjorj:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```

3. **Get Direct Connection String** (for migrations):
   - Click on "Connection string" tab
   - Select "URI" format
   - Copy the connection string
   - It should look like:
     ```
     postgresql://postgres.drzmgazvrdoytoemjorj:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
     ```

### Step 2: Update Environment File

1. **Copy template to .env**:
   ```bash
   cd backend
   cp .env.supabase .env
   ```

2. **Edit .env file** and replace:
   - `[PASSWORD]` → Your actual database password (from Supabase dashboard)
   - `[region]` → Your Supabase region (e.g., `us-east-1`, `eu-west-1`, `ap-southeast-1`)
   - The region is in the hostname: `aws-0-[region].pooler.supabase.com`

3. **Ensure SSL is included**:
   - Both connection strings must end with `?sslmode=require`
   - The template already includes this

### Step 3: Test Connection

```bash
cd backend
python scripts/test_supabase_connection.py
```

This will:
- Verify connection string format
- Test database connectivity
- Show database information
- List existing tables

### Step 4: Run Schema Migration

```bash
cd backend
alembic upgrade head
```

This creates all tables including `migration_checkpoints`.

## Connection String Format

### For Application (Connection Pooler - Port 6543)

```
postgresql+psycopg://postgres.drzmgazvrdoytoemjorj:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

**Why port 6543?**
- Connection pooler handles connection management
- Better for application workloads
- Recommended by Supabase for production

### For Migrations (Direct Connection - Port 5432)

```
postgresql+psycopg://postgres.drzmgazvrdoytoemjorj:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require
```

**Why port 5432?**
- Direct connection to PostgreSQL
- No connection limits for bulk operations
- Better for migration scripts

### For Alembic (Sync Operations)

Alembic uses synchronous connections, so the connection string needs `psycopg2` instead of `psycopg`:

```
postgresql+psycopg2://postgres.drzmgazvrdoytoemjorj:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require
```

**Note**: The `alembic/env.py` automatically converts this for you.

## Finding Your Region

The region is part of the hostname in your connection string. Common regions:
- `us-east-1` - US East (N. Virginia)
- `us-west-1` - US West (N. California)
- `eu-west-1` - EU (Ireland)
- `ap-southeast-1` - Asia Pacific (Singapore)

You can find it in the connection string from the Supabase dashboard.

## Security Notes

1. **Never commit .env file**: It's in `.gitignore` for security
2. **SSL is required**: All Supabase connections must use `?sslmode=require`
3. **Password security**: Store password securely, consider using password managers
4. **Environment variables**: Use environment variables in production (Render, etc.)

## Troubleshooting

### Connection Fails

1. **Check password**: Verify password is correct (no extra spaces)
2. **Check region**: Ensure region matches your Supabase project
3. **Check SSL**: Must include `?sslmode=require`
4. **Check network**: Verify internet connectivity

### SSL Errors

- Ensure `?sslmode=require` is in connection string
- Check system time/date is correct
- Verify Supabase project is active

### Connection Timeout

- Check firewall settings
- Verify Supabase project status
- Check network connectivity

## Next Steps

After connection is working:

1. Run schema migration: `alembic upgrade head`
2. Test connection: `python scripts/test_supabase_connection.py`
3. Run data migration: `python scripts/migrate_to_supabase.py`
4. Verify migration: `python scripts/verify_migration.py`

## References

- [Supabase Python Documentation](https://supabase.com/docs/reference/python/introduction)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Supabase Dashboard](https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj)


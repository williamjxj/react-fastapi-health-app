# Supabase Rollback Guide

**Date**: 2025-01-27  
**Feature**: Rollback from Supabase to Local PostgreSQL

## Overview

This guide provides procedures for rolling back from Supabase to local PostgreSQL database during the verification period if issues are encountered.

## When to Rollback

Consider rolling back if:
- Critical data integrity issues are discovered
- Performance problems that cannot be resolved quickly
- Connection stability issues
- Application errors that cannot be diagnosed
- Need to revert for testing or validation

## Rollback Procedure

### Step 1: Check Current Configuration

```bash
cd backend
python scripts/rollback_to_local.py --check
```

This shows which database is currently configured.

### Step 2: Update Environment Variables

1. **Update `.env` file**:
   ```bash
   # Revert to local PostgreSQL
   DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/health_management
   
   # Keep Supabase URL for reference (optional)
   # DATABASE_URL_SUPABASE=postgresql+psycopg://...
   ```

2. **Verify local database is running**:
   ```bash
   # Check PostgreSQL is running
   psql -U postgres -c "SELECT 1"
   ```

### Step 3: Restart Application

```bash
# Stop current application (Ctrl+C if running)

# Start application with local database
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Verify Rollback

1. **Check health endpoint**:
   ```bash
   curl http://localhost:8000/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "environment": "development"
   }
   ```

2. **Test API endpoints**:
   ```bash
   curl http://localhost:8000/patients
   curl http://localhost:8000/patients/P001
   ```

3. **Verify data integrity**:
   - Check that all patient records are accessible
   - Verify data matches expected values
   - Test CRUD operations

### Step 5: Monitor Application

- Monitor application logs for errors
- Check database connection stability
- Verify all features work correctly
- Test with actual usage scenarios

## Rollback Script

Use the rollback script for assistance:

```bash
# Show rollback instructions
python scripts/rollback_to_local.py --instructions

# Check current database
python scripts/rollback_to_local.py --check

# Show instructions with local URL
python scripts/rollback_to_local.py \
  --local-url "postgresql+psycopg://postgres:password@localhost:5432/health_management" \
  --instructions
```

## Important Notes

### Data Preservation

- **Supabase data remains unchanged**: Rolling back only changes the connection, not the data
- **Local database must be current**: Ensure local database has the data you need
- **No automatic sync**: Changes made on Supabase are not automatically synced to local

### Re-migration

If you need to re-migrate after rollback:
1. Fix issues that caused rollback
2. Re-run migration script (will resume from checkpoint)
3. Verify migration again
4. Switch back to Supabase when ready

### Verification Period

- Keep local database available during verification period
- Test thoroughly before decommissioning local database
- Maintain backups of both databases during transition

## Safety Checks

Before rolling back, verify:

1. **Local database is accessible**:
   ```bash
   psql -U postgres -d health_management -c "SELECT COUNT(*) FROM patients;"
   ```

2. **Local database has current data**:
   - Check record counts match expectations
   - Verify data is not stale

3. **Application can connect to local**:
   ```bash
   # Test connection
   python -c "from app.config import settings; print(settings.database_url)"
   ```

## Troubleshooting Rollback

### Issue: Application won't start after rollback

**Solution**:
- Verify `.env` file has correct local connection string
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -U postgres -l | grep health_management`

### Issue: Data appears missing or incorrect

**Solution**:
- Verify local database has the expected data
- Check if you're looking at the right database
- Compare record counts between local and Supabase

### Issue: Connection errors

**Solution**:
- Verify connection string format
- Check PostgreSQL is accepting connections
- Verify user permissions

## Reverting to Supabase

To switch back to Supabase after rollback:

1. Update `.env`:
   ```bash
   DATABASE_URL=postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require
   ```

2. Restart application

3. Verify connection

## Best Practices

1. **Test rollback procedure** before production migration
2. **Document any issues** encountered during rollback
3. **Keep both databases** available during verification period
4. **Monitor closely** after rollback to ensure stability
5. **Plan re-migration** if rollback was due to fixable issues


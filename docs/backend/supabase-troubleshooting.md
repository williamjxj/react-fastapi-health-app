# Supabase Troubleshooting Guide

**Date**: 2025-01-27  
**Feature**: Troubleshooting Supabase Migration Issues

## Common Issues and Solutions

### Connection Issues

#### Problem: Cannot connect to Supabase

**Symptoms**:
- Connection timeout errors
- "Connection refused" errors
- SSL/TLS errors

**Solutions**:
1. **Verify connection string format**:
   ```bash
   # Check connection string includes SSL
   echo $DATABASE_URL | grep sslmode=require
   ```

2. **Test connection directly**:
   ```bash
   psql "postgresql://[user]:[password]@[host]:5432/[database]?sslmode=require"
   ```

3. **Check network access**:
   - Verify internet connection
   - Check firewall settings
   - Test Supabase dashboard accessibility

4. **Verify credentials**:
   - Check username and password in Supabase dashboard
   - Ensure password doesn't contain special characters that need URL encoding
   - Verify database name is correct

#### Problem: SSL/TLS errors

**Symptoms**:
- "SSL connection required" errors
- Certificate verification failures

**Solutions**:
1. **Ensure SSL is required**:
   - Connection string must include `?sslmode=require`
   - For Supabase, SSL is mandatory

2. **Check connection string**:
   ```bash
   # Should include sslmode=require
   postgresql+psycopg://...?sslmode=require
   ```

3. **Verify Supabase SSL certificate**:
   - Supabase uses valid SSL certificates
   - If certificate errors occur, check system time/date

### Migration Issues

#### Problem: Migration fails mid-execution

**Symptoms**:
- Migration script stops with error
- Partial data migration
- Checkpoint shows "failed" status

**Solutions**:
1. **Check checkpoint status**:
   ```sql
   SELECT * FROM migration_checkpoints WHERE status = 'failed';
   ```

2. **Review error message**:
   ```sql
   SELECT error_message FROM migration_checkpoints WHERE status = 'failed';
   ```

3. **Resume migration**:
   ```bash
   # Re-run migration script (automatically resumes from checkpoint)
   python scripts/migrate_to_supabase.py
   ```

4. **Common causes**:
   - Network interruption: Resume migration
   - Connection limit: Wait and retry
   - Data validation error: Fix data and resume
   - Supabase service issue: Check Supabase status page

#### Problem: Migration is very slow

**Symptoms**:
- Migration takes longer than expected
- Low throughput

**Solutions**:
1. **Check batch size**:
   - Default is 500 records per batch
   - Can be adjusted in script if needed

2. **Verify connection type**:
   - Use direct connection (port 5432) for migrations
   - Don't use connection pooler for bulk operations

3. **Check network latency**:
   ```bash
   ping [supabase-host]
   ```

4. **Monitor Supabase dashboard**:
   - Check for connection limits
   - Verify tier limits aren't exceeded

#### Problem: Duplicate records

**Symptoms**:
- Verification shows more records in Supabase than local
- Duplicate patient_id errors

**Solutions**:
1. **Migration uses UPSERT**:
   - Script should prevent duplicates
   - Check if migration was run multiple times incorrectly

2. **Verify idempotency**:
   - Re-running migration should not create duplicates
   - Check checkpoint status before re-running

3. **Clean up if needed**:
   ```sql
   -- Find duplicates
   SELECT patient_id, COUNT(*) 
   FROM patients 
   GROUP BY patient_id 
   HAVING COUNT(*) > 1;
   ```

### Data Integrity Issues

#### Problem: Record counts don't match

**Symptoms**:
- Verification shows different counts
- Missing records

**Solutions**:
1. **Run verification script**:
   ```bash
   python scripts/verify_migration.py
   ```

2. **Check for failed batches**:
   - Review migration logs
   - Check checkpoint error messages

3. **Compare sample records**:
   - Verification script compares random samples
   - Review discrepancies in report

4. **Manual verification**:
   ```sql
   -- Compare counts
   SELECT COUNT(*) FROM patients;  -- Run on both databases
   ```

#### Problem: Data values don't match

**Symptoms**:
- Verification shows field mismatches
- Incorrect data in Supabase

**Solutions**:
1. **Review verification report**:
   - Check which fields mismatch
   - Identify patterns

2. **Check data types**:
   - Verify timestamp handling
   - Check date format conversions

3. **Review migration logs**:
   - Look for data conversion errors
   - Check for validation failures

### Schema Issues

#### Problem: Tables missing in Supabase

**Symptoms**:
- Application errors about missing tables
- Schema migration failed

**Solutions**:
1. **Re-run schema migration**:
   ```bash
   alembic upgrade head
   ```

2. **Verify migration status**:
   ```bash
   alembic current
   alembic history
   ```

3. **Check Supabase SQL Editor**:
   ```sql
   \dt  -- List tables
   ```

#### Problem: Indexes or constraints missing

**Symptoms**:
- Performance issues
- Constraint violations

**Solutions**:
1. **Verify schema migration completed**:
   ```bash
   alembic upgrade head
   ```

2. **Check indexes**:
   ```sql
   SELECT indexname FROM pg_indexes WHERE tablename = 'patients';
   ```

3. **Re-run migrations if needed**:
   ```bash
   alembic downgrade -1
   alembic upgrade head
   ```

### Application Issues

#### Problem: Application won't start with Supabase

**Symptoms**:
- Startup errors
- Database connection failures

**Solutions**:
1. **Check connection string**:
   ```bash
   python scripts/switch_database.py --show
   ```

2. **Verify SSL requirement**:
   - Connection string must include `?sslmode=require`
   - Check config.py validation

3. **Test connection**:
   ```bash
   python -c "from app.database import engine; import asyncio; asyncio.run(engine.connect())"
   ```

4. **Check Supabase project status**:
   - Verify project is active
   - Check for service interruptions

#### Problem: Slow API responses after migration

**Symptoms**:
- API response times > 200ms
- Timeout errors

**Solutions**:
1. **Use connection pooler**:
   - Application should use port 6543 (pooler)
   - Not port 5432 (direct)

2. **Check connection pool settings**:
   - Review `database.py` pool configuration
   - Adjust if needed

3. **Monitor Supabase dashboard**:
   - Check connection metrics
   - Verify tier limits

4. **Network latency**:
   - Check geographic location
   - Consider Supabase region selection

#### Problem: Connection pool exhaustion

**Symptoms**:
- "Too many connections" errors
- Connection timeouts

**Solutions**:
1. **Use connection pooler**:
   - Port 6543 handles connection management
   - Reduces connection count

2. **Adjust pool settings**:
   ```python
   # In database.py
   pool_size=5  # Reduce if needed
   max_overflow=10  # Adjust based on usage
   ```

3. **Check connection leaks**:
   - Ensure sessions are properly closed
   - Review application code

### Performance Issues

#### Problem: Migration takes too long

**Solutions**:
1. **Check batch size**:
   - Default: 500 records per batch
   - Can increase for faster migration (if stable)

2. **Verify connection**:
   - Use direct connection (port 5432)
   - Check network speed

3. **Monitor Supabase**:
   - Check for rate limiting
   - Verify tier limits

#### Problem: Verification is slow

**Solutions**:
1. **Reduce sample size**:
   ```bash
   python scripts/verify_migration.py --sample-size 50
   ```

2. **Run verification during off-peak hours**

3. **Use Supabase SQL Editor** for quick checks

### Configuration Issues

#### Problem: Connection string validation fails

**Symptoms**:
- Config validation errors
- SSL requirement errors

**Solutions**:
1. **Check connection string format**:
   - Must include `?sslmode=require`
   - Verify URL encoding of special characters

2. **Test validation**:
   ```python
   from app.config import Settings
   settings = Settings(database_url="your-connection-string")
   ```

3. **Review config.py**:
   - Check validation logic
   - Verify SSL requirement check

## Getting Help

### Logs

Check these log files:
- `migration.log` - Migration script logs
- `verification.log` - Verification script logs
- Application logs - Application runtime logs

### Supabase Resources

- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Status: https://status.supabase.com
- Supabase Documentation: https://supabase.com/docs

### Debug Commands

```bash
# Check current database
python scripts/switch_database.py --check

# Test connection
python -c "from app.database import AsyncSessionLocal; import asyncio; asyncio.run(AsyncSessionLocal().__aenter__())"

# Verify configuration
python -c "from app.config import settings; print(settings.database_url[:50])"
```

## Prevention

To avoid common issues:

1. **Test migration on staging first**
2. **Verify Supabase project is ready**
3. **Check network connectivity**
4. **Review connection string format**
5. **Monitor migration progress**
6. **Run verification after migration**
7. **Keep local database during verification period**


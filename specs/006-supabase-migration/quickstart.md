# Quickstart: PostgreSQL Migration to Supabase

**Date**: 2025-01-27  
**Feature**: PostgreSQL Migration to Supabase Cloud Service

## Prerequisites

- Python 3.12+ installed
- Local PostgreSQL database with existing schema and data
- Supabase account and project created
- Supabase connection credentials (connection string)
- Network access to Supabase (internet connection)

## Step 1: Set Up Supabase Project

1. **Create Supabase Project**:
   - Go to https://supabase.com
   - Create a new project
   - Note the project connection details

2. **Get Connection String**:
   - In Supabase dashboard, go to Settings → Database
   - Copy the connection string (use "Connection pooling" for application, "Direct connection" for migrations)
   - Format: `postgresql://[user]:[password]@[host]:[port]/[database]`

3. **Configure HIPAA Compliance** (if required):
   - Enable SSL/TLS (automatic with Supabase)
   - Configure Row Level Security (RLS) policies
   - Enable audit logging (if available in your plan)
   - Consider Enterprise plan for HIPAA BAA

## Step 2: Configure Environment Variables

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create or update `.env` file**:
   ```bash
   # Local PostgreSQL (for reference, keep during migration)
   DATABASE_URL_LOCAL=postgresql+psycopg://postgres:password@localhost:5432/health_management

   # Supabase connection string
   # For application (connection pooler - port 6543):
   DATABASE_URL=postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require
   
   # For migrations (direct connection - port 5432):
   DATABASE_URL_MIGRATION=postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require

   # Environment
   ENVIRONMENT=development

   # CORS origins
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000

   # Server port
   PORT=8000
   ```

   **Note**: Replace `[user]`, `[password]`, `[host]`, `[port]`, and `[database]` with your Supabase credentials.

3. **Verify connection string format**:
   - Must include `?sslmode=require` for SSL/TLS
   - Use `postgresql+psycopg://` prefix for async operations
   - Use `postgresql+psycopg2://` prefix for sync operations (Alembic)

## Step 3: Migrate Schema to Supabase

1. **Update Alembic configuration** (if needed):
   - Alembic `env.py` already configured to use `settings.database_url`
   - Ensure connection string includes SSL: `?sslmode=require`

2. **Run Alembic migrations on Supabase**:
   ```bash
   cd backend
   
   # Set DATABASE_URL to Supabase connection string for migrations
   export DATABASE_URL="postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require"
   
   # Run migrations
   alembic upgrade head
   ```

3. **Verify schema migration**:
   ```bash
   # Connect to Supabase and verify tables exist
   # Use Supabase SQL editor or psql:
   # psql "postgresql://[user]:[password]@[host]:5432/[database]?sslmode=require"
   # \dt  # List tables
   ```

## Step 4: Create Migration Checkpoint Table

1. **Create checkpoint table in Supabase**:
   ```sql
   CREATE TABLE migration_checkpoints (
       id SERIAL PRIMARY KEY,
       table_name VARCHAR(255) NOT NULL UNIQUE,
       last_record_id INTEGER,
       batch_number INTEGER DEFAULT 0,
       records_migrated INTEGER DEFAULT 0,
       status VARCHAR(50) NOT NULL CHECK (status IN ('in_progress', 'completed', 'failed')),
       error_message TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX idx_migration_checkpoints_status ON migration_checkpoints(status);
   ```

2. **Verify table creation**:
   ```sql
   SELECT * FROM migration_checkpoints;
   ```

## Step 5: Run Data Migration

1. **Create migration script** (if not already created):
   - Script location: `backend/scripts/migrate_to_supabase.py`
   - See implementation plan for script details

2. **Run migration script**:
   ```bash
   cd backend
   
   # Set environment variables
   export DATABASE_URL_LOCAL="postgresql+psycopg://postgres:password@localhost:5432/health_management"
   export DATABASE_URL_SUPABASE="postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require"
   
   # Run migration
   python scripts/migrate_to_supabase.py
   ```

3. **Monitor migration progress**:
   - Script logs progress to console
   - Check checkpoint table for status:
     ```sql
     SELECT * FROM migration_checkpoints;
     ```

4. **Resume if interrupted**:
   - Script automatically resumes from last checkpoint
   - Re-run the same command:
     ```bash
     python scripts/migrate_to_supabase.py
     ```

## Step 6: Verify Data Migration

1. **Run verification script**:
   ```bash
   cd backend
   python scripts/verify_migration.py
   ```

2. **Check verification report**:
   - Report shows record counts comparison
   - Sample record comparison
   - Schema verification
   - Any discrepancies flagged

3. **Manual verification** (optional):
   ```sql
   -- Compare record counts
   -- Local:
   SELECT COUNT(*) FROM patients;
   
   -- Supabase:
   SELECT COUNT(*) FROM patients;
   
   -- Compare sample records
   SELECT * FROM patients ORDER BY id LIMIT 10;
   ```

## Step 7: Update Application Configuration

1. **Update `.env` file**:
   ```bash
   # Switch to Supabase for application
   DATABASE_URL=postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require
   ```

   **Note**: Use connection pooler (port 6543) for application, direct connection (port 5432) for migrations.

2. **Test application connection**:
   ```bash
   cd backend
   
   # Start application
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Verify health check**:
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

4. **Test API endpoints**:
   ```bash
   # List patients
   curl http://localhost:8000/patients
   
   # Get specific patient
   curl http://localhost:8000/patients/P001
   ```

## Step 8: Deploy to Render

1. **Prepare for deployment**:
   - Ensure all migrations are complete
   - Verify data migration is successful
   - Test application locally with Supabase

2. **Configure Render environment variables**:
   - In Render dashboard, set:
     - `DATABASE_URL`: Supabase connection string (pooler: port 6543)
     - `ENVIRONMENT`: `production`
     - `CORS_ORIGINS`: Your frontend domain(s)

3. **Deploy**:
   - Render will automatically build and deploy
   - Monitor deployment logs
   - Verify health check endpoint after deployment

4. **Verify production**:
   ```bash
   curl https://[your-render-url]/health
   curl https://[your-render-url]/patients
   ```

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Supabase
- **Solution**: Verify connection string format, check SSL requirement (`?sslmode=require`), verify network access

**Problem**: SSL/TLS errors
- **Solution**: Ensure connection string includes `?sslmode=require`, verify Supabase SSL certificate

### Migration Issues

**Problem**: Migration fails mid-execution
- **Solution**: Check checkpoint table, fix error, re-run migration script (automatically resumes from checkpoint)

**Problem**: Data mismatch after migration
- **Solution**: Run verification script, check for errors, compare sample records manually

### Performance Issues

**Problem**: Slow API responses after migration
- **Solution**: Check connection pooling configuration, verify Supabase tier limits, check network latency

**Problem**: Connection pool exhaustion
- **Solution**: Adjust pool_size and max_overflow in database.py, use connection pooler (port 6543)

## Next Steps

1. **Monitor application**:
   - Check health endpoint regularly
   - Monitor Supabase dashboard for connection metrics
   - Review application logs

2. **Decommission local database** (after verification period):
   - Ensure all data is migrated and verified
   - Test application thoroughly with Supabase
   - Backup local database before decommissioning
   - Remove local database when confident

3. **Documentation**:
   - Update deployment documentation
   - Document Supabase configuration
   - Update team on new connection details

## Quick Reference

### Connection Strings

**Application (pooler)**:
```
postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require
```

**Migrations (direct)**:
```
postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require
```

**Alembic (sync)**:
```
postgresql+psycopg2://[user]:[password]@[host]:5432/[database]?sslmode=require
```

### Key Commands

```bash
# Run schema migration
alembic upgrade head

# Run data migration
python scripts/migrate_to_supabase.py

# Verify migration
python scripts/verify_migration.py

# Test application
uvicorn app.main:app --reload

# Health check
curl http://localhost:8000/health
```

### Important Files

- `backend/.env` - Environment variables (Supabase connection string)
- `backend/app/config.py` - Configuration management
- `backend/app/database.py` - Database connection
- `backend/alembic/env.py` - Alembic configuration
- `backend/scripts/migrate_to_supabase.py` - Data migration script
- `backend/scripts/verify_migration.py` - Verification script


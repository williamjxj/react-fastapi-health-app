# Supabase Migration Guide

**Date**: 2025-01-27  
**Feature**: PostgreSQL Migration to Supabase Cloud Service

## Overview

This guide provides detailed procedures for migrating your local PostgreSQL database to Supabase cloud service. The migration process includes schema migration, data migration with checkpoint support, and verification.

## Prerequisites

- Python 3.12+ installed
- Local PostgreSQL database with existing schema and data
- Supabase account and project created
- Supabase connection credentials
- Network access to Supabase

## Migration Process

### Phase 1: Supabase Project Setup

1. **Create Supabase Project**:
   - Visit https://supabase.com
   - Sign up or log in
   - Create a new project
   - Wait for project initialization (2-3 minutes)

2. **Obtain Connection Credentials**:
   - Go to Settings → Database
   - Copy connection strings:
     - **Connection Pooling** (port 6543): For application use
     - **Direct Connection** (port 5432): For migrations
   - Note: Connection strings include user, password, host, and database name

3. **Configure HIPAA Compliance** (if required):
   - SSL/TLS is automatically enabled (required)
   - Configure Row Level Security (RLS) policies
   - Enable audit logging (available in paid plans)
   - Consider Enterprise plan for HIPAA BAA (Business Associate Agreement)

### Phase 2: Environment Configuration

1. **Update Environment Variables**:
   ```bash
   cd backend
   cp .env.supabase .env
   # Edit .env and replace placeholders with your Supabase credentials
   ```

2. **Connection String Format**:
   - Application: `postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require`
   - Migrations: `postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require`
   - **Important**: Always include `?sslmode=require` for SSL/TLS encryption

3. **Verify Configuration**:
   ```bash
   python scripts/switch_database.py --show
   ```

### Phase 3: Schema Migration

1. **Run Alembic Migrations**:
   ```bash
   cd backend
   
   # Set DATABASE_URL to Supabase direct connection (port 5432)
   export DATABASE_URL="postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require"
   
   # Run migrations
   alembic upgrade head
   ```

2. **Verify Schema**:
   - Check Supabase SQL Editor or use psql:
   ```sql
   \dt  -- List tables
   SELECT * FROM migration_checkpoints;  -- Verify checkpoint table exists
   ```

### Phase 4: Data Migration

1. **Prepare Migration**:
   ```bash
   # Set environment variables
   export DATABASE_URL_LOCAL="postgresql+psycopg://postgres:password@localhost:5432/health_management"
   export DATABASE_URL="postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require"
   ```

2. **Run Migration Script**:
   ```bash
   python scripts/migrate_to_supabase.py
   ```

3. **Monitor Progress**:
   - Script logs progress to console and `migration.log`
   - Checkpoints are saved after each batch
   - Script automatically resumes from last checkpoint if interrupted

4. **Migration Options**:
   ```bash
   # Skip schema migration (if already done)
   python scripts/migrate_to_supabase.py --skip-schema
   
   # Specify table to migrate
   python scripts/migrate_to_supabase.py --table patients
   
   # Use custom connection URLs
   python scripts/migrate_to_supabase.py \
     --local-url "postgresql+psycopg://..." \
     --supabase-url "postgresql+psycopg://..."
   ```

### Phase 5: Verification

1. **Run Verification Script**:
   ```bash
   python scripts/verify_migration.py
   ```

2. **Verification Options**:
   ```bash
   # Specify sample size for detailed comparison
   python scripts/verify_migration.py --sample-size 200
   
   # Save report to file
   python scripts/verify_migration.py --output verification_report.txt
   ```

3. **Review Verification Report**:
   - Record count comparison
   - Sample record comparison
   - Schema verification
   - Any discrepancies flagged

### Phase 6: Application Switch

1. **Update Application Connection**:
   ```bash
   # Update .env to use Supabase connection pooler (port 6543)
   DATABASE_URL=postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require
   ```

2. **Restart Application**:
   ```bash
   uvicorn app.main:app --reload
   ```

3. **Verify Connection**:
   ```bash
   curl http://localhost:8000/health
   # Should show: {"status": "healthy", "database": "connected", ...}
   ```

4. **Test API Endpoints**:
   ```bash
   curl http://localhost:8000/patients
   curl http://localhost:8000/patients/P001
   ```

## Migration Features

### Resumable Migration

The migration script supports resumable execution:
- Checkpoints are saved after each batch (500 records)
- If migration fails, re-run the script to resume from last checkpoint
- No data duplication (idempotent UPSERT operations)

### Batch Processing

- Processes records in batches of 500 (configurable)
- Updates checkpoint after each batch
- Logs progress and statistics

### Error Handling

- Comprehensive error logging
- Failed records are logged but don't stop migration
- Checkpoint status updated on failure
- Error messages stored in checkpoint table

## Performance Considerations

- **Migration Speed**: ~10,000 records in under 30 minutes
- **Batch Size**: 500 records per batch (optimal for most cases)
- **Connection**: Use direct connection (port 5432) for migrations
- **Application**: Use connection pooler (port 6543) for application

## Troubleshooting

See `supabase-troubleshooting.md` for common issues and solutions.

## Next Steps

After successful migration:
1. Monitor application performance
2. Verify all API endpoints work correctly
3. Keep local database during verification period
4. Decommission local database after confidence period


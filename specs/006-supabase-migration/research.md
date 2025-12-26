# Research: PostgreSQL Migration to Supabase

**Date**: 2025-01-27  
**Feature**: PostgreSQL Migration to Supabase Cloud Service

## Research Questions

### 1. Supabase PostgreSQL Connection String Format

**Question**: How does Supabase connection string format differ from local PostgreSQL, and how to configure SQLAlchemy async?

**Decision**: Use Supabase connection pooler with `postgresql+psycopg://` driver, or direct connection string format.

**Rationale**: 
- Supabase provides connection strings in two formats:
  1. **Direct connection**: `postgresql://[user]:[password]@[host]:[port]/[database]`
  2. **Connection pooler**: `postgresql://[user]:[password]@[host]:6543/[database]` (port 6543)
- SQLAlchemy async requires `postgresql+psycopg://` prefix for async operations
- Connection pooler is recommended for production (better connection management)
- Direct connection is better for migrations (no connection limits)

**Alternatives Considered**:
- Using Supabase REST API: Rejected - too slow for bulk data migration, doesn't support schema migration
- Using pg_dump/pg_restore: Considered but requires additional tooling, less programmatic control

**Implementation Notes**:
- Supabase connection string includes SSL requirement: `?sslmode=require`
- Connection string format: `postgresql+psycopg://[user]:[password]@[host]:[port]/[database]?sslmode=require`
- For Alembic (sync operations): Use `postgresql+psycopg2://` with same connection string

**Sources**:
- Supabase documentation: Connection pooling and direct connections
- SQLAlchemy async documentation: Async drivers for PostgreSQL

---

### 2. Schema Migration Strategy

**Question**: How to migrate database schema (tables, indexes, constraints) from local PostgreSQL to Supabase?

**Decision**: Use Alembic migrations to apply schema to Supabase, ensuring compatibility with existing migration scripts.

**Rationale**:
- Alembic is already configured in the project
- Existing migration scripts can be run on Supabase (PostgreSQL-compatible)
- Alembic supports both sync and async operations
- Maintains version control and rollback capability

**Alternatives Considered**:
- Manual schema export/import: Rejected - error-prone, loses version control
- pg_dump schema-only: Considered but doesn't integrate with Alembic workflow
- Supabase CLI: Considered but adds dependency, Alembic is already established

**Implementation Notes**:
- Run `alembic upgrade head` against Supabase connection string
- Alembic env.py already configured to use settings.database_url
- Need to ensure Supabase supports all PostgreSQL features used (extensions, custom types)
- Verify compatibility: Supabase uses PostgreSQL 15.x, should support all standard features

**Sources**:
- Alembic documentation: Running migrations
- Supabase PostgreSQL compatibility documentation

---

### 3. Data Migration Strategy with Resumable Checkpoints

**Question**: How to implement resumable data migration with checkpoint support for large datasets?

**Decision**: Implement custom migration script with checkpoint tracking using a migration state table, processing records in batches with idempotent operations.

**Rationale**:
- Batch processing allows progress tracking and resumption
- Checkpoint table stores last successfully migrated record ID
- Idempotent operations (UPSERT) prevent duplicate records on retry
- Allows migration to resume from last checkpoint after failure

**Alternatives Considered**:
- Full transaction approach: Rejected - locks database for too long, no progress tracking
- Streaming migration: Considered but complex, batch approach is simpler and sufficient
- Third-party tools (AWS DMS, etc.): Rejected - overkill for this use case, adds complexity

**Implementation Notes**:
- Create `migration_checkpoints` table in Supabase to track progress
- Process records in batches of 100-1000 (configurable)
- Use `INSERT ... ON CONFLICT DO UPDATE` (UPSERT) for idempotency
- Log progress after each batch
- Store checkpoint: `{table_name, last_id, batch_number, timestamp}`

**Checkpoint Schema**:
```sql
CREATE TABLE migration_checkpoints (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    last_record_id INTEGER,
    batch_number INTEGER,
    records_migrated INTEGER,
    status VARCHAR(50), -- 'in_progress', 'completed', 'failed'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Sources**:
- Database migration best practices
- Idempotent operation patterns
- Batch processing strategies

---

### 4. HIPAA Compliance Requirements for Supabase

**Question**: How to ensure HIPAA compliance when using Supabase for healthcare data?

**Decision**: Configure Supabase project with encryption, access controls, and audit logging. Use Supabase Enterprise plan if required for HIPAA BAA.

**Rationale**:
- HIPAA requires: encryption at rest, encryption in transit, access controls, audit logs
- Supabase provides encryption in transit (SSL/TLS) by default
- Supabase provides encryption at rest (managed by Supabase infrastructure)
- Access controls via Row Level Security (RLS) policies
- Audit logging via Supabase audit logs (available in paid plans)

**Alternatives Considered**:
- Self-hosted PostgreSQL: Rejected - adds operational overhead, Supabase provides managed compliance
- Other cloud providers: Considered but Supabase is chosen platform

**Implementation Notes**:
- Enable SSL/TLS for all connections (required by Supabase)
- Configure Row Level Security (RLS) policies for patient data access
- Enable audit logging in Supabase dashboard (if available in plan)
- Store connection credentials securely in environment variables (not in code)
- Consider Supabase Enterprise plan for HIPAA BAA (Business Associate Agreement)

**Sources**:
- HIPAA compliance requirements
- Supabase security documentation
- Supabase Enterprise features

---

### 5. Alembic Compatibility with Supabase

**Question**: Are existing Alembic migration scripts compatible with Supabase PostgreSQL?

**Decision**: Yes, with minor considerations for connection string format and SSL requirements.

**Rationale**:
- Supabase uses standard PostgreSQL 15.x
- Alembic works with any PostgreSQL database
- Only difference is connection string format and SSL requirement
- Existing migrations should work without modification

**Alternatives Considered**:
- Rewriting migrations: Rejected - unnecessary, existing migrations are compatible
- Using Supabase migrations: Rejected - Alembic is already established, maintains consistency

**Implementation Notes**:
- Alembic env.py uses sync connection for migrations (postgresql+psycopg2://)
- Need to ensure connection string includes SSL: `?sslmode=require`
- Test existing migrations against Supabase before data migration
- Verify all PostgreSQL features used are supported (extensions, custom types)

**Sources**:
- Alembic documentation
- Supabase PostgreSQL compatibility

---

### 6. Connection Pooling and Performance

**Question**: How to configure connection pooling for Supabase to meet performance requirements?

**Decision**: Use Supabase connection pooler (port 6543) for application connections, direct connection (port 5432) for migrations.

**Rationale**:
- Connection pooler handles connection management efficiently
- Direct connection better for migrations (no connection limits, faster bulk operations)
- SQLAlchemy connection pool settings (pool_size=5, max_overflow=10) work with Supabase
- Performance targets (200ms p95, <2s connection) achievable with proper pooling

**Alternatives Considered**:
- Always use direct connection: Rejected - connection pooler is better for production workloads
- Always use pooler: Considered but direct connection better for migrations

**Implementation Notes**:
- Application: Use connection pooler URL (port 6543) for normal operations
- Migrations: Use direct connection URL (port 5432) for bulk operations
- Configure SQLAlchemy pool settings appropriately
- Monitor connection usage in Supabase dashboard

**Sources**:
- Supabase connection pooling documentation
- SQLAlchemy connection pool configuration

---

### 7. Data Verification Strategy

**Question**: How to verify data integrity after migration?

**Decision**: Implement verification script that compares record counts, sample records, and schema elements between local and Supabase databases.

**Rationale**:
- Record count comparison ensures no data loss
- Sample record comparison ensures data accuracy
- Schema comparison ensures all tables, indexes, constraints migrated
- Automated verification reduces manual effort and errors

**Alternatives Considered**:
- Manual verification: Rejected - error-prone, time-consuming
- Full record-by-record comparison: Considered but too slow for large datasets, sampling is sufficient

**Implementation Notes**:
- Compare total record counts per table
- Compare random sample of records (e.g., 100 records per table)
- Verify all indexes and constraints exist
- Generate verification report with statistics
- Flag any discrepancies for manual review

**Sources**:
- Data migration verification best practices
- Statistical sampling for large datasets

---

## Summary of Decisions

1. **Connection String**: Use `postgresql+psycopg://` with SSL (`?sslmode=require`) for async operations, direct connection for migrations
2. **Schema Migration**: Use existing Alembic migrations, run against Supabase connection string
3. **Data Migration**: Custom script with checkpoint table, batch processing, idempotent UPSERT operations
4. **HIPAA Compliance**: Configure SSL/TLS, RLS policies, audit logging, consider Enterprise plan for BAA
5. **Alembic Compatibility**: Existing migrations compatible, only connection string format differs
6. **Connection Pooling**: Use pooler for application (port 6543), direct for migrations (port 5432)
7. **Verification**: Automated script comparing counts, samples, and schema elements

## Open Questions Resolved

- ✅ Connection string format: Resolved - use Supabase-provided connection string with SSL
- ✅ Schema migration approach: Resolved - use Alembic
- ✅ Resumable migration: Resolved - checkpoint table with batch processing
- ✅ HIPAA compliance: Resolved - SSL, RLS, audit logs, Enterprise plan if needed
- ✅ Performance: Resolved - connection pooling and direct connections for different use cases

## Next Steps

1. Create migration script with checkpoint support
2. Update database.py to support Supabase connection string
3. Update Alembic env.py for Supabase SSL requirements
4. Create verification script
5. Document Supabase setup and configuration


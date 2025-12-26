# Data Model: PostgreSQL Migration to Supabase

**Date**: 2025-01-27  
**Feature**: PostgreSQL Migration to Supabase Cloud Service

## Overview

This document defines the data models and entities involved in migrating from local PostgreSQL to Supabase cloud service. The migration process introduces a checkpoint tracking system while preserving all existing patient data structures.

## Existing Entities

### Patient Entity

**Table Name**: `patients`

**Description**: Represents a patient record in the healthcare system. This entity exists in both local PostgreSQL and will be migrated to Supabase.

**Schema** (unchanged):
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): Auto-generated unique identifier
- `patient_id` (VARCHAR(50), UNIQUE, NOT NULL): Business identifier (e.g., "P001")
- `name` (VARCHAR(255), NOT NULL): Patient full name
- `age` (INTEGER, NOT NULL, CHECK age > 0): Patient age in years
- `gender` (VARCHAR(20), NOT NULL): Gender: 'Male', 'Female', or 'Other'
- `medical_condition` (VARCHAR(255), NOT NULL): Primary medical condition
- `last_visit` (DATE, NOT NULL): Date of last visit (YYYY-MM-DD format)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Record creation timestamp
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Record last update timestamp

**Indexes**:
- Primary key on `id`
- Unique index on `patient_id`
- Index on `name` (for search)

**Constraints**:
- Check constraint: `age > 0`
- Unique constraint on `patient_id`

**Migration Notes**:
- All patient records must be migrated to Supabase without modification
- Data types, constraints, and indexes must be preserved exactly
- Timestamps with timezone must be handled correctly during migration

---

## New Entities for Migration

### Migration Checkpoint Entity

**Table Name**: `migration_checkpoints`

**Description**: Tracks the progress of data migration from local PostgreSQL to Supabase. Enables resumable migration execution with checkpoint support.

**Schema**:
- `id` (SERIAL, PRIMARY KEY): Auto-generated unique identifier
- `table_name` (VARCHAR(255), NOT NULL): Name of the table being migrated
- `last_record_id` (INTEGER): ID of the last successfully migrated record
- `batch_number` (INTEGER): Current batch number being processed
- `records_migrated` (INTEGER, DEFAULT 0): Total number of records migrated so far
- `status` (VARCHAR(50), NOT NULL): Migration status: 'in_progress', 'completed', 'failed'
- `error_message` (TEXT): Error message if migration failed
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Checkpoint creation timestamp
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Checkpoint last update timestamp

**Indexes**:
- Primary key on `id`
- Unique index on `table_name` (one checkpoint per table)
- Index on `status` (for querying active migrations)

**Constraints**:
- Check constraint: `status IN ('in_progress', 'completed', 'failed')`
- NOT NULL constraints on `table_name` and `status`

**Usage**:
- Created in Supabase before data migration starts
- Updated after each successful batch migration
- Queried to resume migration from last checkpoint
- Status updated to 'completed' when all records migrated
- Status updated to 'failed' with error_message on failure

**Example Data**:
```json
{
  "id": 1,
  "table_name": "patients",
  "last_record_id": 5000,
  "batch_number": 50,
  "records_migrated": 5000,
  "status": "in_progress",
  "error_message": null,
  "created_at": "2025-01-27T10:30:00Z",
  "updated_at": "2025-01-27T10:35:00Z"
}
```

---

## Migration State Entity (Logical)

**Description**: Represents the overall state of the migration process. This is a logical entity tracked by the migration script, not a database table.

**Attributes**:
- `source_database`: Local PostgreSQL connection string
- `target_database`: Supabase connection string
- `schema_migration_status`: 'pending', 'in_progress', 'completed', 'failed'
- `data_migration_status`: 'pending', 'in_progress', 'completed', 'failed'
- `verification_status`: 'pending', 'in_progress', 'completed', 'failed'
- `start_time`: Migration start timestamp
- `end_time`: Migration completion timestamp
- `total_records`: Total number of records to migrate
- `records_migrated`: Number of records successfully migrated
- `errors`: List of errors encountered during migration

**Usage**:
- Tracked in memory during migration execution
- Logged to migration log file
- Used for progress reporting and error handling

---

## Data Relationships

### Migration Checkpoint → Patient Table

- **Relationship**: One checkpoint per table
- **Cardinality**: 1:1 (one checkpoint tracks one table's migration)
- **Purpose**: Track migration progress for each table independently

### Patient Data (Local) → Patient Data (Supabase)

- **Relationship**: 1:1 mapping during migration
- **Cardinality**: 1:1 (each local record maps to one Supabase record)
- **Purpose**: Ensure data integrity and completeness during migration
- **Mapping Key**: `id` or `patient_id` (depending on migration strategy)

---

## Data Migration Flow

```
Local PostgreSQL
    ↓
[Schema Migration via Alembic]
    ↓
Supabase (schema only)
    ↓
[Data Migration Script]
    ↓
[Checkpoint Tracking]
    ↓
Supabase (schema + data)
    ↓
[Verification Script]
    ↓
[Verification Report]
```

## Validation Rules

### Patient Data Validation

- All required fields must be present (NOT NULL constraints)
- `age` must be positive integer
- `patient_id` must be unique
- `last_visit` must be valid date
- `gender` must be one of: 'Male', 'Female', 'Other'

### Migration Checkpoint Validation

- `table_name` must match existing table in source database
- `last_record_id` must be valid (exists in source or NULL if starting)
- `status` must be one of: 'in_progress', 'completed', 'failed'
- `batch_number` must be non-negative integer
- `records_migrated` must be non-negative integer

## State Transitions

### Migration Checkpoint Status

```
pending → in_progress → completed
                ↓
             failed
                ↓
         in_progress (retry)
```

### Overall Migration State

```
Schema Migration: pending → in_progress → completed
Data Migration: pending → in_progress → completed
Verification: pending → in_progress → completed
```

## Query Patterns

### Migration Progress Query

```sql
SELECT 
    table_name,
    records_migrated,
    status,
    updated_at
FROM migration_checkpoints
WHERE status = 'in_progress'
ORDER BY updated_at DESC;
```

### Patient Record Count Comparison

```sql
-- Local database
SELECT COUNT(*) FROM patients;

-- Supabase
SELECT COUNT(*) FROM patients;
```

### Sample Record Verification

```sql
-- Compare random sample
SELECT * FROM patients 
WHERE id IN (SELECT id FROM patients ORDER BY RANDOM() LIMIT 100)
ORDER BY id;
```

## Performance Considerations

- **Batch Size**: Process records in batches of 500-1000 for optimal performance
- **Checkpoint Frequency**: Update checkpoint after each batch (every 500-1000 records)
- **Index Usage**: Use indexed columns (`id`, `patient_id`) for efficient lookups
- **Connection Pooling**: Use direct connection for migrations (no pooler overhead)
- **Transaction Size**: Commit after each batch to avoid long-running transactions

## Security Considerations

- **HIPAA Compliance**: All patient data must be encrypted in transit (SSL/TLS)
- **Access Controls**: Migration script must use secure credentials from environment variables
- **Audit Logging**: All migration operations must be logged for audit trail
- **Data Privacy**: No patient data should be logged in plain text (only IDs and counts)

## Future Schema Evolution

When new tables are added:
1. Create Alembic migration for new table schema
2. Run migration against Supabase
3. Add data migration logic for new table
4. Update checkpoint tracking to include new table
5. Run verification for new table


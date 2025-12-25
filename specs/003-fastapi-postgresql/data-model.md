# Data Model: Backend Migration to FastAPI and PostgreSQL

**Date**: 2025-01-27  
**Feature**: Backend Migration to FastAPI and PostgreSQL

## Overview

This document defines the database schema and data models for the patient management system, migrated from db.json to PostgreSQL.

## Entity: Patient

### Description
Represents a patient record in the healthcare system. Migrated from db.json with same structure to maintain API compatibility.

### Database Schema

**Table Name**: `patients`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Auto-generated unique identifier |
| patient_id | VARCHAR(50) | UNIQUE, NOT NULL | Business identifier (e.g., "P001") |
| name | VARCHAR(255) | NOT NULL | Patient full name |
| age | INTEGER | NOT NULL, CHECK (age > 0) | Patient age in years |
| gender | VARCHAR(20) | NOT NULL | Gender: 'Male', 'Female', or 'Other' |
| medical_condition | VARCHAR(255) | NOT NULL | Primary medical condition |
| last_visit | DATE | NOT NULL | Date of last visit (YYYY-MM-DD format) |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Record last update timestamp |

### Indexes

- **Primary Key**: `id` (automatic)
- **Unique Index**: `patient_id` (ensures no duplicate patient IDs)
- **Index**: `name` (for future search functionality)

### SQLAlchemy Model

```python
from sqlalchemy import Column, Integer, String, Date, DateTime, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    medical_condition = Column(String(255), nullable=False)
    last_visit = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        CheckConstraint('age > 0', name='check_age_positive'),
    )
```

### Pydantic Schemas

#### PatientBase (Shared fields)
```python
from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Literal

class PatientBase(BaseModel):
    patientID: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=255)
    age: int = Field(..., gt=0)
    gender: Literal["Male", "Female", "Other"]
    medicalCondition: str = Field(..., min_length=1, max_length=255)
    lastVisit: date
    
    @field_validator('lastVisit')
    @classmethod
    def validate_date_format(cls, v):
        if isinstance(v, str):
            # Parse YYYY-MM-DD format
            return date.fromisoformat(v)
        return v
```

#### PatientCreate (Request schema for POST)
```python
class PatientCreate(PatientBase):
    pass  # Same as PatientBase, id is auto-generated
```

#### PatientResponse (Response schema)
```python
class PatientResponse(PatientBase):
    id: int
    
    class Config:
        from_attributes = True  # For SQLAlchemy model conversion
```

### Field Mappings: db.json → PostgreSQL

| db.json Field | PostgreSQL Column | Notes |
|---------------|-------------------|-------|
| id | id | Auto-increment integer (was string in db.json) |
| patientID | patient_id | Snake_case in DB, camelCase in API |
| name | name | Direct mapping |
| age | age | Direct mapping, with CHECK constraint |
| gender | gender | Direct mapping, enum-like constraint |
| medicalCondition | medical_condition | Snake_case in DB, camelCase in API |
| lastVisit | last_visit | Snake_case in DB, camelCase in API |

**Note**: API maintains camelCase field names (patientID, medicalCondition, lastVisit) for frontend compatibility, while database uses snake_case (patient_id, medical_condition, last_visit) following PostgreSQL conventions.

### Validation Rules

1. **patientID**: Required, non-empty string, max 50 characters, unique
2. **name**: Required, non-empty string, max 255 characters
3. **age**: Required, integer, must be greater than 0
4. **gender**: Required, must be one of: "Male", "Female", "Other"
5. **medicalCondition**: Required, non-empty string, max 255 characters
6. **lastVisit**: Required, valid date in YYYY-MM-DD format

### Data Migration Considerations

#### Type Conversions

1. **id field**: 
   - db.json: String (e.g., "1", "2", "3e3a")
   - PostgreSQL: Auto-increment integer
   - **Migration**: Generate new integer IDs, preserve patientID as unique identifier

2. **patientID field**:
   - db.json: Mixed case (e.g., "P001", "p003")
   - PostgreSQL: VARCHAR(50), case-sensitive
   - **Migration**: Preserve exact case from db.json

3. **lastVisit field**:
   - db.json: String in YYYY-MM-DD format
   - PostgreSQL: DATE type
   - **Migration**: Parse string to DATE, validate format

#### Data Cleaning

During migration, the script should:
- Validate all required fields are present
- Check date format (YYYY-MM-DD)
- Verify age is positive integer
- Handle any malformed records gracefully (log and skip)
- Report migration statistics (successful, failed, skipped)

### Relationships

Currently no relationships defined. Future considerations:
- Patient → Visits (one-to-many)
- Patient → Medical Records (one-to-many)
- Patient → Appointments (one-to-many)

### State Transitions

N/A - Patient records are created and updated, no state machine required.

### Query Patterns

**Common Queries**:
1. Get all patients: `SELECT * FROM patients ORDER BY id`
2. Get patient by ID: `SELECT * FROM patients WHERE id = ?`
3. Get patient by patientID: `SELECT * FROM patients WHERE patient_id = ?`
4. Search by name: `SELECT * FROM patients WHERE name ILIKE ?` (future)

### Performance Considerations

- **Indexes**: patient_id (unique), name (for search)
- **Query Optimization**: Use indexed columns for lookups
- **Connection Pooling**: SQLAlchemy default pool (5 connections) sufficient for initial scale

### Security Considerations

- No PII encryption required (assumed non-sensitive demo data)
- Input validation via Pydantic prevents SQL injection
- Database credentials stored in environment variables
- No user authentication in initial scope (open API)

## Migration Script Data Flow

```
db.json (source)
    ↓
[Read JSON file]
    ↓
[Validate each patient record]
    ↓
[Convert to PatientCreate schema]
    ↓
[Insert into PostgreSQL via SQLAlchemy]
    ↓
[Verify insertion]
    ↓
PostgreSQL (target)
```

### Migration Validation

After migration, verify:
1. Record count matches: `SELECT COUNT(*) FROM patients` == `len(db.json['patients'])`
2. Sample records match: Compare a few records by patientID
3. All required fields populated: Check for NULL values
4. Data types correct: Verify age is integer, last_visit is DATE

## Future Schema Evolution

When schema changes are needed:
1. Create Alembic migration script
2. Update Pydantic schemas
3. Update API response format (if breaking change, coordinate with frontend)
4. Test migration on development database first


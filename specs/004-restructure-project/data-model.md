# Data Model: Project Structure Reorganization

**Feature**: 004-restructure-project  
**Date**: 2025-01-27  
**Note**: This restructuring does not introduce new data models. This document describes the existing data model that will be preserved after restructuring.

## Entities

### Patient

The Patient entity represents a patient record in the healthcare management system. This entity exists in all three services (frontend models, backend database, json-server data).

**Fields**:
- `id` (number, optional): Auto-generated unique identifier
  - Backend: Integer primary key, auto-increment
  - Json-server: String ID (e.g., "1", "2", "3e3a")
  - Frontend: Optional number for new records
- `patientID` (string, required): Unique patient identifier (e.g., "P001", "P002")
  - Backend: Stored as `patient_id` (snake_case), unique constraint, indexed
  - Frontend/Json-server: camelCase `patientID`
  - Validation: Required, non-empty string
- `name` (string, required): Patient's full name
  - Backend: VARCHAR(255), indexed
  - Validation: Required, non-empty string
- `age` (number, required): Patient's age
  - Backend: Integer with check constraint (age > 0)
  - Validation: Required, must be greater than zero
- `gender` (string, required): Patient's gender
  - Frontend: TypeScript enum `'Male' | 'Female' | 'Other'`
  - Backend: VARCHAR(20)
  - Validation: Required, must be one of the enum values
- `medicalCondition` (string, required): Patient's medical condition
  - Backend: Stored as `medical_condition` (snake_case), VARCHAR(255)
  - Frontend/Json-server: camelCase `medicalCondition`
  - Validation: Required, non-empty string
- `lastVisit` (string, required): Date of last visit in ISO format (YYYY-MM-DD)
  - Backend: Stored as `last_visit` (snake_case), DATE type
  - Frontend/Json-server: camelCase `lastVisit`, ISO date string
  - Validation: Required, must match YYYY-MM-DD format
- `created_at` (datetime, optional): Record creation timestamp (backend only)
  - Backend: DateTime with timezone, server default
  - Frontend/Json-server: Not present
- `updated_at` (datetime, optional): Record last update timestamp (backend only)
  - Backend: DateTime with timezone, auto-updated on modification
  - Frontend/Json-server: Not present

**Relationships**: None (Patient is a standalone entity)

**State Transitions**: None (Patient records are created and updated, no state machine)

**Validation Rules**:
1. `patientID` must be unique (enforced at database level in backend)
2. `age` must be greater than zero (enforced at database and application level)
3. `lastVisit` must be valid ISO date format (YYYY-MM-DD)
4. All required fields must be present and non-empty

**Identity & Uniqueness**:
- Primary key: `id` (backend auto-increment, json-server string)
- Unique constraint: `patientID` (backend database constraint)
- Indexes: `patient_id`, `name` (backend for query performance)

**Data Volume Assumptions**:
- Expected patient records: Hundreds to low thousands
- No pagination currently required (may be needed as data grows)
- Json-server handles in-memory JSON (suitable for development/mocking)

## Data Flow

### Frontend → Backend
1. User creates/updates patient via frontend form
2. Frontend validates using `validatePatient()` function
3. Frontend sends camelCase JSON to backend API
4. Backend Pydantic schema converts camelCase to snake_case
5. Backend SQLAlchemy model persists to PostgreSQL

### Backend → Frontend
1. Backend queries PostgreSQL database
2. SQLAlchemy model returns snake_case data
3. Backend Pydantic schema converts snake_case to camelCase
4. Frontend receives camelCase JSON
5. Frontend TypeScript models type-check the data

### Json-Server → Frontend
1. Json-server reads `db.json` file
2. Returns camelCase JSON (matches frontend format)
3. Frontend consumes data directly (no transformation needed)

## Data Consistency

**Naming Conventions**:
- Backend (Python/SQL): snake_case (`patient_id`, `medical_condition`, `last_visit`)
- Frontend/API (TypeScript/JSON): camelCase (`patientID`, `medicalCondition`, `lastVisit`)
- Transformation: Pydantic schemas handle conversion between formats

**Data Persistence**:
- Backend: PostgreSQL database (persistent, ACID-compliant)
- Json-server: `db.json` file (file-based, suitable for development)
- Frontend: No persistence (client-side state only)

## Migration Notes

After restructuring:
- Patient data model remains unchanged
- API contracts remain unchanged (camelCase JSON)
- Database schema remains unchanged
- Frontend models remain unchanged
- Only file locations change, not data structure


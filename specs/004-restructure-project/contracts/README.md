# API Contracts: Project Structure Reorganization

**Feature**: 004-restructure-project  
**Date**: 2025-01-27  
**Note**: These contracts document the existing API that will be preserved after restructuring. No API changes are introduced by this restructuring.

## Overview

The Patient Management API provides endpoints for managing patient records. The API is compatible between:
- **Backend (FastAPI)**: Production API running on port 8000
- **Json-server**: Mock API running on port 3001 (for development)

Both APIs maintain the same contract (endpoints, request/response formats) to ensure frontend compatibility.

## Base URLs

- **Backend (Production)**: `http://localhost:8000` (or production URL)
- **Json-server (Development)**: `http://localhost:3001`
- **Frontend Configuration**: Uses `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:8000`)

## Endpoints

### GET /patients

Get all patients.

**Request**:
- Method: `GET`
- Path: `/patients`
- Headers: None required

**Response**:
- Status: `200 OK`
- Content-Type: `application/json`
- Body: Array of Patient objects

**Example Response**:
```json
[
  {
    "id": 1,
    "patientID": "P001",
    "name": "John Doe",
    "age": 45,
    "gender": "Male",
    "medicalCondition": "Hypertension",
    "lastVisit": "2024-01-15"
  },
  {
    "id": 2,
    "patientID": "P002",
    "name": "Jane Smith",
    "age": 38,
    "gender": "Female",
    "medicalCondition": "Type 2 Diabetes",
    "lastVisit": "2024-02-10"
  }
]
```

**Error Responses**:
- `500 Internal Server Error`: Server error fetching patients

### POST /patients

Create a new patient.

**Request**:
- Method: `POST`
- Path: `/patients`
- Headers: `Content-Type: application/json`
- Body: PatientInput object (Patient without `id`)

**Request Body Schema**:
```json
{
  "patientID": "string (required, unique)",
  "name": "string (required)",
  "age": "number (required, > 0)",
  "gender": "string (required, one of: 'Male', 'Female', 'Other')",
  "medicalCondition": "string (required)",
  "lastVisit": "string (required, format: YYYY-MM-DD)"
}
```

**Example Request**:
```json
{
  "patientID": "P003",
  "name": "Bob Johnson",
  "age": 52,
  "gender": "Male",
  "medicalCondition": "Asthma",
  "lastVisit": "2024-03-20"
}
```

**Response**:
- Status: `201 Created`
- Content-Type: `application/json`
- Body: Created Patient object (includes auto-generated `id`)

**Example Response**:
```json
{
  "id": 3,
  "patientID": "P003",
  "name": "Bob Johnson",
  "age": 52,
  "gender": "Male",
  "medicalCondition": "Asthma",
  "lastVisit": "2024-03-20"
}
```

**Error Responses**:
- `400 Bad Request`: Validation error (missing/invalid fields)
- `409 Conflict`: Patient with the same `patientID` already exists (backend only)
- `500 Internal Server Error`: Server error creating patient

## Data Models

### Patient

Patient record with all fields.

**Fields**:
- `id` (number, optional): Auto-generated unique identifier
- `patientID` (string, required): Unique patient identifier
- `name` (string, required): Patient's full name
- `age` (number, required): Patient's age (must be > 0)
- `gender` (string, required): One of `'Male'`, `'Female'`, `'Other'`
- `medicalCondition` (string, required): Patient's medical condition
- `lastVisit` (string, required): Date in ISO format (YYYY-MM-DD)

### PatientInput

Patient creation payload (Patient without `id`).

**Fields**: Same as Patient, excluding `id`

## Validation Rules

1. **patientID**: Required, non-empty string, must be unique (backend enforces uniqueness)
2. **name**: Required, non-empty string
3. **age**: Required, must be a number greater than zero
4. **gender**: Required, must be one of: `'Male'`, `'Female'`, `'Other'`
5. **medicalCondition**: Required, non-empty string
6. **lastVisit**: Required, must match format `YYYY-MM-DD` (e.g., `2024-01-15`)

## API Compatibility

Both backend services (FastAPI and json-server) maintain API compatibility:

- **Same endpoints**: `/patients` (GET, POST)
- **Same request format**: camelCase JSON
- **Same response format**: camelCase JSON
- **Same validation rules**: Applied at application level

**Differences** (internal only, not affecting API contract):
- Backend: Uses PostgreSQL, enforces unique constraint on `patientID`
- Json-server: Uses JSON file, no unique constraint enforcement
- Backend: Returns `409 Conflict` for duplicate `patientID`
- Json-server: May allow duplicate `patientID` (depends on implementation)

## Frontend Integration

The frontend uses a unified API client (`patientService.ts`) that works with both backends:

```typescript
// Environment variable controls which backend to use
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// Same functions work with both backends
getPatients(): Promise<Patient[]>
createPatient(payload: PatientInput): Promise<Patient>
```

## Contract Testing

Existing contract tests verify API compatibility:
- `backend/tests/contract/test_api_compatibility.py`: Tests backend API matches expected contract
- Frontend integration tests verify API client works correctly

After restructuring, these tests must continue to pass, ensuring API contract is preserved.

## Migration Notes

After restructuring:
- API endpoints remain unchanged
- Request/response formats remain unchanged
- Only the base URL configuration may change (service-specific environment variables)
- Contract tests must pass to verify compatibility


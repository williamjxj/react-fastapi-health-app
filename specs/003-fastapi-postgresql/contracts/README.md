# API Contracts: Backend Migration to FastAPI and PostgreSQL

**Date**: 2025-01-27  
**Feature**: Backend Migration to FastAPI and PostgreSQL

> Note: These contracts describe the API endpoints that must be maintained during the migration from json-server to the new backend. The API must remain compatible with the existing frontend client.

## Patient API

### GET /patients
List all patients.

**Request:**
- Method: `GET`
- Headers: None required
- Query Parameters: None

**Response:**
- Status: `200 OK`
- Body: Array of patient objects
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
  }
]
```

### POST /patients
Create a new patient.

**Request:**
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body: Patient object (without `id`)
```json
{
  "patientID": "P001",
  "name": "John Doe",
  "age": 45,
  "gender": "Male",
  "medicalCondition": "Hypertension",
  "lastVisit": "2024-01-15"
}
```

**Response:**
- Status: `201 Created` (on success)
- Status: `400 Bad Request` (on validation error)
- Body: Created patient object (including auto-generated `id`)
```json
{
  "id": 1,
  "patientID": "P001",
  "name": "John Doe",
  "age": 45,
  "gender": "Male",
  "medicalCondition": "Hypertension",
  "lastVisit": "2024-01-15"
}
```

**Error Response:**
- Status: `400 Bad Request`
- Body: Error message describing validation failures

## Compatibility Requirements

- All endpoints must maintain the same URL paths as json-server
- Response formats must match exactly (same field names, data types, structure)
- HTTP status codes must follow REST conventions
- Error responses must be in a format compatible with existing frontend error handling


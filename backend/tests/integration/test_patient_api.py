"""Integration tests for patient API endpoints."""

import pytest
from datetime import date

from app.models.patient import Patient


@pytest.mark.asyncio
async def test_get_patients_empty(test_client, test_session):
    """Test GET /patients returns empty array when no patients exist."""
    response = await test_client.get("/patients")

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_get_patients_with_data(test_client, test_session):
    """Test GET /patients returns array of patients in correct format."""
    # Create test patient
    patient = Patient(
        patient_id="P001",
        name="John Doe",
        age=45,
        gender="Male",
        medical_condition="Hypertension",
        last_visit=date(2024, 1, 15),
    )
    test_session.add(patient)
    await test_session.commit()

    response = await test_client.get("/patients")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1

    patient_data = data[0]
    assert "id" in patient_data
    assert patient_data["patientID"] == "P001"  # camelCase
    assert patient_data["name"] == "John Doe"
    assert patient_data["age"] == 45
    assert patient_data["gender"] == "Male"
    assert patient_data["medicalCondition"] == "Hypertension"  # camelCase
    assert patient_data["lastVisit"] == "2024-01-15"


@pytest.mark.asyncio
async def test_post_patients_create(test_client, test_session):
    """Test POST /patients creates a new patient and returns 201."""
    patient_data = {
        "patientID": "P002",
        "name": "Jane Smith",
        "age": 38,
        "gender": "Female",
        "medicalCondition": "Type 2 Diabetes",
        "lastVisit": "2024-02-10",
    }

    response = await test_client.post("/patients", json=patient_data)

    assert response.status_code == 201
    data = response.json()

    assert "id" in data
    assert data["patientID"] == "P002"
    assert data["name"] == "Jane Smith"
    assert data["age"] == 38
    assert data["gender"] == "Female"
    assert data["medicalCondition"] == "Type 2 Diabetes"
    assert data["lastVisit"] == "2024-02-10"

    # Verify patient was saved to database
    from sqlalchemy import select

    result = await test_session.execute(select(Patient).where(Patient.patient_id == "P002"))
    saved_patient = result.scalar_one()
    assert saved_patient.name == "Jane Smith"


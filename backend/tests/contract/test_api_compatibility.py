"""Contract tests to verify API compatibility with json-server format."""

import pytest
from datetime import date

from app.models.patient import Patient


@pytest.mark.asyncio
async def test_api_response_format_matches_json_server(test_client, test_session):
    """Test that API response format matches json-server exactly."""
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

    # GET /patients should return array with camelCase fields
    response = await test_client.get("/patients")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

    patient_response = data[0]

    # Verify camelCase field names (json-server format)
    assert "id" in patient_response
    assert "patientID" in patient_response  # camelCase, not patient_id
    assert "name" in patient_response
    assert "age" in patient_response
    assert "gender" in patient_response
    assert "medicalCondition" in patient_response  # camelCase, not medical_condition
    assert "lastVisit" in patient_response  # camelCase, not last_visit

    # Verify no snake_case fields
    assert "patient_id" not in patient_response
    assert "medical_condition" not in patient_response
    assert "last_visit" not in patient_response


@pytest.mark.asyncio
async def test_post_response_format_matches_json_server(test_client, test_session):
    """Test that POST /patients response format matches json-server."""
    patient_data = {
        "patientID": "P003",
        "name": "Test Patient",
        "age": 30,
        "gender": "Other",
        "medicalCondition": "Test Condition",
        "lastVisit": "2024-01-27",
    }

    response = await test_client.post("/patients", json=patient_data)
    assert response.status_code == 201

    data = response.json()

    # Verify response has same structure as json-server
    assert "id" in data
    assert data["patientID"] == "P003"  # camelCase
    assert data["medicalCondition"] == "Test Condition"  # camelCase
    assert data["lastVisit"] == "2024-01-27"  # camelCase

    # Verify field types match json-server
    assert isinstance(data["id"], int)
    assert isinstance(data["patientID"], str)
    assert isinstance(data["age"], int)


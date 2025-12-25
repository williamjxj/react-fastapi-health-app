"""Unit tests for Pydantic patient schemas."""

import pytest
from datetime import date
from pydantic import ValidationError

from app.schemas.patient import PatientCreate, PatientResponse


def test_patient_create_valid():
    """Test creating a valid PatientCreate schema."""
    patient_data = {
        "patientID": "P001",
        "name": "John Doe",
        "age": 45,
        "gender": "Male",
        "medicalCondition": "Hypertension",
        "lastVisit": "2024-01-15",
    }
    patient = PatientCreate(**patient_data)

    assert patient.patientID == "P001"
    assert patient.name == "John Doe"
    assert patient.age == 45
    assert patient.gender == "Male"
    assert patient.medicalCondition == "Hypertension"
    assert patient.lastVisit == date(2024, 1, 15)


def test_patient_create_date_string_parsing():
    """Test that date strings are parsed correctly."""
    patient_data = {
        "patientID": "P001",
        "name": "John Doe",
        "age": 45,
        "gender": "Male",
        "medicalCondition": "Hypertension",
        "lastVisit": "2024-01-15",  # String format
    }
    patient = PatientCreate(**patient_data)

    assert isinstance(patient.lastVisit, date)
    assert patient.lastVisit == date(2024, 1, 15)


def test_patient_create_validation_age_gt_zero():
    """Test that age must be greater than 0."""
    patient_data = {
        "patientID": "P001",
        "name": "John Doe",
        "age": 0,  # Invalid
        "gender": "Male",
        "medicalCondition": "Hypertension",
        "lastVisit": "2024-01-15",
    }

    with pytest.raises(ValidationError) as exc_info:
        PatientCreate(**patient_data)

    assert "age" in str(exc_info.value).lower()


def test_patient_create_validation_required_fields():
    """Test that all required fields are validated."""
    incomplete_data = {
        "patientID": "P001",
        # Missing required fields
    }

    with pytest.raises(ValidationError):
        PatientCreate(**incomplete_data)


def test_patient_response_from_attributes():
    """Test PatientResponse can be created from SQLAlchemy model attributes."""
    # Simulate SQLAlchemy model attributes
    patient_dict = {
        "id": 1,
        "patient_id": "P001",
        "name": "John Doe",
        "age": 45,
        "gender": "Male",
        "medical_condition": "Hypertension",
        "last_visit": date(2024, 1, 15),
    }

    # This would normally come from SQLAlchemy model
    # For testing, we create a mock object
    class MockPatient:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)

    mock_patient = MockPatient(**patient_dict)

    # Convert snake_case to camelCase for response
    response_data = {
        "id": mock_patient.id,
        "patientID": mock_patient.patient_id,
        "name": mock_patient.name,
        "age": mock_patient.age,
        "gender": mock_patient.gender,
        "medicalCondition": mock_patient.medical_condition,
        "lastVisit": mock_patient.last_visit,
    }

    response = PatientResponse(**response_data)

    assert response.id == 1
    assert response.patientID == "P001"
    assert response.medicalCondition == "Hypertension"  # camelCase


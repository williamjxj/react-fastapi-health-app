"""Unit tests for Patient SQLAlchemy model."""

import pytest
from sqlalchemy.exc import IntegrityError

from app.models.patient import Patient


@pytest.mark.asyncio
async def test_patient_model_creation(test_session):
    """Test creating a patient model instance."""
    patient = Patient(
        patient_id="P001",
        name="John Doe",
        age=45,
        gender="Male",
        medical_condition="Hypertension",
        last_visit="2024-01-15",
    )
    test_session.add(patient)
    await test_session.commit()
    await test_session.refresh(patient)

    assert patient.id is not None
    assert patient.patient_id == "P001"
    assert patient.name == "John Doe"
    assert patient.age == 45
    assert patient.gender == "Male"
    assert patient.medical_condition == "Hypertension"
    assert str(patient.last_visit) == "2024-01-15"


@pytest.mark.asyncio
async def test_patient_id_unique_constraint(test_session):
    """Test that patient_id must be unique."""
    patient1 = Patient(
        patient_id="P001",
        name="John Doe",
        age=45,
        gender="Male",
        medical_condition="Hypertension",
        last_visit="2024-01-15",
    )
    test_session.add(patient1)
    await test_session.commit()

    patient2 = Patient(
        patient_id="P001",  # Duplicate
        name="Jane Doe",
        age=30,
        gender="Female",
        medical_condition="Diabetes",
        last_visit="2024-01-20",
    )
    test_session.add(patient2)

    with pytest.raises(IntegrityError):
        await test_session.commit()


@pytest.mark.asyncio
async def test_patient_age_constraint(test_session):
    """Test that age must be greater than 0."""
    patient = Patient(
        patient_id="P002",
        name="Test Patient",
        age=0,  # Invalid age
        gender="Male",
        medical_condition="Test",
        last_visit="2024-01-15",
    )
    test_session.add(patient)

    with pytest.raises(IntegrityError):
        await test_session.commit()


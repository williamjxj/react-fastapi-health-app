"""Business logic for patient operations."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientResponse


async def get_all_patients(db: AsyncSession) -> list[Patient]:
    """
    Retrieve all patients from the database.

    Args:
        db: Database session

    Returns:
        List of Patient models
    """
    result = await db.execute(select(Patient).order_by(Patient.id))
    return list(result.scalars().all())


async def create_patient(db: AsyncSession, patient_data: PatientCreate) -> Patient:
    """
    Create a new patient in the database.

    Args:
        db: Database session
        patient_data: Patient creation data

    Returns:
        Created Patient model

    Raises:
        IntegrityError: If patient_id already exists
    """
    # Convert camelCase to snake_case for database
    patient = Patient(
        patient_id=patient_data.patientID,
        name=patient_data.name,
        age=patient_data.age,
        gender=patient_data.gender,
        medical_condition=patient_data.medicalCondition,
        last_visit=patient_data.lastVisit,
    )

    db.add(patient)
    try:
        await db.commit()
        await db.refresh(patient)
        return patient
    except IntegrityError as e:
        await db.rollback()
        raise e


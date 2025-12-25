"""Business logic for patient operations."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, asc, desc
from sqlalchemy.exc import IntegrityError
from math import ceil

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


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


async def search_patients(
    db: AsyncSession,
    search: str | None = None,
    page: int = 1,
    page_size: int = 20,
    sort_by: str = "patient_id",
    sort_order: str = "asc",
) -> tuple[list[Patient], int]:
    """
    Search and retrieve patients with pagination and sorting.

    Args:
        db: Database session
        search: Search term to filter by patientID or name
        page: Page number (1-indexed)
        page_size: Number of items per page
        sort_by: Field to sort by (patient_id, name, age)
        sort_order: Sort order (asc or desc)

    Returns:
        Tuple of (list of Patient models, total count)
    """
    # Build base query
    query = select(Patient)

    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Patient.patient_id.ilike(search_term),
                Patient.name.ilike(search_term),
            )
        )

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply sorting
    sort_column_map = {
        "patient_id": Patient.patient_id,
        "patientID": Patient.patient_id,
        "name": Patient.name,
        "age": Patient.age,
    }
    sort_column = sort_column_map.get(sort_by, Patient.patient_id)
    if sort_order.lower() == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.limit(page_size).offset(offset)

    # Execute query
    result = await db.execute(query)
    patients = list(result.scalars().all())

    return patients, total


async def get_patient_by_patient_id(
    db: AsyncSession, patient_id: str
) -> Patient | None:
    """
    Retrieve a patient by patient_id.

    Args:
        db: Database session
        patient_id: Patient ID (e.g., "P001")

    Returns:
        Patient model if found, None otherwise
    """
    result = await db.execute(
        select(Patient).where(Patient.patient_id == patient_id)
    )
    return result.scalar_one_or_none()


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


async def update_patient(
    db: AsyncSession, patient_id: str, patient_data: PatientUpdate
) -> Patient | None:
    """
    Update a patient by patient_id.

    Args:
        db: Database session
        patient_id: Patient ID to update (e.g., "P001")
        patient_data: Patient update data (only provided fields will be updated)

    Returns:
        Updated Patient model if found, None otherwise

    Raises:
        IntegrityError: If updated patient_id already exists
    """
    # Find the patient
    patient = await get_patient_by_patient_id(db, patient_id)
    if patient is None:
        return None

    # Update only provided fields
    if patient_data.patientID is not None:
        patient.patient_id = patient_data.patientID
    if patient_data.name is not None:
        patient.name = patient_data.name
    if patient_data.age is not None:
        patient.age = patient_data.age
    if patient_data.gender is not None:
        patient.gender = patient_data.gender
    if patient_data.medicalCondition is not None:
        patient.medical_condition = patient_data.medicalCondition
    if patient_data.lastVisit is not None:
        patient.last_visit = patient_data.lastVisit

    try:
        await db.commit()
        await db.refresh(patient)
        return patient
    except IntegrityError as e:
        await db.rollback()
        raise e


async def delete_patient(db: AsyncSession, patient_id: str) -> bool:
    """
    Delete a patient by patient_id.

    Args:
        db: Database session
        patient_id: Patient ID to delete (e.g., "P001")

    Returns:
        True if patient was deleted, False if not found
    """
    patient = await get_patient_by_patient_id(db, patient_id)
    if patient is None:
        return False

    await db.delete(patient)
    await db.commit()
    return True


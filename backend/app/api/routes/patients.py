"""Patient API routes."""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.schemas.patient import PatientCreate, PatientResponse
from app.services.patient_service import get_all_patients, create_patient

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("", response_model=list[PatientResponse])
async def get_patients(db: AsyncSession = Depends(get_db)):
    """
    Get all patients.

    Returns:
        List of all patients in the database
    """
    try:
        patients = await get_all_patients(db)
        # Convert to response format with camelCase fields
        response_list = [PatientResponse.from_orm(p) for p in patients]
        return response_list
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error fetching patients: {type(e).__name__}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch patients: {str(e)}"
        )


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient_endpoint(
    patient: PatientCreate, db: AsyncSession = Depends(get_db)
):
    """
    Create a new patient.

    Args:
        patient: Patient creation data
        db: Database session

    Returns:
        Created patient with auto-generated ID

    Raises:
        HTTPException: 400 if validation fails, 409 if patient_id already exists
    """
    try:
        created_patient = await create_patient(db, patient)
        # Convert to response format with camelCase fields
        return PatientResponse.from_orm(created_patient)
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except IntegrityError as e:
        await db.rollback()
        if "patient_id" in str(e.orig).lower() or "unique" in str(e.orig).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Patient with ID '{patient.patientID}' already exists",
            )
        logger.error(f"Database error creating patient: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create patient",
        )
    except Exception as e:
        logger.error(f"Unexpected error creating patient: {type(e).__name__}: {e}", exc_info=True)
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create patient: {str(e)}"
        )


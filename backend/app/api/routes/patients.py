"""Patient API routes."""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PaginatedResponse,
)
from app.services.patient_service import (
    get_all_patients,
    get_patient_by_patient_id,
    create_patient,
    search_patients,
    update_patient,
    delete_patient,
)
from math import ceil

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("", response_model=PaginatedResponse)
async def get_patients(
    search: str | None = None,
    page: int = 1,
    page_size: int = 20,
    sort_by: str = "patientID",
    sort_order: str = "asc",
    db: AsyncSession = Depends(get_db),
):
    """
    Get patients with search, pagination, and sorting.

    Query Parameters:
        search: Search term to filter by patientID or name (optional)
        page: Page number (default: 1)
        page_size: Number of items per page (default: 20)
        sort_by: Field to sort by - patientID, name, or age (default: patientID)
        sort_order: Sort order - asc or desc (default: asc)

    Returns:
        Paginated response with patients list and metadata
    """
    try:
        # Normalize sort_by to match database column names
        sort_by_map = {
            "patientID": "patient_id",
            "patient_id": "patient_id",
            "name": "name",
            "age": "age",
        }
        sort_by_db = sort_by_map.get(sort_by, "patient_id")

        patients, total = await search_patients(
            db=db,
            search=search,
            page=page,
            page_size=page_size,
            sort_by=sort_by_db,
            sort_order=sort_order,
        )

        # Convert to response format with camelCase fields
        items = [PatientResponse.from_orm(p) for p in patients]
        total_pages = ceil(total / page_size) if total > 0 else 0

        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
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


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient_by_id(
    patient_id: str, db: AsyncSession = Depends(get_db)
):
    """
    Get a patient by patientID.

    Args:
        patient_id: Patient ID (e.g., "P001")
        db: Database session

    Returns:
        Patient with the specified patientID

    Raises:
        HTTPException: 404 if patient not found
    """
    try:
        patient = await get_patient_by_patient_id(db, patient_id)
        if patient is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID '{patient_id}' not found",
            )
        # Convert to response format with camelCase fields
        return PatientResponse.from_orm(patient)
    except HTTPException:
        # Re-raise HTTP exceptions (including 404)
        raise
    except Exception as e:
        # Log the error for debugging
        logger.error(
            f"Error fetching patient {patient_id}: {type(e).__name__}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch patient: {str(e)}",
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


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient_endpoint(
    patient_id: str,
    patient: PatientUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update a patient by patientID.

    Args:
        patient_id: Patient ID to update (e.g., "P001")
        patient: Patient update data (only provided fields will be updated)
        db: Database session

    Returns:
        Updated patient

    Raises:
        HTTPException: 404 if patient not found, 409 if updated patient_id already exists
    """
    try:
        updated_patient = await update_patient(db, patient_id, patient)
        if updated_patient is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID '{patient_id}' not found",
            )
        # Convert to response format with camelCase fields
        return PatientResponse.from_orm(updated_patient)
    except HTTPException:
        # Re-raise HTTP exceptions (including 404)
        raise
    except IntegrityError as e:
        await db.rollback()
        if "patient_id" in str(e.orig).lower() or "unique" in str(e.orig).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Patient with ID '{patient.patientID}' already exists",
            )
        logger.error(f"Database error updating patient: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update patient",
        )
    except Exception as e:
        logger.error(
            f"Unexpected error updating patient {patient_id}: {type(e).__name__}: {e}",
            exc_info=True,
        )
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update patient: {str(e)}",
        )


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient_endpoint(
    patient_id: str, db: AsyncSession = Depends(get_db)
):
    """
    Delete a patient by patientID.

    Args:
        patient_id: Patient ID to delete (e.g., "P001")
        db: Database session

    Raises:
        HTTPException: 404 if patient not found
    """
    try:
        deleted = await delete_patient(db, patient_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID '{patient_id}' not found",
            )
        # Return 204 No Content on success
        return None
    except HTTPException:
        # Re-raise HTTP exceptions (including 404)
        raise
    except Exception as e:
        logger.error(
            f"Unexpected error deleting patient {patient_id}: {type(e).__name__}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete patient: {str(e)}",
        )


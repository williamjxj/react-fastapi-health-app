"""Pydantic schemas for Patient entity."""

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class PatientBase(BaseModel):
    """Base patient schema with shared fields."""

    patientID: str = Field(..., min_length=1, max_length=50, description="Patient ID")
    name: str = Field(..., min_length=1, max_length=255, description="Patient name")
    age: int = Field(..., gt=0, description="Patient age in years")
    gender: Literal["Male", "Female", "Other"] = Field(..., description="Patient gender")
    medicalCondition: str = Field(
        ..., min_length=1, max_length=255, description="Medical condition"
    )
    lastVisit: date = Field(..., description="Last visit date (YYYY-MM-DD)")

    @field_validator("lastVisit", mode="before")
    @classmethod
    def validate_date_format(cls, v):
        """Parse date string to date object."""
        if isinstance(v, str):
            return date.fromisoformat(v)
        return v


class PatientCreate(PatientBase):
    """Schema for creating a new patient (request body)."""

    pass


class PatientResponse(PatientBase):
    """Schema for patient response (includes auto-generated id)."""

    id: int = Field(..., description="Auto-generated patient ID")

    @classmethod
    def from_orm(cls, obj):
        """Convert SQLAlchemy model to response schema with camelCase fields."""
        return cls(
            id=obj.id,
            patientID=obj.patient_id,  # Convert snake_case to camelCase
            name=obj.name,
            age=obj.age,
            gender=obj.gender,
            medicalCondition=obj.medical_condition,  # Convert snake_case to camelCase
            lastVisit=obj.last_visit,  # Convert snake_case to camelCase
        )

    class Config:
        """Pydantic config."""

        from_attributes = True  # Enable SQLAlchemy model conversion
        populate_by_name = True
        json_encoders = {
            # Ensure date serialization works correctly
        }


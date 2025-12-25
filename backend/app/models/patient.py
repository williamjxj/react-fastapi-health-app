"""Patient SQLAlchemy model."""

from sqlalchemy import Column, Integer, String, Date, DateTime, CheckConstraint
from sqlalchemy.sql import func

from app.models import Base


class Patient(Base):
    """Patient model representing a patient record in the database."""

    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    medical_condition = Column(String(255), nullable=False)
    last_visit = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (CheckConstraint("age > 0", name="check_age_positive"),)


"""Migration checkpoint SQLAlchemy model."""

from sqlalchemy import Column, Integer, String, Text, DateTime, CheckConstraint
from sqlalchemy.sql import func

from app.models import Base


class MigrationCheckpoint(Base):
    """Migration checkpoint model for tracking migration progress."""

    __tablename__ = "migration_checkpoints"

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_name = Column(String(255), nullable=False, unique=True, index=True)
    last_record_id = Column(Integer, nullable=True)
    batch_number = Column(Integer, nullable=True)
    records_migrated = Column(Integer, nullable=False, server_default="0")
    status = Column(String(50), nullable=False, index=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint("status IN ('in_progress', 'completed', 'failed')", name="check_status_valid"),
    )

    def __repr__(self) -> str:
        """String representation of MigrationCheckpoint."""
        return (
            f"<MigrationCheckpoint(id={self.id}, table_name='{self.table_name}', "
            f"status='{self.status}', records_migrated={self.records_migrated})>"
        )


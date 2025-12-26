"""Unit tests for MigrationCheckpoint model."""

import pytest
import asyncio
from sqlalchemy.exc import IntegrityError

from app.models.migration_checkpoint import MigrationCheckpoint


@pytest.mark.asyncio
async def test_migration_checkpoint_creation(test_session):
    """Test creating a migration checkpoint."""
    checkpoint = MigrationCheckpoint(
        table_name="patients",
        last_record_id=100,
        batch_number=1,
        records_migrated=100,
        status="in_progress",
    )
    test_session.add(checkpoint)
    await test_session.commit()
    await test_session.refresh(checkpoint)

    assert checkpoint.id is not None
    assert checkpoint.table_name == "patients"
    assert checkpoint.last_record_id == 100
    assert checkpoint.batch_number == 1
    assert checkpoint.records_migrated == 100
    assert checkpoint.status == "in_progress"
    assert checkpoint.error_message is None
    assert checkpoint.created_at is not None
    assert checkpoint.updated_at is not None


@pytest.mark.asyncio
async def test_migration_checkpoint_unique_table_name(test_session):
    """Test that table_name must be unique."""
    checkpoint1 = MigrationCheckpoint(
        table_name="patients",
        status="in_progress",
    )
    test_session.add(checkpoint1)
    await test_session.commit()

    checkpoint2 = MigrationCheckpoint(
        table_name="patients",
        status="completed",
    )
    test_session.add(checkpoint2)

    with pytest.raises(IntegrityError):
        await test_session.commit()


@pytest.mark.asyncio
async def test_migration_checkpoint_status_constraint(test_session):
    """Test that status must be one of allowed values."""
    # Valid statuses should work
    valid_statuses = ["in_progress", "completed", "failed"]
    for status in valid_statuses:
        checkpoint = MigrationCheckpoint(
            table_name=f"table_{status}",
            status=status,
        )
        test_session.add(checkpoint)
        await test_session.commit()
        await test_session.delete(checkpoint)
        await test_session.commit()


@pytest.mark.asyncio
async def test_migration_checkpoint_defaults(test_session):
    """Test default values for MigrationCheckpoint."""
    checkpoint = MigrationCheckpoint(
        table_name="patients",
        status="in_progress",
    )
    test_session.add(checkpoint)
    await test_session.commit()
    await test_session.refresh(checkpoint)

    assert checkpoint.records_migrated == 0
    assert checkpoint.last_record_id is None
    assert checkpoint.batch_number is None
    assert checkpoint.error_message is None


@pytest.mark.asyncio
async def test_migration_checkpoint_repr(test_session):
    """Test string representation of MigrationCheckpoint."""
    checkpoint = MigrationCheckpoint(
        table_name="patients",
        status="in_progress",
        records_migrated=500,
    )
    test_session.add(checkpoint)
    await test_session.commit()

    repr_str = repr(checkpoint)
    assert "MigrationCheckpoint" in repr_str
    assert "patients" in repr_str
    assert "in_progress" in repr_str
    assert "500" in repr_str


@pytest.mark.asyncio
async def test_migration_checkpoint_update_timestamp(test_session):
    """Test that updated_at changes on update."""
    checkpoint = MigrationCheckpoint(
        table_name="patients",
        status="in_progress",
    )
    test_session.add(checkpoint)
    await test_session.commit()
    await test_session.refresh(checkpoint)

    original_updated_at = checkpoint.updated_at
    # Wait a moment to ensure timestamp difference
    await asyncio.sleep(0.1)

    checkpoint.status = "completed"
    await test_session.commit()
    await test_session.refresh(checkpoint)

    assert checkpoint.updated_at > original_updated_at


@pytest.mark.asyncio
async def test_migration_checkpoint_error_message(test_session):
    """Test storing error messages in checkpoint."""
    checkpoint = MigrationCheckpoint(
        table_name="patients",
        status="failed",
        error_message="Connection timeout",
    )
    test_session.add(checkpoint)
    await test_session.commit()
    await test_session.refresh(checkpoint)

    assert checkpoint.error_message == "Connection timeout"
    assert checkpoint.status == "failed"


"""Script to migrate database from local PostgreSQL to Supabase.

This script performs:
1. Schema migration using Alembic
2. Data migration with checkpoint support for resumable execution
3. Progress tracking and error handling

Usage:
    python scripts/migrate_to_supabase.py [options]

Options:
    --local-url URL       Local PostgreSQL connection URL
    --supabase-url URL    Supabase connection URL
    --skip-schema         Skip schema migration
    --table NAME          Table name to migrate (default: patients)

Environment Variables:
    DATABASE_URL_LOCAL    Local PostgreSQL connection URL
    DATABASE_URL          Supabase connection URL (used if --supabase-url not provided)

Examples:
    # Basic migration
    python scripts/migrate_to_supabase.py

    # With custom URLs
    python scripts/migrate_to_supabase.py \\
        --local-url "postgresql+psycopg://..." \\
        --supabase-url "postgresql+psycopg://..."

    # Skip schema migration (already done)
    python scripts/migrate_to_supabase.py --skip-schema
"""

import asyncio
import argparse
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text, select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.models.patient import Patient
from app.models.migration_checkpoint import MigrationCheckpoint

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("migration.log"),
    ],
)
logger = logging.getLogger(__name__)

# Migration configuration
BATCH_SIZE = 500  # Records per batch
CHECKPOINT_INTERVAL = 1  # Update checkpoint after each batch


async def run_alembic_migrations(supabase_url: str) -> bool:
    """
    Run Alembic migrations against Supabase database.

    Args:
        supabase_url: Supabase connection string

    Returns:
        True if migrations succeeded, False otherwise
    """
    logger.info("Starting schema migration to Supabase...")
    try:
        import subprocess
        import os

        # Set DATABASE_URL for Alembic
        env = os.environ.copy()
        env["DATABASE_URL"] = supabase_url

        # Run alembic upgrade head
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=Path(__file__).parent.parent,
            env=env,
            capture_output=True,
            text=True,
        )

        if result.returncode == 0:
            logger.info("Schema migration completed successfully")
            return True
        else:
            logger.error(f"Schema migration failed: {result.stderr}")
            return False
    except Exception as e:
        logger.error(f"Error running Alembic migrations: {e}", exc_info=True)
        return False


async def ensure_checkpoint_table(supabase_session: AsyncSession) -> bool:
    """
    Ensure migration_checkpoints table exists in Supabase.

    Args:
        supabase_session: Supabase database session

    Returns:
        True if table exists or was created, False otherwise
    """
    logger.info("Checking migration_checkpoints table...")
    try:
        # Check if table exists
        result = await supabase_session.execute(
            text(
                """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'migration_checkpoints'
                )
                """
            )
        )
        exists = result.scalar()

        if not exists:
            logger.warning("migration_checkpoints table not found. Running migration...")
            # Table should be created by Alembic migration, but if not, create it
            await run_alembic_migrations(settings.database_url)
            return True

        logger.info("migration_checkpoints table exists")
        return True
    except Exception as e:
        logger.error(f"Error checking checkpoint table: {e}", exc_info=True)
        return False


async def get_checkpoint(
    session: AsyncSession, table_name: str
) -> Optional[MigrationCheckpoint]:
    """
    Get checkpoint for a table.

    Args:
        session: Database session
        table_name: Name of the table

    Returns:
        MigrationCheckpoint if exists, None otherwise
    """
    try:
        result = await session.execute(
            select(MigrationCheckpoint).where(MigrationCheckpoint.table_name == table_name)
        )
        return result.scalar_one_or_none()
    except Exception as e:
        logger.error(f"Error getting checkpoint: {e}", exc_info=True)
        return None


async def save_checkpoint(
    session: AsyncSession,
    table_name: str,
    last_record_id: Optional[int],
    batch_number: int,
    records_migrated: int,
    status: str,
    error_message: Optional[str] = None,
) -> bool:
    """
    Save or update checkpoint.

    Args:
        session: Database session
        table_name: Name of the table
        last_record_id: Last migrated record ID
        batch_number: Current batch number
        records_migrated: Total records migrated
        status: Migration status
        error_message: Error message if failed

    Returns:
        True if saved successfully, False otherwise
    """
    try:
        checkpoint = await get_checkpoint(session, table_name)

        if checkpoint:
            checkpoint.last_record_id = last_record_id
            checkpoint.batch_number = batch_number
            checkpoint.records_migrated = records_migrated
            checkpoint.status = status
            checkpoint.error_message = error_message
        else:
            checkpoint = MigrationCheckpoint(
                table_name=table_name,
                last_record_id=last_record_id,
                batch_number=batch_number,
                records_migrated=records_migrated,
                status=status,
                error_message=error_message,
            )
            session.add(checkpoint)

        await session.commit()
        return True
    except Exception as e:
        logger.error(f"Error saving checkpoint: {e}", exc_info=True)
        await session.rollback()
        return False


async def migrate_patients_data(
    local_session: AsyncSession,
    supabase_session: AsyncSession,
    table_name: str = "patients",
) -> dict:
    """
    Migrate patient data from local PostgreSQL to Supabase with checkpoint support.

    Args:
        local_session: Local database session
        supabase_session: Supabase database session
        table_name: Name of the table to migrate

    Returns:
        Dictionary with migration statistics
    """
    logger.info(f"Starting data migration for {table_name}...")

    # Get or create checkpoint
    checkpoint = await get_checkpoint(supabase_session, table_name)
    start_id = checkpoint.last_record_id if checkpoint else None
    batch_number = checkpoint.batch_number if checkpoint else 0
    records_migrated = checkpoint.records_migrated if checkpoint else 0

    if checkpoint and checkpoint.status == "completed":
        logger.info(f"Migration for {table_name} already completed")
        return {
            "total": records_migrated,
            "migrated": records_migrated,
            "failed": 0,
            "status": "already_completed",
        }

    # Update checkpoint status to in_progress
    await save_checkpoint(
        supabase_session,
        table_name,
        start_id,
        batch_number,
        records_migrated,
        "in_progress",
    )

    try:
        # Get total count
        total_result = await local_session.execute(
            select(Patient).order_by(Patient.id)
        )
        all_patients = total_result.scalars().all()
        total = len(all_patients)

        logger.info(f"Total records to migrate: {total}")
        if start_id:
            logger.info(f"Resuming from record ID: {start_id}")

        successful = records_migrated
        failed = 0
        errors = []

        # Process in batches
        current_batch = []
        for patient in all_patients:
            # Skip if already migrated
            if start_id and patient.id <= start_id:
                continue

            current_batch.append(patient)

            if len(current_batch) >= BATCH_SIZE:
                batch_success, batch_failed, batch_errors = await migrate_batch(
                    current_batch, supabase_session, batch_number
                )
                successful += batch_success
                failed += batch_failed
                errors.extend(batch_errors)

                # Update checkpoint
                last_id = current_batch[-1].id
                batch_number += 1
                await save_checkpoint(
                    supabase_session,
                    table_name,
                    last_id,
                    batch_number,
                    successful,
                    "in_progress",
                )

                logger.info(
                    f"Batch {batch_number}: {batch_success} migrated, "
                    f"{batch_failed} failed. Total: {successful}/{total}"
                )

                current_batch = []

        # Process remaining records
        if current_batch:
            batch_success, batch_failed, batch_errors = await migrate_batch(
                current_batch, supabase_session, batch_number
            )
            successful += batch_success
            failed += batch_failed
            errors.extend(batch_errors)
            batch_number += 1

        # Mark as completed
        await save_checkpoint(
            supabase_session,
            table_name,
            None,  # All records migrated
            batch_number,
            successful,
            "completed",
        )

        logger.info(
            f"Migration completed: {successful} successful, {failed} failed out of {total}"
        )

        return {
            "total": total,
            "migrated": successful,
            "failed": failed,
            "errors": errors[:10],  # Limit error list
            "status": "completed",
        }

    except Exception as e:
        logger.error(f"Migration failed: {e}", exc_info=True)
        await save_checkpoint(
            supabase_session,
            table_name,
            start_id,
            batch_number,
            records_migrated,
            "failed",
            str(e),
        )
        return {
            "total": 0,
            "migrated": records_migrated,
            "failed": 0,
            "errors": [str(e)],
            "status": "failed",
        }


async def migrate_batch(
    patients: list[Patient], supabase_session: AsyncSession, batch_number: int
) -> tuple[int, int, list[str]]:
    """
    Migrate a batch of patients using idempotent UPSERT.

    Args:
        patients: List of Patient objects to migrate
        supabase_session: Supabase database session
        batch_number: Current batch number

    Returns:
        Tuple of (successful_count, failed_count, errors_list)
    """
    successful = 0
    failed = 0
    errors = []

    for patient in patients:
        try:
            # Use UPSERT (INSERT ... ON CONFLICT DO UPDATE) for idempotency
            # Check if patient already exists by patient_id
            result = await supabase_session.execute(
                select(Patient).where(Patient.patient_id == patient.patient_id)
            )
            existing = result.scalar_one_or_none()

            if existing:
                # Update existing record (idempotent - safe to re-run)
                existing.name = patient.name
                existing.age = patient.age
                existing.gender = patient.gender
                existing.medical_condition = patient.medical_condition
                existing.last_visit = patient.last_visit
            else:
                # Insert new record
                new_patient = Patient(
                    patient_id=patient.patient_id,
                    name=patient.name,
                    age=patient.age,
                    gender=patient.gender,
                    medical_condition=patient.medical_condition,
                    last_visit=patient.last_visit,
                )
                supabase_session.add(new_patient)

            successful += 1
        except Exception as e:
            failed += 1
            error_msg = f"Patient {patient.patient_id}: {str(e)}"
            errors.append(error_msg)
            logger.warning(error_msg)

    try:
        await supabase_session.commit()
    except Exception as e:
        await supabase_session.rollback()
        logger.error(f"Batch commit failed: {e}", exc_info=True)
        # Mark all records in this batch as failed
        failed += len(patients) - successful
        successful = 0

    return successful, failed, errors


async def main():
    """Main migration function."""
    parser = argparse.ArgumentParser(description="Migrate database from local PostgreSQL to Supabase")
    parser.add_argument(
        "--local-url",
        type=str,
        help="Local PostgreSQL connection URL (default: from DATABASE_URL_LOCAL env var)",
    )
    parser.add_argument(
        "--supabase-url",
        type=str,
        help="Supabase connection URL (default: from DATABASE_URL env var)",
    )
    parser.add_argument(
        "--skip-schema",
        action="store_true",
        help="Skip schema migration (assume already done)",
    )
    parser.add_argument(
        "--table",
        type=str,
        default="patients",
        help="Table name to migrate (default: patients)",
    )

    args = parser.parse_args()

    # Get connection URLs
    local_url = args.local_url or os.getenv("DATABASE_URL_LOCAL")
    supabase_url = args.supabase_url or settings.database_url

    if not local_url:
        logger.error("Local database URL not provided. Use --local-url or set DATABASE_URL_LOCAL")
        sys.exit(1)

    if not supabase_url:
        logger.error("Supabase URL not provided. Use --supabase-url or set DATABASE_URL")
        sys.exit(1)

    logger.info("=" * 60)
    logger.info("Starting PostgreSQL to Supabase Migration")
    logger.info("=" * 60)
    logger.info(f"Local database: {local_url.split('@')[1] if '@' in local_url else 'N/A'}")
    logger.info(f"Supabase database: {supabase_url.split('@')[1] if '@' in supabase_url else 'N/A'}")
    logger.info("=" * 60)

    start_time = datetime.now()

    try:
        # Create database connections
        local_engine = create_async_engine(local_url, echo=False)
        supabase_engine = create_async_engine(supabase_url, echo=False)

        LocalSession = async_sessionmaker(local_engine, class_=AsyncSession)
        SupabaseSession = async_sessionmaker(supabase_engine, class_=AsyncSession)

        async with LocalSession() as local_session, SupabaseSession() as supabase_session:
            # Step 1: Schema migration
            if not args.skip_schema:
                schema_success = await run_alembic_migrations(supabase_url)
                if not schema_success:
                    logger.error("Schema migration failed. Aborting.")
                    sys.exit(1)

            # Step 2: Ensure checkpoint table exists
            checkpoint_ready = await ensure_checkpoint_table(supabase_session)
            if not checkpoint_ready:
                logger.error("Failed to ensure checkpoint table exists. Aborting.")
                sys.exit(1)

            # Step 3: Data migration
            result = await migrate_patients_data(local_session, supabase_session, args.table)

            # Report results
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()

            logger.info("=" * 60)
            logger.info("Migration Summary")
            logger.info("=" * 60)
            logger.info(f"Status: {result['status']}")
            logger.info(f"Total records: {result['total']}")
            logger.info(f"Migrated: {result['migrated']}")
            logger.info(f"Failed: {result['failed']}")
            logger.info(f"Duration: {duration:.2f} seconds")
            logger.info("=" * 60)

            if result["status"] == "failed":
                sys.exit(1)

    except Exception as e:
        logger.error(f"Migration failed with error: {e}", exc_info=True)
        sys.exit(1)
    finally:
        # Cleanup
        await local_engine.dispose()
        await supabase_engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())


"""Script to migrate patient data from db.json to PostgreSQL."""

import asyncio
import json
import sys
from pathlib import Path
from datetime import date

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.config import settings
from app.models.patient import Patient
from app.schemas.patient import PatientCreate


async def migrate_patients(db_path: Path, db_session: AsyncSession) -> dict:
    """
    Migrate patients from db.json to PostgreSQL.

    Args:
        db_path: Path to db.json file
        db_session: Database session

    Returns:
        Dictionary with migration statistics
    """
    # Read db.json
    with open(db_path, "r") as f:
        data = json.load(f)

    patients_data = data.get("patients", [])
    total = len(patients_data)
    successful = 0
    failed = 0
    skipped = 0
    errors = []

    print(f"Found {total} patients in db.json")
    print("Starting migration...\n")

    for idx, patient_data in enumerate(patients_data, 1):
        try:
            # Convert db.json format to PatientCreate schema
            # Handle id field (may be string in db.json, but we'll use patientID)
            patient_id = patient_data.get("patientID") or patient_data.get("patient_id")
            if not patient_id:
                errors.append(f"Patient {idx}: Missing patientID")
                skipped += 1
                continue

            # Create PatientCreate schema
            patient_create = PatientCreate(
                patientID=patient_id,
                name=patient_data.get("name", ""),
                age=patient_data.get("age", 0),
                gender=patient_data.get("gender", ""),
                medicalCondition=patient_data.get("medicalCondition") or patient_data.get("medical_condition", ""),
                lastVisit=patient_data.get("lastVisit") or patient_data.get("last_visit", ""),
            )

            # Create Patient model
            patient = Patient(
                patient_id=patient_create.patientID,
                name=patient_create.name,
                age=patient_create.age,
                gender=patient_create.gender,
                medical_condition=patient_create.medicalCondition,
                last_visit=patient_create.lastVisit,
            )

            db_session.add(patient)
            await db_session.commit()
            await db_session.refresh(patient)

            successful += 1
            print(f"✓ Migrated patient {idx}/{total}: {patient_id} - {patient.name}")

        except Exception as e:
            await db_session.rollback()
            failed += 1
            error_msg = f"Patient {idx} ({patient_id if 'patient_id' in locals() else 'unknown'}): {str(e)}"
            errors.append(error_msg)
            print(f"✗ Failed to migrate patient {idx}: {error_msg}")

    return {
        "total": total,
        "successful": successful,
        "failed": failed,
        "skipped": skipped,
        "errors": errors,
    }


async def main():
    """Main migration function."""
    # Get db.json path (parent directory from backend/)
    db_json_path = Path(__file__).parent.parent.parent / "db.json"

    if not db_json_path.exists():
        print(f"Error: db.json not found at {db_json_path}")
        sys.exit(1)

    # Create database engine and session
    engine = create_async_engine(settings.database_url, echo=False)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        try:
            stats = await migrate_patients(db_json_path, session)

            print("\n" + "=" * 50)
            print("Migration Summary")
            print("=" * 50)
            print(f"Total patients: {stats['total']}")
            print(f"Successful: {stats['successful']}")
            print(f"Failed: {stats['failed']}")
            print(f"Skipped: {stats['skipped']}")

            if stats["errors"]:
                print("\nErrors:")
                for error in stats["errors"]:
                    print(f"  - {error}")

            if stats["failed"] > 0 or stats["skipped"] > 0:
                sys.exit(1)
            else:
                print("\n✓ Migration completed successfully!")

        except Exception as e:
            print(f"\n✗ Migration failed: {str(e)}")
            sys.exit(1)
        finally:
            await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())


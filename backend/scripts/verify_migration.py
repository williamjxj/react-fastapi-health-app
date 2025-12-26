"""Script to verify data migration from local PostgreSQL to Supabase.

This script compares data between local and Supabase databases to ensure
migration was successful and no data was lost or corrupted.

Verification includes:
1. Record count comparison
2. Sample record field-by-field comparison
3. Schema verification (tables, indexes, constraints)

Usage:
    python scripts/verify_migration.py [options]

Options:
    --local-url URL       Local PostgreSQL connection URL
    --supabase-url URL    Supabase connection URL
    --table NAME          Table name to verify (default: patients)
    --sample-size N       Number of records to sample (default: 100)
    --output FILE         Save report to file

Environment Variables:
    DATABASE_URL_LOCAL    Local PostgreSQL connection URL
    DATABASE_URL          Supabase connection URL (used if --supabase-url not provided)

Examples:
    # Basic verification
    python scripts/verify_migration.py

    # With custom sample size
    python scripts/verify_migration.py --sample-size 200

    # Save report to file
    python scripts/verify_migration.py --output report.txt
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

from sqlalchemy import text, select, func
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.models.patient import Patient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("verification.log"),
    ],
)
logger = logging.getLogger(__name__)

# Verification configuration
SAMPLE_SIZE = 100  # Number of random records to compare in detail


async def compare_record_counts(
    local_session: AsyncSession, supabase_session: AsyncSession, table_name: str
) -> dict:
    """
    Compare record counts between local and Supabase databases.

    Args:
        local_session: Local database session
        supabase_session: Supabase database session
        table_name: Name of the table to compare

    Returns:
        Dictionary with count comparison results
    """
    logger.info(f"Comparing record counts for {table_name}...")

    try:
        # Get local count
        local_result = await local_session.execute(
            select(func.count()).select_from(Patient)
        )
        local_count = local_result.scalar()

        # Get Supabase count
        supabase_result = await supabase_session.execute(
            select(func.count()).select_from(Patient)
        )
        supabase_count = supabase_result.scalar()

        match = local_count == supabase_count

        logger.info(f"Local count: {local_count}")
        logger.info(f"Supabase count: {supabase_count}")
        logger.info(f"Counts match: {match}")

        return {
            "table_name": table_name,
            "local_count": local_count,
            "supabase_count": supabase_count,
            "match": match,
            "difference": abs(local_count - supabase_count),
        }

    except Exception as e:
        logger.error(f"Error comparing record counts: {e}", exc_info=True)
        return {
            "table_name": table_name,
            "local_count": None,
            "supabase_count": None,
            "match": False,
            "error": str(e),
        }


async def compare_sample_records(
    local_session: AsyncSession, supabase_session: AsyncSession, sample_size: int = SAMPLE_SIZE
) -> dict:
    """
    Compare a random sample of records between local and Supabase.

    Args:
        local_session: Local database session
        supabase_session: Supabase database session
        sample_size: Number of records to sample

    Returns:
        Dictionary with sample comparison results
    """
    logger.info(f"Comparing sample of {sample_size} records...")

    try:
        # Get random sample from local
        local_result = await local_session.execute(
            select(Patient).order_by(func.random()).limit(sample_size)
        )
        local_patients = local_result.scalars().all()

        if not local_patients:
            logger.warning("No records found in local database")
            return {
                "sample_size": 0,
                "matched": 0,
                "mismatched": 0,
                "missing": 0,
                "errors": [],
            }

        matched = 0
        mismatched = 0
        missing = 0
        errors = []

        for local_patient in local_patients:
            try:
                # Find corresponding record in Supabase by patient_id
                supabase_result = await supabase_session.execute(
                    select(Patient).where(Patient.patient_id == local_patient.patient_id)
                )
                supabase_patient = supabase_result.scalar_one_or_none()

                if not supabase_patient:
                    missing += 1
                    errors.append(f"Patient {local_patient.patient_id}: Missing in Supabase")
                    continue

                # Compare all fields
                fields_match = (
                    local_patient.name == supabase_patient.name
                    and local_patient.age == supabase_patient.age
                    and local_patient.gender == supabase_patient.gender
                    and local_patient.medical_condition == supabase_patient.medical_condition
                    and local_patient.last_visit == supabase_patient.last_visit
                )

                if fields_match:
                    matched += 1
                else:
                    mismatched += 1
                    mismatches = []
                    if local_patient.name != supabase_patient.name:
                        mismatches.append("name")
                    if local_patient.age != supabase_patient.age:
                        mismatches.append("age")
                    if local_patient.gender != supabase_patient.gender:
                        mismatches.append("gender")
                    if local_patient.medical_condition != supabase_patient.medical_condition:
                        mismatches.append("medical_condition")
                    if local_patient.last_visit != supabase_patient.last_visit:
                        mismatches.append("last_visit")
                    errors.append(
                        f"Patient {local_patient.patient_id}: Mismatched fields: {', '.join(mismatches)}"
                    )

            except Exception as e:
                mismatched += 1
                errors.append(f"Patient {local_patient.patient_id}: Error comparing - {str(e)}")

        logger.info(f"Sample comparison: {matched} matched, {mismatched} mismatched, {missing} missing")

        return {
            "sample_size": len(local_patients),
            "matched": matched,
            "mismatched": mismatched,
            "missing": missing,
            "errors": errors[:20],  # Limit error list
        }

    except Exception as e:
        logger.error(f"Error comparing sample records: {e}", exc_info=True)
        return {
            "sample_size": 0,
            "matched": 0,
            "mismatched": 0,
            "missing": 0,
            "errors": [str(e)],
        }


async def verify_schema(
    local_session: AsyncSession, supabase_session: AsyncSession, table_name: str
) -> dict:
    """
    Verify schema elements (tables, indexes, constraints) exist in Supabase.

    Args:
        local_session: Local database session
        supabase_session: Supabase database session
        table_name: Name of the table to verify

    Returns:
        Dictionary with schema verification results
    """
    logger.info(f"Verifying schema for {table_name}...")

    try:
        # Check if table exists in Supabase
        supabase_result = await supabase_session.execute(
            text(
                """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = :table_name
                )
                """
            ),
            {"table_name": table_name},
        )
        table_exists = supabase_result.scalar()

        # Check indexes
        indexes_result = await supabase_session.execute(
            text(
                """
                SELECT indexname 
                FROM pg_indexes 
                WHERE tablename = :table_name
                """
            ),
            {"table_name": table_name},
        )
        indexes = [row[0] for row in indexes_result.fetchall()]

        # Check constraints
        constraints_result = await supabase_session.execute(
            text(
                """
                SELECT constraint_name, constraint_type
                FROM information_schema.table_constraints
                WHERE table_name = :table_name
                """
            ),
            {"table_name": table_name},
        )
        constraints = [
            {"name": row[0], "type": row[1]} for row in constraints_result.fetchall()
        ]

        logger.info(f"Table exists: {table_exists}")
        logger.info(f"Indexes found: {len(indexes)}")
        logger.info(f"Constraints found: {len(constraints)}")

        return {
            "table_name": table_name,
            "table_exists": table_exists,
            "indexes": indexes,
            "index_count": len(indexes),
            "constraints": constraints,
            "constraint_count": len(constraints),
        }

    except Exception as e:
        logger.error(f"Error verifying schema: {e}", exc_info=True)
        return {
            "table_name": table_name,
            "table_exists": False,
            "error": str(e),
        }


async def generate_verification_report(
    count_result: dict, sample_result: dict, schema_result: dict
) -> str:
    """
    Generate a human-readable verification report.

    Args:
        count_result: Record count comparison results
        sample_result: Sample record comparison results
        schema_result: Schema verification results

    Returns:
        Formatted report string
    """
    report = []
    report.append("=" * 60)
    report.append("Migration Verification Report")
    report.append("=" * 60)
    report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("")

    # Record count section
    report.append("Record Count Comparison")
    report.append("-" * 60)
    if count_result.get("error"):
        report.append(f"Error: {count_result['error']}")
    else:
        report.append(f"Table: {count_result['table_name']}")
        report.append(f"Local count: {count_result['local_count']}")
        report.append(f"Supabase count: {count_result['supabase_count']}")
        report.append(f"Match: {'✓ YES' if count_result['match'] else '✗ NO'}")
        if not count_result["match"]:
            report.append(f"Difference: {count_result['difference']} records")
    report.append("")

    # Sample comparison section
    report.append("Sample Record Comparison")
    report.append("-" * 60)
    report.append(f"Sample size: {sample_result['sample_size']}")
    report.append(f"Matched: {sample_result['matched']}")
    report.append(f"Mismatched: {sample_result['mismatched']}")
    report.append(f"Missing: {sample_result['missing']}")
    if sample_result.get("errors"):
        report.append(f"\nErrors found ({len(sample_result['errors'])}):")
        for error in sample_result["errors"][:10]:  # Show first 10 errors
            report.append(f"  - {error}")
    report.append("")

    # Schema verification section
    report.append("Schema Verification")
    report.append("-" * 60)
    if schema_result.get("error"):
        report.append(f"Error: {schema_result['error']}")
    else:
        report.append(f"Table exists: {'✓ YES' if schema_result['table_exists'] else '✗ NO'}")
        report.append(f"Indexes: {schema_result.get('index_count', 0)}")
        report.append(f"Constraints: {schema_result.get('constraint_count', 0)}")
    report.append("")

    # Summary
    report.append("Summary")
    report.append("-" * 60)
    all_checks_passed = (
        count_result.get("match", False)
        and sample_result.get("mismatched", 0) == 0
        and sample_result.get("missing", 0) == 0
        and schema_result.get("table_exists", False)
    )
    report.append(f"Overall status: {'✓ PASS' if all_checks_passed else '✗ FAIL'}")
    report.append("=" * 60)

    return "\n".join(report)


async def main():
    """Main verification function."""
    parser = argparse.ArgumentParser(
        description="Verify data migration from local PostgreSQL to Supabase"
    )
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
        "--table",
        type=str,
        default="patients",
        help="Table name to verify (default: patients)",
    )
    parser.add_argument(
        "--sample-size",
        type=int,
        default=SAMPLE_SIZE,
        help=f"Number of records to sample for detailed comparison (default: {SAMPLE_SIZE})",
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output file for verification report (default: print to stdout)",
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
    logger.info("Starting Migration Verification")
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
            # Step 1: Compare record counts
            count_result = await compare_record_counts(
                local_session, supabase_session, args.table
            )

            # Step 2: Compare sample records
            sample_result = await compare_sample_records(
                local_session, supabase_session, args.sample_size
            )

            # Step 3: Verify schema
            schema_result = await verify_schema(
                local_session, supabase_session, args.table
            )

            # Generate report
            report = await generate_verification_report(
                count_result, sample_result, schema_result
            )

            # Output report
            if args.output:
                with open(args.output, "w") as f:
                    f.write(report)
                logger.info(f"Report saved to {args.output}")
            else:
                print("\n" + report)

            # Log summary
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()

            logger.info("=" * 60)
            logger.info("Verification Summary")
            logger.info("=" * 60)
            logger.info(f"Duration: {duration:.2f} seconds")
            logger.info("=" * 60)

            # Exit with error code if verification failed
            all_passed = (
                count_result.get("match", False)
                and sample_result.get("mismatched", 0) == 0
                and sample_result.get("missing", 0) == 0
                and schema_result.get("table_exists", False)
            )

            if not all_passed:
                logger.error("Verification failed - see report for details")
                sys.exit(1)
            else:
                logger.info("Verification passed - all checks successful")

    except Exception as e:
        logger.error(f"Verification failed with error: {e}", exc_info=True)
        sys.exit(1)
    finally:
        # Cleanup
        await local_engine.dispose()
        await supabase_engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())


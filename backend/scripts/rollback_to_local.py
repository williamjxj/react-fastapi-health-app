"""Script to rollback from Supabase to local PostgreSQL database.

This script helps revert the application connection back to local database
during the verification period if issues are encountered.
"""

import argparse
import logging
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def check_current_database():
    """Check which database is currently configured."""
    current_url = settings.database_url
    is_supabase = "supabase" in current_url.lower() or "supabase.co" in current_url
    is_local = "localhost" in current_url or "127.0.0.1" in current_url

    return {
        "is_supabase": is_supabase,
        "is_local": is_local,
        "url_preview": current_url[:50] + "..." if len(current_url) > 50 else current_url,
    }


def generate_rollback_instructions(local_url: str):
    """Generate rollback instructions."""
    instructions = []
    instructions.append("=" * 60)
    instructions.append("Rollback to Local Database")
    instructions.append("=" * 60)
    instructions.append("")
    instructions.append("To rollback to local PostgreSQL database:")
    instructions.append("")
    instructions.append("1. Update .env file:")
    instructions.append(f"   DATABASE_URL={local_url}")
    instructions.append("")
    instructions.append("2. Restart the application:")
    instructions.append("   # Stop the current application")
    instructions.append("   # Start with: uvicorn app.main:app --reload")
    instructions.append("")
    instructions.append("3. Verify connection:")
    instructions.append("   curl http://localhost:8000/health")
    instructions.append("")
    instructions.append("4. Test API endpoints:")
    instructions.append("   curl http://localhost:8000/patients")
    instructions.append("")
    instructions.append("=" * 60)
    instructions.append("")
    instructions.append("Note: This rollback only changes the connection.")
    instructions.append("Data in Supabase remains unchanged.")
    instructions.append("You can switch back to Supabase by updating DATABASE_URL again.")

    return "\n".join(instructions)


def main():
    """Main function."""
    parser = argparse.ArgumentParser(
        description="Rollback from Supabase to local PostgreSQL database"
    )
    parser.add_argument(
        "--local-url",
        type=str,
        help="Local PostgreSQL connection URL (default: from DATABASE_URL_LOCAL env var)",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check current database configuration",
    )
    parser.add_argument(
        "--instructions",
        action="store_true",
        help="Show rollback instructions",
    )

    args = parser.parse_args()

    if args.check:
        current = check_current_database()
        print("=" * 60)
        print("Current Database Configuration")
        print("=" * 60)
        print(f"Database Type: {'Supabase' if current['is_supabase'] else 'Local' if current['is_local'] else 'Unknown'}")
        print(f"Connection URL: {current['url_preview']}")
        print("=" * 60)
        return

    # Get local URL
    local_url = args.local_url or os.getenv("DATABASE_URL_LOCAL")

    if not local_url:
        logger.error("Local database URL not provided. Use --local-url or set DATABASE_URL_LOCAL")
        logger.info("Example: postgresql+psycopg://postgres:password@localhost:5432/health_management")
        sys.exit(1)

    if args.instructions:
        print(generate_rollback_instructions(local_url))
        return

    # Check current configuration
    current = check_current_database()

    if current["is_local"]:
        logger.info("Application is already using local database. No rollback needed.")
        return

    if not current["is_supabase"]:
        logger.warning("Current database type is unclear. Proceed with caution.")

    # Show instructions
    print(generate_rollback_instructions(local_url))
    print("")
    logger.info("To complete rollback, update .env file and restart the application.")


if __name__ == "__main__":
    main()


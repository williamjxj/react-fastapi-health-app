"""Utility script to switch between local and Supabase databases.

This script helps developers switch database connections by updating
environment variables or providing connection string templates.
"""

import argparse
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings


def show_current_config():
    """Display current database configuration."""
    print("=" * 60)
    print("Current Database Configuration")
    print("=" * 60)
    print(f"Database URL: {settings.database_url[:50]}..." if len(settings.database_url) > 50 else f"Database URL: {settings.database_url}")
    print(f"Environment: {settings.environment}")
    print(f"DB Backend: {settings.db_backend}")
    
    # Check if Supabase
    is_supabase = "supabase" in settings.database_url.lower() or "supabase.co" in settings.database_url
    print(f"Database Type: {'Supabase' if is_supabase else 'Local PostgreSQL'}")
    
    if is_supabase:
        if ":6543" in settings.database_url:
            print("Connection Type: Pooler (recommended for application)")
        elif ":5432" in settings.database_url:
            print("Connection Type: Direct (for migrations)")
    
    print("=" * 60)


def generate_connection_string_template():
    """Generate connection string templates."""
    print("\nConnection String Templates:")
    print("-" * 60)
    print("\n1. Supabase Connection Pooler (for application):")
    print("   postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require")
    print("\n2. Supabase Direct Connection (for migrations):")
    print("   postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require")
    print("\n3. Local PostgreSQL:")
    print("   postgresql+psycopg://postgres:password@localhost:5432/health_management")
    print("-" * 60)


def main():
    """Main function."""
    parser = argparse.ArgumentParser(
        description="Switch between local and Supabase database connections"
    )
    parser.add_argument(
        "--show",
        action="store_true",
        help="Show current database configuration",
    )
    parser.add_argument(
        "--templates",
        action="store_true",
        help="Show connection string templates",
    )

    args = parser.parse_args()

    if args.show:
        show_current_config()
    elif args.templates:
        generate_connection_string_template()
    else:
        # Default: show both
        show_current_config()
        generate_connection_string_template()
        print("\nTo switch databases:")
        print("1. Update DATABASE_URL in .env file")
        print("2. Restart the application")
        print("\nFor Supabase:")
        print("- Use port 6543 for application (connection pooler)")
        print("- Use port 5432 for migrations (direct connection)")
        print("- Always include ?sslmode=require for SSL/TLS encryption")


if __name__ == "__main__":
    main()


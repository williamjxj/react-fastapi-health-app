"""Test Supabase database connection.

This script tests the connection to Supabase using the configured DATABASE_URL.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.config import settings


async def test_connection():
    """Test database connection."""
    print("=" * 60)
    print("Testing Supabase Connection")
    print("=" * 60)
    print()
    print(f"Connection URL: {settings.database_url[:50]}..." if len(settings.database_url) > 50 else f"Connection URL: {settings.database_url}")
    print()
    
    # Check if Supabase
    is_supabase = "supabase" in settings.database_url.lower() or "supabase.co" in settings.database_url
    if not is_supabase:
        print("⚠️  Warning: Connection string doesn't appear to be Supabase")
        print()
    
    # Check SSL requirement
    has_ssl = "sslmode=require" in settings.database_url
    if is_supabase and not has_ssl:
        print("⚠️  Warning: Supabase connection should include ?sslmode=require")
        print()
    
    try:
        # Create engine
        engine = create_async_engine(
            settings.database_url,
            echo=False,
            pool_size=1,
            max_overflow=0,
        )
        
        print("Attempting to connect...")
        
        # Test connection
        async with engine.begin() as conn:
            # Test basic query
            result = await conn.execute(text("SELECT version(), current_database(), current_user"))
            row = result.fetchone()
            
            print("✓ Connection successful!")
            print()
            print("Database Information:")
            print(f"  Database: {row[1]}")
            print(f"  User: {row[2]}")
            print(f"  Version: {row[0][:50]}...")
            print()
            
            # Test if tables exist
            tables_result = await conn.execute(
                text(
                    """
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ORDER BY table_name
                    """
                )
            )
            tables = [row[0] for row in tables_result.fetchall()]
            
            if tables:
                print(f"Tables found ({len(tables)}):")
                for table in tables:
                    print(f"  - {table}")
            else:
                print("No tables found in public schema")
                print("  Run: alembic upgrade head")
            print()
        
        await engine.dispose()
        
        print("=" * 60)
        print("Connection test: ✓ PASSED")
        print("=" * 60)
        return True
        
    except Exception as e:
        print("✗ Connection failed!")
        print()
        print(f"Error: {type(e).__name__}: {str(e)}")
        print()
        print("Troubleshooting:")
        print("1. Verify connection string in .env file")
        print("2. Check that password is correct")
        print("3. Ensure ?sslmode=require is included")
        print("4. Verify network connectivity to Supabase")
        print("5. Check Supabase project status")
        print()
        print("=" * 60)
        print("Connection test: ✗ FAILED")
        print("=" * 60)
        return False


if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)


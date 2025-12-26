"""Comprehensive script to fix Supabase connection issues."""

import asyncio
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote, quote, urlunparse, parse_qs, urlencode

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings


def rebuild_connection_string(url: str, new_password: str = None) -> str:
    """
    Rebuild connection string with properly encoded password.
    
    Args:
        url: Original connection string
        new_password: Optional new password to use (will be encoded)
        
    Returns:
        Rebuilt connection string with encoded password
    """
    parsed = urlparse(url)
    
    # Get password (either new one or existing)
    password = new_password if new_password else parsed.password
    
    if not password:
        return url
    
    # Decode existing password if it's encoded
    try:
        decoded = unquote(password)
    except:
        decoded = password
    
    # Encode the password properly for URL
    encoded_password = quote(decoded, safe='')
    
    # Rebuild netloc
    if parsed.username:
        netloc = f"{parsed.username}:{encoded_password}@{parsed.hostname}"
    else:
        netloc = f":{encoded_password}@{parsed.hostname}"
    
    if parsed.port:
        netloc += f":{parsed.port}"
    
    # Rebuild URL
    fixed_url = urlunparse((
        parsed.scheme,
        netloc,
        parsed.path,
        parsed.params,
        parsed.query,
        parsed.fragment
    ))
    
    return fixed_url


async def test_connection(url: str, description: str) -> tuple[bool, str]:
    """
    Test a connection string.
    
    Returns:
        (success: bool, message: str)
    """
    try:
        engine = create_async_engine(
            url,
            echo=False,
            pool_size=1,
            max_overflow=0,
            pool_pre_ping=True,  # Test connection before using
        )
        
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT version(), current_database(), current_user, 1"))
            row = result.fetchone()
            db_name = row[1]
            db_user = row[2]
            
            # Check tables
            tables_result = await conn.execute(
                text("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ORDER BY table_name
                """)
            )
            tables = [row[0] for row in tables_result.fetchall()]
            
            await engine.dispose()
            
            return True, f"✓ {description}\n  Database: {db_name}\n  User: {db_user}\n  Tables: {len(tables)}"
            
    except Exception as e:
        error_type = type(e).__name__
        error_msg = str(e)
        await engine.dispose()
        
        if "password authentication failed" in error_msg.lower():
            return False, f"✗ {description}\n  Error: Password authentication failed\n  → Password is incorrect"
        elif "connection" in error_msg.lower() and "failed" in error_msg.lower():
            return False, f"✗ {description}\n  Error: Connection failed\n  → Check network or Supabase status"
        else:
            return False, f"✗ {description}\n  Error: {error_type}: {error_msg}"


async def main():
    """Main function to test and fix connection."""
    print("=" * 70)
    print("Supabase Connection Diagnostic & Fix Tool")
    print("=" * 70)
    print()
    
    # Analyze current configuration
    print("Current Configuration:")
    print(f"  Environment: {settings.environment}")
    print()
    
    # Test DATABASE_URL
    print("Testing DATABASE_URL (Application - Port 6543)...")
    print("-" * 70)
    success, message = await test_connection(settings.database_url, "DATABASE_URL")
    print(message)
    print()
    
    if not success:
        # Try to fix password encoding
        parsed = urlparse(settings.database_url)
        if parsed.password:
            decoded = unquote(parsed.password)
            # Check if password needs encoding
            special_chars = ['@', '#', '$', '%', '&', '+', '=', '?', '/', ':', ';']
            has_special = any(c in decoded for c in special_chars)
            
            if has_special:
                print("Password contains special characters. Testing with URL-encoded password...")
                print("-" * 70)
                
                # Rebuild with encoded password
                encoded_pwd = quote(decoded, safe='')
                fixed_url = settings.database_url.replace(parsed.password, encoded_pwd)
                
                success2, message2 = await test_connection(fixed_url, "DATABASE_URL (with encoded password)")
                print(message2)
                print()
                
                if success2:
                    print("=" * 70)
                    print("SUCCESS! Update your .env file:")
                    print("=" * 70)
                    print(f"DATABASE_URL={fixed_url}")
                    if settings.database_url_migration:
                        parsed_mig = urlparse(settings.database_url_migration)
                        if parsed_mig.password:
                            decoded_mig = unquote(parsed_mig.password)
                            encoded_mig_pwd = quote(decoded_mig, safe='')
                            fixed_mig_url = settings.database_url_migration.replace(parsed_mig.password, encoded_mig_pwd)
                            print(f"DATABASE_URL_MIGRATION={fixed_mig_url}")
                    print()
                    return True
    
    # Test DATABASE_URL_MIGRATION if it exists
    if settings.database_url_migration:
        print("Testing DATABASE_URL_MIGRATION (Migrations - Port 5432)...")
        print("-" * 70)
        success_mig, message_mig = await test_connection(settings.database_url_migration, "DATABASE_URL_MIGRATION")
        print(message_mig)
        print()
    
    if not success:
        print("=" * 70)
        print("TROUBLESHOOTING STEPS:")
        print("=" * 70)
        print()
        print("1. Verify/Reset Password in Supabase:")
        print("   https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj/settings/database")
        print("   - Click 'Reset database password'")
        print("   - Copy the new password exactly")
        print()
        print("2. If password has special characters, encode it:")
        print("   python scripts/encode_password.py 'your-password-with-special-chars'")
        print()
        print("3. Update .env file with the correct password")
        print()
        print("4. Common special characters that need encoding:")
        print("   @ # $ % & + = ? / : ; < >")
        print()
        return False
    
    print("=" * 70)
    print("✓ All connections successful!")
    print("=" * 70)
    return True


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)


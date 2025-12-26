"""Test and fix Supabase connection with improved error handling and password encoding support."""

import asyncio
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote, quote, urlunparse

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings


def fix_password_encoding(url: str) -> str:
    """
    Fix password encoding in connection string if needed.
    
    Args:
        url: Connection string
        
    Returns:
        Connection string with properly encoded password
    """
    parsed = urlparse(url)
    
    if not parsed.password:
        return url
    
    # Check if password is already URL-encoded
    # If decoding it changes it, it was encoded
    decoded = unquote(parsed.password)
    
    # If password contains special chars that need encoding, encode it
    special_chars = ['@', '#', '$', '%', '&', '+', '=', '?', '/', ':', ';', '<', '>']
    needs_encoding = any(char in decoded for char in special_chars)
    
    if needs_encoding:
        # Re-encode the password properly
        encoded_password = quote(decoded, safe='')
        
        # Reconstruct URL with encoded password
        netloc_parts = []
        if parsed.username:
            netloc_parts.append(parsed.username)
        netloc_parts.append(encoded_password)
        if parsed.hostname:
            netloc_parts.append(parsed.hostname)
        if parsed.port:
            netloc_parts.append(str(parsed.port))
        
        netloc = '@'.join([':'.join(netloc_parts[:2]), ':'.join(netloc_parts[2:])])
        
        fixed_url = urlunparse((
            parsed.scheme,
            netloc,
            parsed.path,
            parsed.params,
            parsed.query,
            parsed.fragment
        ))
        
        return fixed_url
    
    return url


async def test_connection_with_retry():
    """Test connection with automatic password encoding fix."""
    print("=" * 60)
    print("Supabase Connection Test & Fix")
    print("=" * 60)
    print()
    
    original_url = settings.database_url
    print(f"Original URL: {original_url[:50]}..." if len(original_url) > 50 else f"Original URL: {original_url}")
    print()
    
    # Parse and analyze the connection string
    parsed = urlparse(original_url)
    if parsed.password:
        decoded_password = unquote(parsed.password)
        password_preview = decoded_password[:3] + "*" * max(0, len(decoded_password) - 3)
        print(f"Password (decoded): {password_preview} (length: {len(decoded_password)})")
        
        # Check for special characters
        special_chars = ['@', '#', '$', '%', '&', '+', '=', '?', '/', ':', ';', '<', '>']
        found_special = [char for char in special_chars if char in decoded_password]
        if found_special:
            print(f"⚠️  Special characters found: {', '.join(found_special)}")
            print("   These need to be URL-encoded in the connection string")
    print()
    
    # Try original connection string first
    print("Attempt 1: Testing with original connection string...")
    try:
        engine = create_async_engine(
            original_url,
            echo=False,
            pool_size=1,
            max_overflow=0,
        )
        
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT version(), current_database(), current_user"))
            row = result.fetchone()
            print("✓ Connection successful with original URL!")
            print(f"  Database: {row[1]}")
            print(f"  User: {row[2]}")
            await engine.dispose()
            return True
            
    except Exception as e:
        print(f"✗ Connection failed: {type(e).__name__}")
        error_msg = str(e)
        if "password authentication failed" in error_msg.lower():
            print("  → Password authentication error detected")
        await engine.dispose()
    
    # Try with fixed password encoding
    print()
    print("Attempt 2: Testing with URL-encoded password...")
    try:
        fixed_url = fix_password_encoding(original_url)
        
        if fixed_url != original_url:
            print(f"  Fixed URL: {fixed_url[:50]}..." if len(fixed_url) > 50 else f"  Fixed URL: {fixed_url}")
            print()
            
            engine = create_async_engine(
                fixed_url,
                echo=False,
                pool_size=1,
                max_overflow=0,
            )
            
            async with engine.begin() as conn:
                result = await conn.execute(text("SELECT version(), current_database(), current_user"))
                row = result.fetchone()
                print("✓ Connection successful with URL-encoded password!")
                print(f"  Database: {row[1]}")
                print(f"  User: {row[2]}")
                print()
                print("=" * 60)
                print("SUCCESS! Update your .env file with this connection string:")
                print("=" * 60)
                print(f"DATABASE_URL={fixed_url}")
                if settings.database_url_migration:
                    fixed_migration_url = fix_password_encoding(settings.database_url_migration)
                    print(f"DATABASE_URL_MIGRATION={fixed_migration_url}")
                print()
                await engine.dispose()
                return True
        else:
            print("  No encoding fix needed")
            
    except Exception as e:
        print(f"✗ Connection still failed: {type(e).__name__}")
        error_msg = str(e)
        if "password authentication failed" in error_msg.lower():
            print("  → Password is incorrect, not an encoding issue")
            print()
            print("=" * 60)
            print("TROUBLESHOOTING:")
            print("=" * 60)
            print("1. Verify password in Supabase Dashboard:")
            print("   https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj/settings/database")
            print()
            print("2. Reset password if needed:")
            print("   - Click 'Reset database password'")
            print("   - Copy the new password")
            print()
            print("3. If password has special characters, use this script to encode it:")
            print("   python scripts/encode_password.py 'your-password'")
            print()
        await engine.dispose()
    
    print()
    print("=" * 60)
    print("Connection test: ✗ FAILED")
    print("=" * 60)
    return False


if __name__ == "__main__":
    success = asyncio.run(test_connection_with_retry())
    sys.exit(0 if success else 1)


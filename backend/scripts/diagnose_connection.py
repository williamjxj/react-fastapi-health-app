"""Diagnostic script to help troubleshoot Supabase connection issues."""

import asyncio
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings


def analyze_connection_string(url: str, name: str):
    """Analyze connection string and provide diagnostics."""
    print(f"\n{'=' * 60}")
    print(f"Analyzing {name}")
    print(f"{'=' * 60}")
    
    try:
        # Parse the URL
        parsed = urlparse(url)
        
        print(f"Scheme: {parsed.scheme}")
        print(f"Host: {parsed.hostname}")
        print(f"Port: {parsed.port}")
        print(f"Database: {parsed.path.lstrip('/')}")
        print(f"User: {parsed.username}")
        
        # Check password
        if parsed.password:
            password_length = len(parsed.password)
            password_preview = parsed.password[:3] + "*" * (password_length - 3) if password_length > 3 else "*" * password_length
            print(f"Password: {password_preview} (length: {password_length})")
            
            # Check for URL encoding issues
            decoded_password = unquote(parsed.password)
            if decoded_password != parsed.password:
                print(f"⚠️  Password contains URL-encoded characters")
                print(f"   Decoded preview: {decoded_password[:3]}...")
        else:
            print("❌ Password: MISSING")
        
        # Check query parameters
        if parsed.query:
            print(f"Query params: {parsed.query}")
            if "sslmode=require" in parsed.query:
                print("✓ SSL mode: require")
            else:
                print("⚠️  SSL mode: NOT SET (should be 'require' for Supabase)")
        else:
            print("⚠️  Query params: MISSING (should include ?sslmode=require)")
        
        # Check for Supabase-specific patterns
        if "supabase" in parsed.hostname.lower() or "supabase.co" in parsed.hostname.lower():
            print("✓ Supabase hostname detected")
            
            # Check port
            if parsed.port == 6543:
                print("✓ Using connection pooler (port 6543) - good for application")
            elif parsed.port == 5432:
                print("✓ Using direct connection (port 5432) - good for migrations")
            else:
                print(f"⚠️  Unexpected port: {parsed.port} (expected 6543 or 5432)")
        else:
            print("⚠️  Not a Supabase hostname")
        
        # Check for common issues
        issues = []
        if not parsed.password:
            issues.append("Missing password")
        if "sslmode=require" not in parsed.query:
            issues.append("Missing SSL requirement")
        if parsed.scheme not in ["postgresql", "postgresql+psycopg", "postgresql+psycopg2"]:
            issues.append(f"Unexpected scheme: {parsed.scheme}")
        
        if issues:
            print(f"\n⚠️  Issues found:")
            for issue in issues:
                print(f"   - {issue}")
        else:
            print(f"\n✓ Connection string format looks correct")
            
    except Exception as e:
        print(f"❌ Error parsing connection string: {e}")


def main():
    """Main diagnostic function."""
    print("=" * 60)
    print("Supabase Connection Diagnostic Tool")
    print("=" * 60)
    
    print("\nCurrent Configuration:")
    print(f"Environment: {settings.environment}")
    
    # Analyze DATABASE_URL
    if settings.database_url:
        analyze_connection_string(settings.database_url, "DATABASE_URL")
    else:
        print("\n❌ DATABASE_URL is not set")
    
    # Analyze DATABASE_URL_MIGRATION
    if settings.database_url_migration:
        analyze_connection_string(settings.database_url_migration, "DATABASE_URL_MIGRATION")
    else:
        print("\n⚠️  DATABASE_URL_MIGRATION is not set (optional, but recommended for migrations)")
    
    print("\n" + "=" * 60)
    print("Troubleshooting Tips:")
    print("=" * 60)
    print()
    print("If password authentication fails:")
    print("1. Verify password in Supabase Dashboard:")
    print("   https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj/settings/database")
    print()
    print("2. Reset password if needed:")
    print("   - Go to Settings → Database")
    print("   - Click 'Reset database password'")
    print("   - Copy the new password")
    print()
    print("3. URL-encode special characters in password:")
    print("   - Use urllib.parse.quote() if password has special chars")
    print("   - Common special chars: @, #, $, %, &, +, =, ?, /")
    print()
    print("4. Check for whitespace:")
    print("   - Ensure no leading/trailing spaces in password")
    print("   - Check .env file for hidden characters")
    print()
    print("5. Verify connection string format:")
    print("   - Should start with: postgresql+psycopg://")
    print("   - Should include: ?sslmode=require")
    print("   - Password should be between : and @")
    print()
    print("6. Test with Supabase Dashboard:")
    print("   - Try connecting via Supabase SQL Editor")
    print("   - This verifies the password is correct")
    print()


if __name__ == "__main__":
    main()


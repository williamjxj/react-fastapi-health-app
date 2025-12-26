"""Helper script to URL-encode passwords for connection strings."""

import sys
from urllib.parse import quote

def encode_password(password: str) -> str:
    """
    URL-encode a password for use in database connection strings.
    
    Args:
        password: The password to encode
        
    Returns:
        URL-encoded password
    """
    # URL-encode the password, but keep some characters unencoded if needed
    # For PostgreSQL connection strings, we typically encode special chars
    return quote(password, safe='')

def main():
    """Main function to encode password."""
    if len(sys.argv) < 2:
        print("Usage: python encode_password.py <password>")
        print()
        print("Example:")
        print("  python encode_password.py 'my@pass#word'")
        print()
        print("This will output the URL-encoded version to use in connection strings.")
        sys.exit(1)
    
    password = sys.argv[1]
    encoded = encode_password(password)
    
    print("=" * 60)
    print("Password Encoding Helper")
    print("=" * 60)
    print()
    print(f"Original password: {password}")
    print(f"Length: {len(password)}")
    print()
    print(f"URL-encoded password: {encoded}")
    print()
    print("=" * 60)
    print("Usage in .env file:")
    print("=" * 60)
    print()
    print("Replace [PASSWORD] in your connection string with the encoded version above.")
    print()
    print("Example connection string:")
    print(f"  DATABASE_URL=postgresql+psycopg://user:{encoded}@host:6543/db?sslmode=require")
    print()

if __name__ == "__main__":
    main()


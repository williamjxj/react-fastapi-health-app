"""Configuration management using Pydantic BaseSettings."""

from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import field_validator, ValidationInfo
from typing import List, Optional

# Load .env file from backend directory
# This ensures .env is loaded regardless of where the script is run from
backend_dir = Path(__file__).parent.parent
env_file = backend_dir / ".env"
if env_file.exists():
    load_dotenv(env_file)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database configuration
    db_backend: str = "postgresql"
    database_url: str
    database_url_migration: Optional[str] = None  # Optional: for migrations (direct connection, port 5432)

    # Environment
    environment: str = "development"

    # CORS origins (comma-separated string)
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Server port
    port: int = 8000

    @field_validator("database_url", "database_url_migration")
    @classmethod
    def validate_database_url(cls, v: Optional[str], info: ValidationInfo) -> Optional[str]:
        """
        Validate database URL format and SSL requirements for Supabase.

        Args:
            v: Database URL string (or None for optional fields)
            info: Field validation info

        Returns:
            Validated database URL (or None)

        Raises:
            ValueError: If Supabase connection string is missing SSL requirement
        """
        if v is None:
            return v
            
        # Check if this is a Supabase connection string
        is_supabase = "supabase" in v.lower() or "supabase.co" in v
        
        if is_supabase:
            # Supabase requires SSL/TLS encryption (HIPAA compliance)
            if "sslmode=" not in v:
                # Add SSL requirement if not present
                separator = "&" if "?" in v else "?"
                v = f"{v}{separator}sslmode=require"
            elif "sslmode=require" not in v and "sslmode=prefer" not in v:
                # Ensure SSL is required, not disabled
                raise ValueError(
                    "Supabase connection string must include 'sslmode=require' "
                    "for HIPAA compliance. Current URL does not enforce SSL."
                )
            
            # Validate port usage
            field_name = info.field_name if info.field_name else None
            if field_name == "database_url" and ":5432" in v:
                raise ValueError(
                    "Application DATABASE_URL for Supabase should use connection pooler (port 6543), "
                    "not direct connection (port 5432). Use DATABASE_URL_MIGRATION for migrations."
                )
            if field_name == "database_url_migration" and ":6543" in v:
                raise ValueError(
                    "Migration DATABASE_URL_MIGRATION for Supabase should use direct connection (port 5432), "
                    "not connection pooler (port 6543). Use DATABASE_URL for application."
                )
        
        return v

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        """Pydantic config."""

        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()


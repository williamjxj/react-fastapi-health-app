"""Configuration management using Pydantic BaseSettings."""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database configuration
    db_backend: str = "postgresql"
    database_url: str

    # Environment
    environment: str = "development"

    # CORS origins (comma-separated string)
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Server port
    port: int = 8000

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


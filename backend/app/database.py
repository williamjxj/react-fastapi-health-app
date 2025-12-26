"""Database connection and session management using SQLAlchemy async."""

import inspect
import logging
import sys
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.config import settings

logger = logging.getLogger(__name__)

# Determine connection pool settings based on database type
# Supabase connection pooler (port 6543) recommended for application
# Direct connection (port 5432) used for migrations
is_supabase = "supabase" in settings.database_url.lower() or "supabase.co" in settings.database_url
use_pooler = ":6543" in settings.database_url if is_supabase else False

# Connection pool configuration
# For Supabase pooler: use smaller pool, pooler handles connection management
# For direct connections: use standard pool settings
if use_pooler:
    pool_size = 5
    max_overflow = 10
    pool_timeout = 30
    logger.info("Using Supabase connection pooler (port 6543)")
else:
    pool_size = 5
    max_overflow = 10
    pool_timeout = 30

# Check if we're being imported by Alembic (which needs sync connections)
# Check the call stack to see if we're being imported from alembic/env.py
_is_alembic_context = False
try:
    frame = inspect.currentframe()
    while frame:
        filename = frame.f_code.co_filename
        if 'alembic' in filename and 'env.py' in filename:
            _is_alembic_context = True
            break
        frame = frame.f_back
except Exception:
    # If inspection fails, default to False (create engine)
    _is_alembic_context = False

# Create async engine with SSL support for Supabase
# Only skip creation if we're actually in Alembic's env.py context
# (Alembic uses its own sync engine for migrations)
connect_args = {}
if is_supabase and "sslmode=require" not in settings.database_url:
    # Ensure SSL is required for Supabase (HIPAA compliance)
    separator = "&" if "?" in settings.database_url else "?"
    settings.database_url = f"{settings.database_url}{separator}sslmode=require"
    logger.info("Added SSL requirement to Supabase connection string")

if not _is_alembic_context:
    # For async engines, don't specify poolclass - SQLAlchemy will use the appropriate async pool
    engine = create_async_engine(
        settings.database_url,
        echo=settings.environment == "development",
        pool_size=pool_size,
        max_overflow=max_overflow,
        pool_timeout=pool_timeout,
        connect_args=connect_args,
    )

    # Create async session factory
    AsyncSessionLocal = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
else:
    # Set to None when in Alembic context (Alembic uses its own sync engine)
    engine = None
    AsyncSessionLocal = None

# Base class for models
Base = declarative_base()


async def get_db() -> AsyncSession:
    """
    Dependency function for FastAPI to get database session.

    Yields:
        AsyncSession: Database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def reconnect_database():
    """
    Reconnect to database with new connection string.
    
    This function can be called to reconnect after changing DATABASE_URL.
    Note: This requires restarting the application for full effect.
    
    Returns:
        True if reconnection successful, False otherwise
    """
    global engine, AsyncSessionLocal
    
    logger.info("Reconnecting to database...")
    try:
        # Dispose existing engine
        await engine.dispose()
        
        # Re-determine connection settings
        is_supabase_new = "supabase" in settings.database_url.lower() or "supabase.co" in settings.database_url
        use_pooler_new = ":6543" in settings.database_url if is_supabase_new else False
        
        if use_pooler_new:
            pool_size_new = 5
            max_overflow_new = 10
            pool_timeout_new = 30
        else:
            pool_size_new = 5
            max_overflow_new = 10
            pool_timeout_new = 30
        
        connect_args_new = {}
        if is_supabase_new and "sslmode=require" not in settings.database_url:
            separator = "&" if "?" in settings.database_url else "?"
            settings.database_url = f"{settings.database_url}{separator}sslmode=require"
        
        # Recreate engine with updated settings
        # For async engines, don't specify poolclass - SQLAlchemy will use the appropriate async pool
        engine = create_async_engine(
            settings.database_url,
            echo=settings.environment == "development",
            pool_size=pool_size_new,
            max_overflow=max_overflow_new,
            pool_timeout=pool_timeout_new,
            connect_args=connect_args_new,
        )
        
        # Recreate session factory
        AsyncSessionLocal = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
        
        logger.info("Database reconnected successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to reconnect database: {e}", exc_info=True)
        return False


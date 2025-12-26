"""FastAPI application entry point."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes import patients

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.environment == "development" else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Patient Management API",
    description="FastAPI backend for patient management system",
    version="1.0.0",
)

logger.info(f"Starting Patient Management API in {settings.environment} mode")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router)


async def check_database_connection() -> bool:
    """
    Check database connectivity.

    Returns:
        True if database is connected, False otherwise
    """
    try:
        from app.database import AsyncSessionLocal
        from sqlalchemy import text
        async with AsyncSessionLocal() as session:
            # Test database connection
            result = await session.execute(text("SELECT 1"))
            result.scalar()
            # Check if connected to Supabase
            try:
                db_result = await session.execute(text("SELECT current_database()"))
                db_name = db_result.scalar()
                if "supabase" in settings.database_url.lower():
                    logger.info(f"Connected to Supabase database: {db_name}")
            except Exception:
                pass  # Ignore if query fails
        return True
    except Exception as e:
        logger.warning(f"Database connection check failed: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Verify database connection on startup."""
    connection_ok = await check_database_connection()
    if connection_ok:
        logger.info("Database connection verified successfully")
        # Log connection type
        if "supabase" in settings.database_url.lower():
            logger.info("Connected to Supabase cloud database")
        else:
            logger.info("Connected to local PostgreSQL database")
    else:
        logger.error("Failed to connect to database on startup", exc_info=True)
        raise RuntimeError("Database connection failed on startup")


@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        Health status and database connectivity
    """
    database_connected = await check_database_connection()
    database_status = "connected" if database_connected else "disconnected"

    return {
        "status": "healthy" if database_connected else "degraded",
        "database": database_status,
        "environment": settings.environment,
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Patient Management API",
        "docs": "/docs",
        "health": "/health",
    }


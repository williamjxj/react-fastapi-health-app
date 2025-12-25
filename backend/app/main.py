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


@app.on_event("startup")
async def startup_event():
    """Verify database connection on startup."""
    try:
        from app.database import AsyncSessionLocal
        from sqlalchemy import text
        async with AsyncSessionLocal() as session:
            # Test database connection
            result = await session.execute(text("SELECT 1"))
            result.scalar()
        logger.info("Database connection verified successfully")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}", exc_info=True)
        raise


@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        Health status and database connectivity
    """
    return {
        "status": "healthy",
        "database": "connected",  # TODO: Add actual database connectivity check
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


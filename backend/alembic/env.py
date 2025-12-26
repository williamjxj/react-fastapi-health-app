"""Alembic environment configuration for async SQLAlchemy."""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import Connection

from alembic import context

# Import Base and models for autogenerate
from app.database import Base
from app.models.patient import Patient  # noqa: F401
from app.models.migration_checkpoint import MigrationCheckpoint  # noqa: F401

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set sqlalchemy.url from environment
from app.config import settings

# Use migration connection string if available (direct connection, port 5432)
# Otherwise use application connection string (connection pooler, port 6543)
# For Supabase: migrations should use direct connection (port 5432) for better performance
db_url = settings.database_url_migration if settings.database_url_migration else settings.database_url

# Convert async connection string to sync for Alembic
# Alembic uses synchronous connections for migrations
# Replace postgresql+psycopg:// with postgresql+psycopg2:// for sync operations
# Ensure SSL is required for Supabase connections
sync_url = db_url.replace("postgresql+psycopg://", "postgresql+psycopg2://")
# Ensure SSL mode is set for Supabase (required for HIPAA compliance)
if "sslmode=" not in sync_url and ("supabase" in sync_url.lower() or "supabase.co" in sync_url):
    separator = "&" if "?" in sync_url else "?"
    sync_url = f"{sync_url}{separator}sslmode=require"
config.set_main_option("sqlalchemy.url", sync_url)

# add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()


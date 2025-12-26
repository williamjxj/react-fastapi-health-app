"""Create migration_checkpoints table

Revision ID: 002_create_migration_checkpoints
Revises: 001_create_patients_table
Create Date: 2025-01-27 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002_create_migration_checkpoints'
down_revision: Union[str, None] = '001'  # References revision '001' from 001_create_patients_table.py
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create migration_checkpoints table for tracking migration progress."""
    op.create_table(
        'migration_checkpoints',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('table_name', sa.String(length=255), nullable=False),
        sa.Column('last_record_id', sa.Integer(), nullable=True),
        sa.Column('batch_number', sa.Integer(), nullable=True),
        sa.Column('records_migrated', sa.Integer(), server_default='0', nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint("status IN ('in_progress', 'completed', 'failed')", name='check_status_valid'),
    )
    op.create_index('ix_migration_checkpoints_table_name', 'migration_checkpoints', ['table_name'], unique=True)
    op.create_index('ix_migration_checkpoints_status', 'migration_checkpoints', ['status'], unique=False)


def downgrade() -> None:
    """Drop migration_checkpoints table."""
    op.drop_index('ix_migration_checkpoints_status', table_name='migration_checkpoints')
    op.drop_index('ix_migration_checkpoints_table_name', table_name='migration_checkpoints')
    op.drop_table('migration_checkpoints')


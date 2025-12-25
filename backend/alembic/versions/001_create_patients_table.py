"""Create patients table

Revision ID: 001
Revises: 
Create Date: 2025-01-27

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'patients',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('patient_id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('gender', sa.String(length=20), nullable=False),
        sa.Column('medical_condition', sa.String(length=255), nullable=False),
        sa.Column('last_visit', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('patient_id'),
        sa.CheckConstraint('age > 0', name='check_age_positive')
    )
    op.create_index(op.f('ix_patients_patient_id'), 'patients', ['patient_id'], unique=True)
    op.create_index(op.f('ix_patients_name'), 'patients', ['name'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_patients_name'), table_name='patients')
    op.drop_index(op.f('ix_patients_patient_id'), table_name='patients')
    op.drop_table('patients')

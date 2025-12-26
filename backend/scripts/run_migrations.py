"""Run Alembic migrations - handles local alembic directory conflict."""

import sys
import os
from pathlib import Path

# Change to backend directory
backend_dir = Path(__file__).parent.parent
os.chdir(backend_dir)

# Import alembic from site-packages directly to avoid local directory conflict
alembic_package_path = Path("/Users/william.jiang/Library/Python/3.9/lib/python/site-packages")

# Add site-packages to path before backend
if str(alembic_package_path) not in sys.path:
    sys.path.insert(0, str(alembic_package_path))

# Remove backend from path temporarily to avoid local alembic/ conflict
backend_in_path = [p for p in sys.path if str(backend_dir) == p or str(backend_dir) in p]
for p in backend_in_path:
    if 'site-packages' not in p:  # Don't remove if it's in site-packages
        try:
            sys.path.remove(p)
        except ValueError:
            pass

try:
    # Now import alembic (should get it from site-packages)
    from alembic import config as alembic_config
    from alembic import command as alembic_command
    
    # Add backend back to path for app imports (alembic/env.py needs this)
    sys.path.insert(0, str(backend_dir))
    
    print("=" * 60)
    print("Running Database Migrations")
    print("=" * 60)
    print()
    print("Running: alembic upgrade head")
    print()
    
    # Run migration
    alembic_cfg = alembic_config.Config(str(backend_dir / "alembic.ini"))
    alembic_command.upgrade(alembic_cfg, "head")
    
    print()
    print("=" * 60)
    print("✓ Migrations completed successfully!")
    print("=" * 60)
    sys.exit(0)
    
except ImportError as e:
    print(f"✗ Failed to import alembic: {e}")
    print("  Please ensure alembic is installed: pip install alembic")
    sys.exit(1)
except Exception as e:
    print(f"✗ Migration failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

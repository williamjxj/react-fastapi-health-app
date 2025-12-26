# Backend API - FastAPI + PostgreSQL

FastAPI backend for patient management system, migrated from json-server to PostgreSQL.

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # For development
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   
   # For Supabase migration:
   # cp .env.supabase .env
   # Edit .env and replace [user], [password], [host], [database] with your Supabase credentials
   ```

3. **Initialize database**:
   ```bash
   alembic upgrade head
   ```

4. **Run migrations** (if needed):
   ```bash
   python scripts/migrate_db_json.py
   ```

5. **Start server**:
   ```bash
   # Port is set in .env (default: 8000)
   # On Unix/Mac: uvicorn app.main:app --reload --port ${PORT:-8000}
   # Or simply: uvicorn app.main:app --reload
   # The PORT environment variable will be used if set
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Development

- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Testing

```bash
# Run all tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/unit/test_patient_models.py
```

## Project Structure

```
backend/
├── app/              # FastAPI application
│   ├── models/      # SQLAlchemy models
│   ├── schemas/     # Pydantic schemas
│   ├── api/         # API routes
│   └── services/   # Business logic
├── alembic/         # Database migrations
├── scripts/         # Utility scripts
└── tests/          # Test suite
```

## API Endpoints

- `GET /patients` - List all patients
- `POST /patients` - Create a new patient
- `GET /health` - Health check endpoint

## Supabase Migration

### Prerequisites

1. Supabase project created: **drzmgazvrdoytoemjorj**
2. Dashboard: https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj
3. Obtain connection credentials from Supabase Dashboard > Settings > Database
4. Copy `.env.supabase` to `.env` and fill in your credentials

### Quick Connection Setup

1. **Get connection strings from dashboard**:
   - Go to: https://supabase.com/dashboard/project/drzmgazvrdoytoemjorj/settings/database
   - Copy "Connection pooling" string (port 6543) for application
   - Copy "Connection string" (port 5432) for migrations

2. **Update .env file**:
   ```bash
   cp .env.supabase .env
   # Edit .env and replace [PASSWORD] and [region] with actual values
   ```

3. **Test connection**:
   ```bash
   python scripts/test_supabase_connection.py
   ```

See `docs/supabase-connection-setup.md` for detailed instructions.

### Migration Steps

1. **Update environment variables**:
   ```bash
   cp .env.supabase .env
   # Edit .env with your Supabase credentials
   ```

2. **Run schema migration**:
   ```bash
   alembic upgrade head
   ```

3. **Run data migration**:
   ```bash
   # Set local database URL
   export DATABASE_URL_LOCAL="postgresql+psycopg://postgres:password@localhost:5432/health_management"
   
   # Run migration script
   python scripts/migrate_to_supabase.py
   ```

4. **Verify migration**:
   ```bash
   python scripts/verify_migration.py
   ```

### Connection String Format

**For Application (Connection Pooler - port 6543)**:
```
postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require
```

**For Migrations (Direct Connection - port 5432)**:
```
postgresql+psycopg://[user]:[password]@[host]:5432/[database]?sslmode=require
```

**Important**: 
- Always include `?sslmode=require` for SSL/TLS encryption (HIPAA compliance)
- Use connection pooler (port 6543) for application
- Use direct connection (port 5432) for migrations

### Switch Database Connection

Use the switch script to view current configuration:
```bash
python scripts/switch_database.py --show
python scripts/switch_database.py --templates
```

## Deployment

### Render with Supabase

1. Create new Web Service in Render
2. Connect repository
3. Set "Root Directory" to `backend/`
4. Configure build command: `pip install -r requirements.txt && alembic upgrade head`
5. Configure start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Set environment variables:
   - `DATABASE_URL`: Supabase connection string (pooler: port 6543)
     - Format: `postgresql+psycopg://[user]:[password]@[host]:6543/[database]?sslmode=require`
   - `ENVIRONMENT`: `production`
   - `PORT`: Automatically set by Render
   - `CORS_ORIGINS`: Your frontend domain(s)
7. Deploy

**Note**: Supabase connection string must include `?sslmode=require` for SSL/TLS encryption.

See `docs/003-fastapi-postgresql-deployment.md` for additional deployment details.


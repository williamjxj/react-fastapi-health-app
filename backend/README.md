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

## Deployment

### Render

1. Create new Web Service in Render
2. Connect repository
3. Set "Root Directory" to `backend/`
4. Configure build command: `pip install -r requirements.txt && alembic upgrade head`
5. Configure start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add PostgreSQL database
7. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (provided by Render)
   - `ENVIRONMENT`: `production`
   - `PORT`: Automatically set by Render
8. Deploy

See `docs/003-fastapi-postgresql-deployment.md` for additional deployment details.


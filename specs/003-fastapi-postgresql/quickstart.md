# Quickstart: Backend Migration to FastAPI and PostgreSQL

**Date**: 2025-01-27  
**Feature**: Backend Migration to FastAPI and PostgreSQL

## Prerequisites

- Python 3.11+ installed
- PostgreSQL 17 installed and running locally
- Node.js 18+ (for frontend, if testing integration)
- Git

## Local Development Setup

### 1. Install PostgreSQL 17

**macOS (using Homebrew)**:
```bash
brew install postgresql@17
brew services start postgresql@17
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install postgresql-17
sudo systemctl start postgresql
```

**Windows**: Download from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE health_management;

# Exit psql
\q
```

### 3. Set Up Backend Project

```bash
# Navigate to project root
cd /path/to/demo2

# Create backend directory
mkdir -p backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy alembic pydantic psycopg python-dotenv

# Or create requirements.txt and install:
# pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create `backend/.env` file:

```env
DB_BACKEND=postgresql
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/health_management
ENVIRONMENT=development
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Note**: Update password if different from `password`

### 5. Initialize Database Schema

```bash
cd backend

# Initialize Alembic (if not already done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Create patients table"

# Apply migration
alembic upgrade head
```

### 6. Migrate Data from db.json

```bash
cd backend

# Run migration script
python scripts/migrate_db_json.py
```

This will:
- Read `../db.json` from project root
- Validate all patient records
- Insert into PostgreSQL
- Report migration statistics

### 7. Start FastAPI Server

```bash
cd backend

# Activate virtual environment (if not already active)
source venv/bin/activate

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at: `http://localhost:8000`

### 8. Verify API

**Test GET /patients**:
```bash
curl http://localhost:8000/patients
```

**Test POST /patients**:
```bash
curl -X POST http://localhost:8000/patients \
  -H "Content-Type: application/json" \
  -d '{
    "patientID": "P004",
    "name": "Test Patient",
    "age": 30,
    "gender": "Male",
    "medicalCondition": "Test Condition",
    "lastVisit": "2025-01-27"
  }'
```

**View API Documentation**:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 9. Update Frontend Configuration

Update frontend `.env` or environment variable:

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Note**: Frontend code should work without changes if API compatibility is maintained.

## Testing

### Run Backend Tests

```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

### Test API Compatibility

```bash
cd backend

# Run contract tests
pytest tests/contract/test_api_compatibility.py
```

## Production Deployment

### Deploy Backend to Render

1. **Create Render Account**: https://render.com
2. **Create PostgreSQL Database**:
   - New → PostgreSQL
   - Name: `health-management-db`
   - Region: Choose closest to users
   - Note the connection string

3. **Create Web Service**:
   - New → Web Service
   - Connect GitHub repository
   - Settings:
     - **Name**: `health-management-backend`
     - **Environment**: Python 3
     - **Build Command**: `cd backend && pip install -r requirements.txt`
     - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     - **Root Directory**: `backend`

4. **Configure Environment Variables**:
   - `DATABASE_URL`: From PostgreSQL service
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: Frontend domain (e.g., `https://your-app.vercel.app`)

5. **Deploy**:
   - Render will auto-deploy on git push
   - Or manually deploy from dashboard

### Deploy Frontend to Vercel/Cloudflare

**Vercel**:
1. Connect GitHub repository
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable:
   - `VITE_API_BASE_URL`: Backend URL from Render

**Cloudflare Pages**:
1. Connect GitHub repository
2. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
3. Add environment variable:
   - `VITE_API_BASE_URL`: Backend URL from Render

## Troubleshooting

### Database Connection Issues

**Error**: `could not connect to server`
- Verify PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check connection string in `.env`
- Verify database exists: `psql -U postgres -l`

### Migration Errors

**Error**: `relation "patients" does not exist`
- Run Alembic migrations: `alembic upgrade head`

**Error**: `duplicate key value violates unique constraint`
- Patient ID already exists, check for duplicates in db.json

### API Not Responding

**Error**: `Connection refused`
- Verify FastAPI server is running
- Check port (default 8000)
- Check firewall settings

### CORS Errors (Frontend)

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- Add frontend domain to `CORS_ORIGINS` in backend `.env`
- Restart FastAPI server

## Next Steps

1. Review [data-model.md](./data-model.md) for database schema details
2. Review [research.md](./research.md) for technology decisions
3. Review [contracts/README.md](./contracts/README.md) for API specifications
4. See [tasks.md](./tasks.md) for implementation tasks (after `/speckit.tasks`)

## Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- SQLAlchemy Docs: https://docs.sqlalchemy.org/
- Render Docs: https://render.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/


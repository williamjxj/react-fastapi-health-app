# Quickstart Guide: Project Structure Reorganization

**Feature**: 004-restructure-project  
**Date**: 2025-01-27

This guide provides setup instructions for the restructured project with three independent services.

## Prerequisites

- **Node.js**: 18+ (LTS version recommended)
- **Python**: 3.12+
- **PostgreSQL**: 17+ (for backend service)
- **npm**: 9+ (comes with Node.js)
- **pip**: Latest version

Verify installations:
```bash
node --version   # Should be 18.x or higher
npm --version    # Should be 9.x or higher
python --version # Should be 3.12.x or higher
psql --version   # Should be 17.x or higher
```

## Project Structure Overview

After restructuring, the project has the following structure:

```
project-root/
├── frontend/          # React + Vite application (port 3000)
├── backend/           # FastAPI + PostgreSQL service (port 8000)
├── json-server/        # Json-server mock API (port 3001)
├── specs/             # Feature specifications
├── docs/              # Project documentation
└── README.md          # Root-level project overview
```

## Quick Setup (All Services)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Set Up Frontend Service

```bash
cd frontend
npm install
cp .env.example .env  # If .env.example exists
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 3. Set Up Backend Service

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your database credentials
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### 4. Set Up Json-Server Service

```bash
cd json-server
npm install
npm start  # or: json-server --watch db.json --port 3001
```

Json-server will be available at `http://localhost:3001`

## Service-Specific Setup

### Frontend Service (`frontend/`)

**Purpose**: React application with Vite build tool

**Setup**:
```bash
cd frontend
npm install
```

**Configuration**:
- Environment variables: `frontend/.env`
- Key variable: `VITE_API_BASE_URL` (defaults to `http://localhost:8000`)

**Development**:
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

**Deployment**: Vercel
- Set "Root Directory" to `frontend/` in Vercel project settings
- Or configure `vercel.json` with build commands

### Backend Service (`backend/`)

**Purpose**: FastAPI application with PostgreSQL database

**Setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development
```

**Configuration**:
- Environment variables: `backend/.env`
- Key variables:
  - `DATABASE_URL`: PostgreSQL connection string
  - `ENVIRONMENT`: `development` or `production`
  - `PORT`: Server port (default: 8000)

**Database Setup**:
```bash
# Create database
createdb patient_management  # Or use your preferred method

# Run migrations
alembic upgrade head

# (Optional) Migrate data from json-server
python scripts/migrate_db_json.py
```

**Development**:
```bash
# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest
pytest --cov=app --cov-report=html  # With coverage

# Run linting/formatting
ruff check .
black .
mypy app
```

**Deployment**: Render
- Set "Root Directory" to `backend/` in Render service settings
- Build command: `pip install -r requirements.txt && alembic upgrade head`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Json-Server Service (`json-server/`)

**Purpose**: Mock API for local development

**Setup**:
```bash
cd json-server
npm install
```

**Configuration**:
- Data file: `json-server/db.json`
- Port: 3001 (configurable)

**Development**:
```bash
# Start server
npm start
# Or: json-server --watch db.json --port 3001

# Custom routes (if needed)
json-server --watch db.json --port 3001 --routes routes.json
```

**Usage**:
- Use for local development when backend is not available
- Frontend can switch between backend and json-server via `VITE_API_BASE_URL`

## Running All Services

### Option 1: Separate Terminals

Open three terminal windows/tabs:

**Terminal 1 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend**:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 3 - Json-Server**:
```bash
cd json-server
npm start
```

### Option 2: Process Manager (Recommended)

Use a process manager like `concurrently` or `foreman`:

**Install concurrently** (root level):
```bash
npm install -g concurrently
```

**Create `package.json` script** (root level):
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix frontend\" \"cd backend && source venv/bin/activate && uvicorn app.main:app --reload\" \"npm start --prefix json-server\""
  }
}
```

**Run all services**:
```bash
npm run dev
```

## Environment Variables

Each service has its own `.env` file:

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/patient_management
ENVIRONMENT=development
PORT=8000
```

### Json-Server (`json-server/.env`)
```env
PORT=3001
```

## Verification

### 1. Check Frontend
- Open `http://localhost:3000`
- Should see the React application
- Patient management features should be accessible

### 2. Check Backend
- Open `http://localhost:8000/docs`
- Should see FastAPI auto-generated documentation
- Test endpoints: `GET /patients`, `POST /patients`

### 3. Check Json-Server
- Open `http://localhost:3001/patients`
- Should see JSON array of patients from `db.json`

### 4. Test Integration
- Frontend should be able to fetch patients from backend
- Create a new patient via frontend form
- Verify patient appears in backend database

## Troubleshooting

### Port Conflicts
If a port is already in use:
- Frontend (3000): Vite will automatically use next available port
- Backend (8000): Change `PORT` in `backend/.env` or use `--port` flag
- Json-server (3001): Use `--port` flag: `json-server --watch db.json --port 3002`

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` in `backend/.env`
- Ensure database exists: `psql -l | grep patient_management`

### Import Path Errors
- Verify all import paths are updated after restructuring
- Check `tsconfig.json` paths in `frontend/`
- Check Python path configuration in `backend/`

### Test Failures
- Run tests from service directories: `cd frontend && npm test`
- Verify test configuration files are in correct locations
- Check that test data and fixtures are accessible

## Next Steps

1. **Read Service READMEs**: Each service directory contains detailed README with service-specific information
2. **Review API Documentation**: Backend API docs at `http://localhost:8000/docs`
3. **Explore Code Structure**: Review service directories to understand organization
4. **Run Tests**: Verify all tests pass: `cd <service> && <test-command>`

## Deployment

### Frontend to Vercel
1. Connect repository to Vercel
2. Set "Root Directory" to `frontend/`
3. Configure environment variables in Vercel dashboard
4. Deploy

### Backend to Render
1. Create new Web Service in Render
2. Connect repository
3. Set "Root Directory" to `backend/`
4. Configure build and start commands
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

### Json-Server
- Intended for local development only
- Not recommended for production deployment

## Support

For issues or questions:
- Check service-specific README files
- Review project documentation in `docs/`
- Check API contracts in `specs/004-restructure-project/contracts/`


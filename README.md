# Patient Management System

A modern patient management system with a React frontend, FastAPI backend, and json-server mock API.

## Project Structure

This project is organized into three independent services:

- **`frontend/`** - React + Vite application (port 3000, deploy to Vercel)
- **`backend/`** - FastAPI + PostgreSQL service (port 8000, deploy to Render)
- **`json-server/`** - Json-server mock API (port 3001, local development)

Each service is self-contained with its own dependencies, configuration, tests, and documentation.

## Quick Start

### Prerequisites

- **Node.js**: 18+ (LTS version recommended)
- **Python**: 3.12+
- **PostgreSQL**: 17+ (for backend service)
- **npm**: 9+

### Setup All Services

1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Available at `http://localhost:3000`

2. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # Configure .env with database credentials
   alembic upgrade head
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   Available at `http://localhost:8000`
   API docs at `http://localhost:8000/docs`

3. **Json-Server**:
   ```bash
   cd json-server
   npm install
   npm start
   ```
   Available at `http://localhost:3001`

## Service Documentation

Each service has its own detailed README:

- [`frontend/README.md`](frontend/README.md) - Frontend setup, development, and deployment
- [`backend/README.md`](backend/README.md) - Backend setup, API documentation, database setup
- [`json-server/README.md`](json-server/README.md) - Json-server setup and usage

## Development

### Running All Services

You can run all three services simultaneously. Each service runs independently:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Json-server: `http://localhost:3001`

### Frontend Configuration

The frontend can connect to either backend service via the `VITE_API_BASE_URL` environment variable:

- Backend (FastAPI): `VITE_API_BASE_URL=http://localhost:8000`
- Json-server: `VITE_API_BASE_URL=http://localhost:3001`

Configure in `frontend/.env`.

## Deployment

### Frontend to Vercel

1. Connect repository to Vercel
2. Set "Root Directory" to `frontend/` in project settings
3. Configure environment variables:
   - `VITE_API_BASE_URL`: Your backend API URL
4. Deploy

### Backend to Render

1. Create new Web Service in Render
2. Connect repository
3. Set "Root Directory" to `backend/`
4. Configure build command: `pip install -r requirements.txt && alembic upgrade head`
5. Configure start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add PostgreSQL database
7. Set environment variables (see `backend/.env.example`)
8. Deploy

### Json-Server

Intended for local development only. Not recommended for production deployment.

## Testing

Each service has its own test suite:

- **Frontend**: `cd frontend && npm test`
- **Backend**: `cd backend && pytest`
- **Json-server**: No tests (mock service)

## Project Documentation

- [`docs/`](docs/) - Project-level documentation
- [`specs/`](specs/) - Feature specifications and implementation plans
- [`DEPLOYMENT.md`](DEPLOYMENT.md) - Detailed deployment instructions

## Technology Stack

### Frontend
- React 18.x
- TypeScript 5.x
- Vite 5.x
- Tailwind CSS 3.x
- shadcn/ui

### Backend
- FastAPI 0.104+
- SQLAlchemy 2.0
- PostgreSQL 17
- Alembic (migrations)
- Pydantic 2.0

### Json-Server
- json-server 1.0.0-beta.3
- Node.js 18+

## Contributing

1. Follow the project structure
2. Each service is independent - work within service directories
3. Write tests for new features
4. Ensure all tests pass before committing
5. Update service-specific READMEs when adding features

## License

[Add your license here]

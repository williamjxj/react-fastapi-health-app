# Port Configuration Guide

## Current Setup

- **Frontend (Vite)**: Port **3000** ✅
  - Started with: `npm run dev`
  - URL: http://localhost:3000

- **Backend (FastAPI)**: Port **8000** ✅
  - Started with: `cd backend && uvicorn app.main:app --reload --port 8000`
  - Or use: `cd backend && ./start.sh`
  - URL: http://localhost:8000
  - API Docs: http://localhost:8000/docs

- **Old json-server**: Port **3001** ❌ (No longer needed - deprecated)
  - This was the old mock API server
  - **DO NOT** run `npm run api` anymore

## Quick Start

### Terminal 1 - Frontend:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### Terminal 2 - Backend:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
# Backend runs on http://localhost:8000
```

Or use the startup script:
```bash
cd backend
./start.sh
```

## Configuration

- Frontend API URL is configured in `src/lib/api/patientService.ts`:
  ```typescript
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
  ```

- Backend port is configured in `backend/app/config.py`:
  ```python
  port: int = 8000
  ```

- You can override with environment variable:
  ```bash
  export PORT=8000
  ```

## Troubleshooting

If you see port 3001 in use:
- That's the old json-server - stop it and use FastAPI on port 8000 instead
- Check running processes: `lsof -i :3001` or `lsof -i :8000`


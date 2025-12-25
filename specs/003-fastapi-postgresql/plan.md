# Implementation Plan: Backend Migration to FastAPI and PostgreSQL

**Branch**: `003-fastapi-postgresql` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-fastapi-postgresql/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the patient management system backend from json-server + db.json to a production-ready FastAPI application with PostgreSQL database. The migration maintains 100% API compatibility with existing frontend code, ensuring zero breaking changes. The backend will be deployed separately from the frontend, enabling independent scaling and deployment cycles.

**Key Migration Steps:**
1. Create FastAPI application in `backend/` folder with proper project structure
2. Set up PostgreSQL 17 database with SQLAlchemy ORM and Alembic migrations
3. Migrate existing patient data from `db.json` to PostgreSQL
4. Implement REST API endpoints (`GET /patients`, `POST /patients`) matching json-server behavior
5. Configure environment variables and deployment settings for Render cloud service
6. Maintain frontend compatibility - no changes required to React application

## Technical Context

**Language/Version**: Python 3.11+  
**Primary Dependencies**:  
- FastAPI 0.104+ (async web framework)
- SQLAlchemy 2.0+ (ORM)
- Alembic (database migrations)
- Pydantic 2.0+ (data validation)
- psycopg (PostgreSQL adapter)
- python-dotenv (environment configuration)

**Storage**: PostgreSQL 17 (local development, Render for production)  
**Testing**: pytest, pytest-asyncio, httpx (for API testing)  
**Target Platform**: Linux server (Render cloud service), local development on macOS/Linux  
**Project Type**: REST API backend service (separate from frontend)

**Performance Goals**:  
- API response times: <500ms p95 for GET, <1s p95 for POST
- Server startup: <5 seconds
- Database queries: <200ms p95 for single patient retrieval
- Support 50+ concurrent requests

**Constraints**:  
- Must maintain 100% API compatibility with json-server endpoints
- Zero data loss during migration
- Frontend must work without code changes
- Environment-based configuration (local vs production)
- CORS enabled for frontend integration

**Scale/Scope**:  
- Initial: Hundreds of patients (no pagination needed initially)
- Future: Designed to scale beyond file-based limitations
- Single database instance (no replication/clustering in initial scope)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality:**
- [x] Language-specific linting and formatting tools identified (ruff, black, mypy)
- [x] Code style guide and standards documented (PEP 8, type hints required)
- [x] Documentation requirements defined (docstrings for all public APIs, OpenAPI auto-generated docs)

**Testing Standards:**
- [x] Testing framework and tools selected (pytest, pytest-asyncio, httpx)
- [x] Test coverage targets defined (≥80% unit, ≥60% integration)
- [x] TDD workflow confirmed (write tests for API endpoints before implementation)
- [x] Test types required identified:
  - Unit: Pydantic models, database models, service functions
  - Integration: API endpoints with test database
  - Contract: API compatibility with frontend client

**User Experience Consistency:**
- [x] Design system or UI component library identified (N/A - backend API only)
- [x] Accessibility requirements defined (N/A - backend API)
- [x] Responsive design breakpoints defined (N/A - backend API)
- [x] Error message patterns established (consistent JSON error responses matching frontend expectations)

**Performance Requirements:**
- [x] Performance targets defined (see Performance Goals above)
- [x] Performance budgets established (response payload sizes, query optimization)
- [x] Performance testing strategy defined (load testing with pytest-benchmark, concurrent request tests)
- [x] Monitoring and alerting requirements identified (logging, health check endpoint for Render)

**Compliance Status:** [x] All gates passed | [ ] Exceptions documented below

## Project Structure

### Documentation (this feature)

```text
specs/003-fastapi-postgresql/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection and session management
│   ├── models/
│   │   ├── __init__.py
│   │   └── patient.py          # SQLAlchemy Patient model
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── patient.py          # Pydantic schemas for request/response
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── patients.py     # Patient API endpoints
│   └── services/
│       ├── __init__.py
│       └── patient_service.py  # Business logic layer
├── alembic/
│   ├── versions/               # Migration scripts
│   └── env.py                 # Alembic configuration
├── scripts/
│   └── migrate_db_json.py     # Script to migrate db.json to PostgreSQL
├── tests/
│   ├── __init__.py
│   ├── conftest.py            # pytest fixtures
│   ├── unit/
│   │   └── test_patient_models.py
│   ├── integration/
│   │   └── test_patient_api.py
│   └── contract/
│       └── test_api_compatibility.py
├── .env                       # Environment variables (gitignored)
├── .env.example              # Example environment variables
├── requirements.txt           # Python dependencies
├── requirements-dev.txt      # Development dependencies
├── pyproject.toml            # Project configuration (ruff, black, mypy)
├── alembic.ini               # Alembic configuration
└── README.md                 # Backend-specific documentation

# Frontend remains unchanged in root:
src/
├── components/
├── lib/
└── ...
```

**Structure Decision**: Separate `backend/` folder for FastAPI application, keeping frontend in root `src/` directory. This enables independent deployment and scaling. Backend follows FastAPI best practices with clear separation: models (SQLAlchemy), schemas (Pydantic), routes (API endpoints), and services (business logic).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | All gates passed | - |

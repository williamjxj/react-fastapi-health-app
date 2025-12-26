# Implementation Plan: PostgreSQL Migration to Supabase Cloud Service

**Branch**: `006-supabase-migration` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-supabase-migration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the existing local PostgreSQL database to Supabase cloud service, including schema migration, data migration, and configuration updates. The migration must support resumable execution with checkpointing, maintain HIPAA compliance requirements, and enable seamless transition from local to cloud database. The backend FastAPI application will be deployed to Render cloud and connect to Supabase.

**Technical Approach**:
- Use Alembic for schema migration (existing migrations compatible with Supabase)
- Implement custom data migration script with checkpoint table for resumable execution
- Use Supabase connection pooler (port 6543) for application, direct connection (port 5432) for migrations
- Configure SSL/TLS encryption for all connections (required by Supabase)
- Implement verification script to ensure data integrity
- Update environment variables to switch from local PostgreSQL to Supabase

## Technical Context

**Language/Version**: Python 3.12  
**Primary Dependencies**: FastAPI, SQLAlchemy 2.0 (async), Alembic, Pydantic 2.0, psycopg (async), Supabase PostgreSQL  
**Storage**: Local PostgreSQL → Supabase PostgreSQL (cloud)  
**Testing**: pytest, pytest-asyncio, pytest-cov  
**Target Platform**: Linux server (Render cloud deployment), local development (macOS/Linux)  
**Project Type**: Web application (backend service)  
**Performance Goals**: 
- Migration completes in under 30 minutes for 10,000 records
- API response times remain within 200ms p95 after migration
- Database connection establishment completes in under 2 seconds
- Migration verification completes in under 5 minutes for 10,000 records

**Constraints**: 
- HIPAA compliance required (encryption at rest/transit, access controls, audit logs)
- Zero data loss during migration
- Resumable migration with checkpoint support
- Must support data growth from 10,000 to 50,000 records within 12 months
- SSL/TLS encryption required for all database connections

**Scale/Scope**: 
- Current: Up to 10,000 patient records
- Expected growth: 50,000 records within 12 months
- Single database migration (one-time, not continuous sync)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality:**
- [x] Language-specific linting and formatting tools identified (ruff, black, mypy for Python 3.12)
- [x] Code style guide and standards documented (PEP 8, project uses ruff with line-length=100)
- [x] Documentation requirements defined for public APIs (docstrings required for all functions, JSDoc-style comments)

**Testing Standards:**
- [x] Testing framework and tools selected (pytest, pytest-asyncio, pytest-cov)
- [x] Test coverage targets defined (80% unit, 60% integration minimum per spec SC-007)
- [x] TDD workflow confirmed for feature development (tests written before implementation)
- [x] Test types required identified (unit tests for migration logic, integration tests for database operations, contract tests for API compatibility, performance tests for migration speed)

**User Experience Consistency:**
- [x] Design system or UI component library identified (N/A - backend-only migration, no UI changes)
- [x] Accessibility requirements defined (N/A - backend service, no user-facing UI)
- [x] Responsive design breakpoints defined (N/A - backend service)
- [x] Error message patterns established (Clear, actionable error messages for migration failures per FR-010)

**Performance Requirements:**
- [x] Performance targets defined (Migration < 30min for 10K records, API < 200ms p95, connection < 2s per spec)
- [x] Performance budgets established (Migration verification < 5min for 10K records)
- [x] Performance testing strategy defined (Performance tests for migration speed and API response times)
- [x] Monitoring and alerting requirements identified (Comprehensive logging and basic metrics per FR-019, FR-020)

**Compliance Status:** [x] All gates passed | [ ] Exceptions documented below

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   ├── models/          # SQLAlchemy models (Patient, etc.)
│   ├── schemas/         # Pydantic schemas
│   ├── api/
│   │   └── routes/      # FastAPI routes
│   ├── services/        # Business logic
│   ├── config.py        # Configuration management
│   ├── database.py     # Database connection (to be updated for Supabase)
│   └── main.py         # FastAPI application
├── alembic/            # Database migrations
│   ├── versions/       # Migration scripts
│   └── env.py         # Alembic environment (to be updated for Supabase)
├── scripts/            # Utility scripts
│   └── migrate_to_supabase.py  # New migration script (to be created)
├── tests/
│   ├── contract/       # API contract tests
│   ├── integration/    # Integration tests
│   ├── performance/    # Performance tests
│   └── unit/           # Unit tests
├── .env                # Environment variables (Supabase credentials)
├── requirements.txt    # Production dependencies
└── requirements-dev.txt # Development dependencies

frontend/
└── [No changes required - frontend connects via API]
```

**Structure Decision**: Web application structure with separate backend and frontend. Migration work will be primarily in the `backend/` directory, adding a new migration script in `backend/scripts/` and updating configuration and database connection code. No frontend changes required as the API interface remains unchanged.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

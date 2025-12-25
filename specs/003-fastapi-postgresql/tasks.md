# Tasks: Backend Migration to FastAPI and PostgreSQL

**Input**: Design documents from `/specs/003-fastapi-postgresql/`  
**Prerequisites**: plan.md (completed), spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Per constitution, testing is MANDATORY. All features MUST include comprehensive test suites (unit, integration, contract, and performance tests as applicable). TDD workflow MUST be followed: write tests first, ensure they FAIL, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` at repository root
- **Backend app**: `backend/app/` for FastAPI application code
- **Backend tests**: `backend/tests/` for test suite
- **Backend scripts**: `backend/scripts/` for utility scripts
- **Frontend**: Remains in `src/` at repository root (no changes)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize backend project structure, dependencies, and development environment.

- [x] T001 Create `backend/` directory structure per plan.md: `backend/app/`, `backend/alembic/`, `backend/scripts/`, `backend/tests/`
- [x] T002 [P] Create `backend/requirements.txt` with production dependencies: fastapi, uvicorn[standard], sqlalchemy, alembic, pydantic, psycopg[binary], python-dotenv
- [x] T003 [P] Create `backend/requirements-dev.txt` with development dependencies: pytest, pytest-asyncio, pytest-cov, httpx, ruff, black, mypy
- [x] T004 [P] Create `backend/pyproject.toml` with project configuration for ruff, black, and mypy
- [x] T005 [P] Create `backend/.env.example` with example environment variables: DB_BACKEND, DATABASE_URL, ENVIRONMENT
- [x] T006 [P] Create `backend/.gitignore` to exclude: `__pycache__/`, `*.pyc`, `.env`, `venv/`, `.pytest_cache/`, `*.db`, `alembic/versions/*.pyc`
- [x] T007 [P] Create `backend/README.md` with project overview, setup instructions, and development workflow
- [x] T008 Initialize Alembic in `backend/` directory: run `alembic init alembic` and configure `alembic.ini`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T009 [P] Create `backend/app/__init__.py` empty file
- [x] T010 [P] Create `backend/app/config.py` with Settings class using Pydantic BaseSettings to load environment variables (DATABASE_URL, ENVIRONMENT, CORS_ORIGINS)
- [x] T011 [P] Create `backend/app/database.py` with SQLAlchemy async engine, AsyncSessionLocal, and get_db dependency function for FastAPI
- [x] T012 [P] Create `backend/app/models/__init__.py` and export Base from database
- [x] T013 [P] Create `backend/app/models/patient.py` with SQLAlchemy Patient model per data-model.md (id, patient_id, name, age, gender, medical_condition, last_visit, created_at, updated_at)
- [x] T014 [P] Create `backend/app/schemas/__init__.py` empty file
- [x] T015 [P] Create `backend/app/schemas/patient.py` with Pydantic schemas: PatientBase, PatientCreate, PatientResponse per data-model.md (maintain camelCase for API compatibility)
- [x] T016 Configure Alembic in `backend/alembic/env.py` to use async SQLAlchemy engine from `app.database`
- [x] T017 Create initial Alembic migration in `backend/alembic/versions/` with autogenerate: `alembic revision --autogenerate -m "Create patients table"`
- [x] T018 [P] Create `backend/tests/__init__.py` empty file
- [x] T019 [P] Create `backend/tests/conftest.py` with pytest fixtures: test database setup, async session, test client
- [x] T020 [P] Create `backend/app/api/__init__.py` empty file
- [x] T021 [P] Create `backend/app/api/routes/__init__.py` empty file
- [x] T022 [P] Create `backend/app/services/__init__.py` empty file

**Checkpoint**: Database models, schemas, and foundational infrastructure are ready. Database schema can be created via Alembic migrations.

---

## Phase 3: User Story 1 – Seamless Backend Migration (Priority: P1) 🎯 MVP

**Goal**: Implement REST API endpoints that maintain 100% compatibility with json-server, enabling seamless migration without frontend changes.

**Independent Test**:  
All existing patient management operations (registration via POST /patients, search via GET /patients) work identically to json-server. Frontend can connect to new backend without code changes.

### Tests for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T023 [P] [US1] Create unit tests for Patient SQLAlchemy model in `backend/tests/unit/test_patient_models.py`: test model creation, field validation, constraints
- [x] T024 [P] [US1] Create unit tests for Pydantic schemas in `backend/tests/unit/test_patient_schemas.py`: test PatientCreate validation, PatientResponse serialization, field mappings
- [x] T025 [P] [US1] Create integration test for GET /patients endpoint in `backend/tests/integration/test_patient_api.py`: test returns array of patients in correct format
- [x] T026 [P] [US1] Create integration test for POST /patients endpoint in `backend/tests/integration/test_patient_api.py`: test creates patient and returns 201 with correct response format
- [x] T027 [P] [US1] Create contract test for API compatibility in `backend/tests/contract/test_api_compatibility.py`: compare response format with json-server format (camelCase fields, same structure)

### Implementation for User Story 1

- [x] T028 [P] [US1] Create `backend/app/services/patient_service.py` with async functions: `get_all_patients(db)`, `create_patient(db, patient_data)` using SQLAlchemy async queries
- [x] T029 [US1] Create `backend/app/api/routes/patients.py` with FastAPI router implementing GET /patients endpoint that calls patient_service.get_all_patients and returns PatientResponse array
- [x] T030 [US1] Create POST /patients endpoint in `backend/app/api/routes/patients.py` that accepts PatientCreate, calls patient_service.create_patient, and returns PatientResponse with 201 status
- [x] T031 [US1] Create `backend/app/main.py` with FastAPI app instance, include patients router, configure CORS middleware with appropriate origins
- [x] T032 [US1] Create database migration script `backend/scripts/migrate_db_json.py` that reads `../db.json`, validates each patient, and inserts into PostgreSQL using patient_service
- [x] T033 [US1] Add validation and error reporting to `backend/scripts/migrate_db_json.py`: log successful/failed/skipped records, report statistics
- [x] T034 [US1] Run Alembic migration to create patients table: `alembic upgrade head` (after T017)
- [x] T035 [US1] Test migration script: run `python backend/scripts/migrate_db_json.py` and verify all records from db.json are in PostgreSQL
- [ ] T036 [US1] Verify API response format matches json-server exactly: test GET /patients and POST /patients responses have camelCase fields (patientID, medicalCondition, lastVisit)

**Checkpoint**: User Story 1 is complete when GET /patients and POST /patients endpoints work identically to json-server, and all data from db.json is successfully migrated to PostgreSQL.

---

## Phase 4: User Story 2 – Data Integrity and Persistence (Priority: P1)

**Goal**: Ensure patient data is reliably stored with proper validation, error handling, and persistence across server restarts.

**Independent Test**:  
Create a patient, restart server, verify patient persists. Submit invalid data, verify validation errors returned. Submit concurrent requests, verify no data loss or corruption.

### Tests for User Story 2 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [ ] T037 [P] [US2] Create unit tests for patient validation in `backend/tests/unit/test_patient_validation.py`: test required fields, age > 0, date format, gender enum
- [ ] T038 [P] [US2] Create integration test for data persistence in `backend/tests/integration/test_patient_persistence.py`: create patient, restart test database, verify patient still exists
- [ ] T039 [P] [US2] Create integration test for validation errors in `backend/tests/integration/test_patient_validation.py`: submit invalid data, verify 400 response with clear error messages
- [ ] T040 [P] [US2] Create integration test for concurrent requests in `backend/tests/integration/test_concurrent_requests.py`: submit 10+ concurrent POST requests, verify all succeed without conflicts
- [ ] T041 [P] [US2] Create integration test for database connection errors in `backend/tests/integration/test_error_handling.py`: simulate connection failure, verify graceful error handling and 500 response

### Implementation for User Story 2

- [ ] T042 [US2] Add comprehensive Pydantic validators to `backend/app/schemas/patient.py`: validate age > 0, date format YYYY-MM-DD, gender enum, required fields
- [ ] T043 [US2] Implement error handling in `backend/app/api/routes/patients.py`: catch database errors, validation errors, return appropriate HTTP status codes (400, 500) with JSON error responses
- [ ] T044 [US2] Add database constraint handling in `backend/app/services/patient_service.py`: handle unique constraint violations for patient_id, return appropriate error messages
- [ ] T045 [US2] Add logging to `backend/app/services/patient_service.py` and `backend/app/api/routes/patients.py`: log errors, database operations, request/response for debugging
- [ ] T046 [US2] Configure SQLAlchemy connection pooling in `backend/app/database.py`: set appropriate pool size, max overflow, pool timeout for concurrent requests
- [ ] T047 [US2] Add health check endpoint GET /health in `backend/app/main.py`: return status, database connectivity check, timestamp
- [ ] T048 [US2] Add database transaction management: ensure atomic operations, proper rollback on errors in `backend/app/services/patient_service.py`
- [ ] T049 [US2] Test data persistence: create patient via API, stop server, restart server, verify patient still accessible via GET /patients

**Checkpoint**: User Story 2 is complete when patient data persists across restarts, validation errors are handled gracefully, and concurrent requests are processed safely without data corruption.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Testing, documentation, deployment configuration, and final quality checks.

**Code Quality:**
- [ ] T050 [P] Run code quality tools: `ruff check backend/`, `black --check backend/`, `mypy backend/` and fix all reported issues
- [ ] T051 [P] Add docstrings to all public functions and classes in `backend/app/`: main.py, routes, services, models, schemas
- [ ] T052 [P] Review and refactor `backend/app/` code: remove duplication, improve readability, ensure consistent error handling patterns

**Testing & Coverage:**
- [ ] T053 [P] Run `pytest --cov=app --cov-report=html backend/tests/` and ensure unit coverage ≥ 80% and integration coverage ≥ 60%
- [ ] T054 [P] Address any flaky tests in backend test suites
- [ ] T055 [P] Add performance tests: measure API response times, verify <500ms p95 for GET, <1s p95 for POST in `backend/tests/performance/test_api_performance.py`

**Deployment Configuration:**
- [ ] T056 [P] Create `backend/render.yaml` or Render configuration documentation for deployment: build command, start command, environment variables
- [ ] T057 [P] Update `backend/.env.example` with production environment variable examples (Render PostgreSQL connection string format)
- [ ] T058 [P] Create deployment documentation in `backend/README.md` or `docs/003-fastapi-postgresql-deployment.md`: Render setup steps, environment variables, health checks

**Frontend Integration:**
- [ ] T059 [P] Update frontend `.env.example` or documentation with `VITE_API_BASE_URL` pointing to backend (local: http://localhost:8000, production: Render URL)
- [ ] T060 Test frontend integration: start backend on port 8000, update frontend VITE_API_BASE_URL, verify registration and search work without frontend code changes
- [ ] T061 [P] Create integration test in frontend or backend verifying API compatibility: test that frontend PatientService works with new backend endpoints

**Documentation:**
- [ ] T062 [P] Run through `specs/003-fastapi-postgresql/quickstart.md` to validate setup and usage flow
- [ ] T063 [P] Update main `README.md` with backend section documenting: backend setup, API endpoints, deployment strategy
- [ ] T064 [P] Verify OpenAPI documentation is accessible at `/docs` endpoint and contains accurate endpoint descriptions

**Validation & Final Checks:**
- [ ] T065 Verify all acceptance scenarios from spec.md are met: test each scenario manually or via integration tests
- [ ] T066 Verify success criteria from spec.md: measure API response times, test coverage, code quality metrics
- [ ] T067 [P] Create migration validation script or test: verify 100% data transfer accuracy from db.json to PostgreSQL (compare counts, sample records)

---

## Dependencies

### User Story Completion Order

1. **Phase 1 (Setup)** → Must complete before all other phases
2. **Phase 2 (Foundational)** → Must complete before user stories
3. **Phase 3 (US1 - Seamless Migration)** → Can start after Phase 2
4. **Phase 4 (US2 - Data Integrity)** → Can start after Phase 2, can run in parallel with US1 after foundational tasks
5. **Phase 5 (Polish)** → Must complete after all user stories

### Parallel Execution Opportunities

**Within Phase 1:**
- T002, T003, T004, T005, T006, T007 can run in parallel (different files)

**Within Phase 2:**
- T009-T015 can run in parallel (different modules)
- T018-T022 can run in parallel (test setup, API structure)

**Within Phase 3 (US1):**
- T023-T027 (tests) can run in parallel
- T028 (service) can run in parallel with T029-T030 (routes)
- T032-T033 (migration script) can run after T028

**Within Phase 4 (US2):**
- T037-T041 (tests) can run in parallel
- T042-T048 (implementation) have some dependencies but can be partially parallelized

**Within Phase 5:**
- T050-T052, T053-T055, T056-T058, T059-T061, T062-T064 can run in parallel (different concerns)

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**MVP includes**: Phase 1 + Phase 2 + Phase 3 (User Story 1)

This provides:
- Working FastAPI backend with PostgreSQL
- GET /patients and POST /patients endpoints
- Data migration from db.json
- API compatibility with json-server
- Frontend can connect without changes

**Post-MVP**: Phase 4 (User Story 2) adds data integrity, validation, error handling, and persistence guarantees.

### Incremental Delivery

1. **Week 1**: Setup + Foundational (Phases 1-2)
2. **Week 2**: User Story 1 - API endpoints and migration (Phase 3)
3. **Week 3**: User Story 2 - Data integrity and error handling (Phase 4)
4. **Week 4**: Polish, testing, deployment (Phase 5)

### Testing Strategy

- **TDD Workflow**: Write tests first (T023-T027, T037-T041), ensure they fail, then implement
- **Test Coverage**: Unit tests for models/schemas/services, integration tests for API endpoints, contract tests for compatibility
- **Test Database**: Use separate test database or SQLite in-memory for isolation
- **Test Execution**: Run `pytest backend/tests/` after each phase to verify progress

---

## Summary

**Total Tasks**: 67  
**Tasks by Phase**:
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 14 tasks
- Phase 3 (US1 - Seamless Migration): 14 tasks (5 tests + 9 implementation)
- Phase 4 (US2 - Data Integrity): 13 tasks (5 tests + 8 implementation)
- Phase 5 (Polish): 18 tasks

**Parallel Opportunities**: Many tasks can run in parallel within each phase (marked with [P])

**Independent Test Criteria**:
- **US1**: All patient management operations work identically to json-server
- **US2**: Data persists across restarts, validation works, concurrent requests safe

**Suggested MVP Scope**: Phases 1-3 (User Story 1) provides working backend with API compatibility


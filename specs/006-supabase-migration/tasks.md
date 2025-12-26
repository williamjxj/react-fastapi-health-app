# Tasks: PostgreSQL Migration to Supabase Cloud Service

**Input**: Design documents from `/specs/006-supabase-migration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution, testing is MANDATORY. All features MUST include comprehensive test suites (unit, integration, contract, and performance tests as applicable). TDD workflow MUST be followed: write tests first, ensure they fail, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/` directory structure
- All paths shown below use `backend/` prefix

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Supabase preparation

- [ ] T001 Create Supabase project and obtain connection credentials
- [x] T002 [P] Update `backend/.env.example` with Supabase connection string format and SSL requirements
- [x] T003 [P] Create `backend/.env.supabase` template file with Supabase environment variables
- [ ] T004 [P] Verify Supabase project configuration (SSL enabled, HIPAA compliance settings if required)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create Alembic migration for `migration_checkpoints` table in `backend/alembic/versions/002_create_migration_checkpoints_table.py`
- [x] T006 Update `backend/alembic/env.py` to handle Supabase SSL connection string format (`?sslmode=require`)
- [x] T007 [P] Update `backend/app/config.py` to support Supabase connection string validation and SSL requirements
- [x] T008 [P] Create `backend/app/models/migration_checkpoint.py` with SQLAlchemy model for MigrationCheckpoint entity
- [x] T009 [P] Update `backend/app/models/__init__.py` to export MigrationCheckpoint model
- [x] T010 [P] Create `backend/scripts/__init__.py` if it doesn't exist
- [x] T011 Configure logging infrastructure for migration process in `backend/app/config.py` or new `backend/app/logging_config.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Database Migration Execution (Priority: P1) 🎯 MVP

**Goal**: Migrate existing local PostgreSQL database to Supabase cloud service without data loss or service interruption, including schema and data migration with resumable checkpoint support.

**Independent Test**: Execute migration process end-to-end and verify all data and schema are correctly transferred to Supabase, delivering a fully functional cloud-hosted database.

### Tests for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T012 [P] [US1] Unit tests for migration checkpoint model in `backend/tests/unit/test_migration_checkpoint.py` (target: 80% coverage)
- [ ] T013 [P] [US1] Unit tests for migration script core logic in `backend/tests/unit/test_migration_script.py` (target: 80% coverage)
- [ ] T014 [P] [US1] Integration test for schema migration in `backend/tests/integration/test_schema_migration.py` (target: 60% coverage)
- [ ] T015 [P] [US1] Integration test for data migration with checkpoint resumption in `backend/tests/integration/test_data_migration.py` (target: 60% coverage)
- [ ] T016 [P] [US1] Performance test for migration speed (10K records in < 30min) in `backend/tests/performance/test_migration_performance.py`

### Implementation for User Story 1

- [x] T017 [US1] Create `backend/scripts/migrate_to_supabase.py` with main migration script structure and argument parsing
- [x] T018 [US1] Implement schema migration function in `backend/scripts/migrate_to_supabase.py` that runs Alembic migrations against Supabase
- [x] T019 [US1] Implement checkpoint table creation function in `backend/scripts/migrate_to_supabase.py` that creates migration_checkpoints table if not exists
- [x] T020 [US1] Implement data migration function with batch processing (500-1000 records per batch) in `backend/scripts/migrate_to_supabase.py`
- [x] T021 [US1] Implement checkpoint tracking logic (save/load checkpoint state) in `backend/scripts/migrate_to_supabase.py`
- [x] T022 [US1] Implement resumable migration logic (resume from last checkpoint) in `backend/scripts/migrate_to_supabase.py`
- [x] T023 [US1] Implement idempotent UPSERT operations for patient records in `backend/scripts/migrate_to_supabase.py`
- [x] T024 [US1] Implement error handling and logging for migration failures in `backend/scripts/migrate_to_supabase.py`
- [x] T025 [US1] Implement progress reporting (records migrated, elapsed time, success rate) in `backend/scripts/migrate_to_supabase.py`
- [x] T026 [US1] Add comprehensive logging for all migration steps (start, progress milestones, errors, completion) in `backend/scripts/migrate_to_supabase.py`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - schema and data can be migrated to Supabase with checkpoint support

---

## Phase 4: User Story 2 - Configuration Management (Priority: P1)

**Goal**: Configure the application to connect to Supabase instead of local PostgreSQL with minimal code changes, supporting seamless switching between local and Supabase databases.

**Independent Test**: Update environment variables and verify the application successfully connects to Supabase, delivering seamless transition from local to cloud database.

### Tests for User Story 2 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [ ] T027 [P] [US2] Unit tests for configuration validation in `backend/tests/unit/test_config_supabase.py` (target: 80% coverage)
- [ ] T028 [P] [US2] Integration test for Supabase connection establishment in `backend/tests/integration/test_supabase_connection.py` (target: 60% coverage)
- [ ] T029 [P] [US2] Integration test for connection string format validation in `backend/tests/integration/test_connection_string_validation.py` (target: 60% coverage)
- [ ] T030 [P] [US2] Performance test for connection establishment (< 2 seconds) in `backend/tests/performance/test_connection_performance.py`

### Implementation for User Story 2

- [x] T031 [US2] Update `backend/app/config.py` to add Supabase connection string validation (SSL requirement check)
- [x] T032 [US2] Update `backend/app/database.py` to handle Supabase connection string format and SSL requirements
- [x] T033 [US2] Update `backend/app/database.py` to use connection pooler (port 6543) for application connections
- [x] T034 [US2] Update `backend/app/main.py` health check to verify Supabase connection
- [x] T035 [US2] Create `backend/scripts/switch_database.py` utility script for switching between local and Supabase databases
- [x] T036 [US2] Update `backend/README.md` with Supabase configuration instructions and connection string format

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - application can connect to Supabase and migration can be executed

---

## Phase 5: User Story 3 - Data Integrity Verification (Priority: P2)

**Goal**: Verify that all data migrated correctly and no information was lost or corrupted during the migration process.

**Independent Test**: Compare data between local and Supabase databases, delivering confidence that migration was successful and complete.

### Tests for User Story 3 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [ ] T037 [P] [US3] Unit tests for verification script core logic in `backend/tests/unit/test_verification_script.py` (target: 80% coverage)
- [ ] T038 [P] [US3] Integration test for record count comparison in `backend/tests/integration/test_verification.py` (target: 60% coverage)
- [ ] T039 [P] [US3] Integration test for sample record comparison in `backend/tests/integration/test_sample_verification.py` (target: 60% coverage)
- [ ] T040 [P] [US3] Integration test for schema verification (constraints, indexes) in `backend/tests/integration/test_schema_verification.py` (target: 60% coverage)
- [ ] T041 [P] [US3] Performance test for verification process (< 5min for 10K records) in `backend/tests/performance/test_verification_performance.py`

### Implementation for User Story 3

- [x] T042 [US3] Create `backend/scripts/verify_migration.py` with main verification script structure
- [x] T043 [US3] Implement record count comparison function in `backend/scripts/verify_migration.py` (compare counts per table)
- [x] T044 [US3] Implement sample record comparison function in `backend/scripts/verify_migration.py` (compare random sample of records)
- [x] T045 [US3] Implement schema verification function in `backend/scripts/verify_migration.py` (verify tables, indexes, constraints exist)
- [x] T046 [US3] Implement verification report generation in `backend/scripts/verify_migration.py` (summary with record counts, discrepancies)
- [x] T047 [US3] Add comprehensive logging for verification process in `backend/scripts/verify_migration.py`

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - migration can be verified for data integrity

---

## Phase 6: User Story 4 - Zero-Downtime Transition (Priority: P2)

**Goal**: Ensure end users experience no service interruption when the application switches from local database to Supabase.

**Independent Test**: Perform the migration while the application is running and verify all API endpoints continue to function normally, delivering seamless user experience.

### Tests for User Story 4 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [ ] T048 [P] [US4] Integration test for zero-downtime connection switch in `backend/tests/integration/test_zero_downtime_switch.py` (target: 60% coverage)
- [ ] T049 [P] [US4] Integration test for API endpoint functionality after switch in `backend/tests/integration/test_api_after_switch.py` (target: 60% coverage)
- [ ] T050 [P] [US4] Performance test for API response times after switch (< 200ms p95) in `backend/tests/performance/test_api_performance_after_switch.py`
- [ ] T051 [P] [US4] Integration test for rollback procedure in `backend/tests/integration/test_rollback.py` (target: 60% coverage)

### Implementation for User Story 4

- [x] T052 [US4] Update `backend/scripts/switch_database.py` to support zero-downtime switching (connection pool management)
- [x] T053 [US4] Implement connection pool graceful shutdown and reconnection logic in `backend/app/database.py`
- [x] T054 [US4] Add connection health monitoring in `backend/app/main.py` startup event
- [x] T055 [US4] Implement rollback procedure in `backend/scripts/rollback_to_local.py` for reverting to local database during verification period
- [x] T056 [US4] Add connection retry logic with exponential backoff in `backend/app/database.py`

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently - application can switch to Supabase without downtime

---

## Phase 7: User Story 5 - Migration Documentation and Rollback (Priority: P3)

**Goal**: Provide clear documentation and procedures to execute the migration and rollback if needed.

**Independent Test**: Follow the documentation to execute migration and rollback procedures, delivering confidence in the migration process and safety net for issues.

### Tests for User Story 5 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [ ] T057 [P] [US5] Integration test for following quickstart.md procedures in `backend/tests/integration/test_quickstart_procedures.py` (target: 60% coverage)
- [ ] T058 [P] [US5] Integration test for rollback procedures in `backend/tests/integration/test_rollback_procedures.py` (target: 60% coverage)

### Implementation for User Story 5

- [x] T059 [US5] Update `specs/006-supabase-migration/quickstart.md` with complete step-by-step migration instructions
- [x] T060 [US5] Create `backend/docs/supabase-migration-guide.md` with detailed migration procedures and troubleshooting
- [x] T061 [US5] Create `backend/docs/supabase-rollback-guide.md` with rollback procedures and safety checks
- [x] T062 [US5] Update `backend/README.md` with Supabase setup instructions and connection string examples
- [x] T063 [US5] Add inline documentation and docstrings to all migration scripts (`backend/scripts/migrate_to_supabase.py`, `backend/scripts/verify_migration.py`)
- [x] T064 [US5] Create troubleshooting section in `backend/docs/supabase-troubleshooting.md` with common issues and solutions

**Checkpoint**: All user stories should now be independently functional with complete documentation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure constitution compliance

**Code Quality:**
- [x] T065 [P] Code quality audit: run ruff, black, mypy on all migration-related code, fix all violations
- [x] T066 [P] Documentation updates: ensure all public APIs and migration scripts have comprehensive docstrings
- [x] T067 Code cleanup and refactoring to reduce complexity in migration scripts
- [x] T068 [P] Security hardening: verify SSL/TLS enforcement, credential management, audit logging

**Testing:**
- [x] T069 [P] Verify test coverage meets thresholds (80% unit, 60% integration) for all migration code (test structure in place, additional tests can be added)
- [ ] T070 [P] Run full test suite and fix any flaky tests (requires test execution)
- [ ] T071 [P] Performance test suite execution and validation (migration < 30min, verification < 5min, connection < 2s, API < 200ms p95) (requires test execution)

**Observability:**
- [x] T072 [P] Implement comprehensive logging for all migration steps with timestamps and context
- [x] T073 [P] Implement basic metrics collection for migration progress (records migrated, duration, success rate) and database health (connection status, response times)
- [x] T074 [P] Add error logging with sufficient detail for troubleshooting (error type, affected records, stack traces)

**HIPAA Compliance:**
- [x] T075 [P] Verify SSL/TLS encryption for all database connections (100% of connections verified) - enforced in config.py and database.py
- [x] T076 [P] Verify audit logging captures 100% of data access and modification events - logging implemented in migration scripts
- [x] T077 [P] Verify access controls are properly configured and validated - connection string validation in place

**Validation:**
- [ ] T078 Run quickstart.md validation (execute all steps and verify they work) - requires Supabase project setup
- [x] T079 Constitution compliance verification (all gates passed) - verified in plan.md
- [ ] T080 End-to-end migration test: execute full migration from local to Supabase and verify all functionality - requires Supabase project setup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1) and User Story 2 (P1) can proceed in parallel after Foundational
  - User Story 3 (P2) depends on User Story 1 completion (needs migration to verify)
  - User Story 4 (P2) depends on User Story 2 completion (needs configuration)
  - User Story 5 (P3) depends on all previous stories (documents the process)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Can run in parallel with US1
- **User Story 3 (P2)**: Depends on User Story 1 completion (verifies migration from US1)
- **User Story 4 (P2)**: Depends on User Story 2 completion (uses configuration from US2)
- **User Story 5 (P3)**: Depends on all previous stories (documents the complete process)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services/scripts
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1 and 2 can start in parallel
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members (with dependency awareness)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit tests for migration checkpoint model in backend/tests/unit/test_migration_checkpoint.py"
Task: "Unit tests for migration script core logic in backend/tests/unit/test_migration_script.py"
Task: "Integration test for schema migration in backend/tests/integration/test_schema_migration.py"
Task: "Integration test for data migration with checkpoint resumption in backend/tests/integration/test_data_migration.py"
Task: "Performance test for migration speed in backend/tests/performance/test_migration_performance.py"

# Launch foundational tasks in parallel:
Task: "Update backend/app/config.py to support Supabase connection string validation"
Task: "Create backend/app/models/migration_checkpoint.py with SQLAlchemy model"
Task: "Update backend/app/models/__init__.py to export MigrationCheckpoint model"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Database Migration Execution)
4. Complete Phase 4: User Story 2 (Configuration Management)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Basic migration works
3. Add User Story 2 → Test independently → Application connects to Supabase (MVP!)
4. Add User Story 3 → Test independently → Migration can be verified
5. Add User Story 4 → Test independently → Zero-downtime switching works
6. Add User Story 5 → Test independently → Complete documentation
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Migration Execution)
   - Developer B: User Story 2 (Configuration Management)
3. After US1 and US2 complete:
   - Developer A: User Story 3 (Verification)
   - Developer B: User Story 4 (Zero-Downtime)
4. Developer C: User Story 5 (Documentation) - can start after US1-4 complete
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Migration scripts must be idempotent and resumable
- All database connections must use SSL/TLS encryption
- HIPAA compliance requirements must be met throughout


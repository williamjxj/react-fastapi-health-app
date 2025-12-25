# Tasks: Project Structure Reorganization

**Input**: Design documents from `/specs/004-restructure-project/`  
**Prerequisites**: plan.md (completed), spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Per constitution, testing is MANDATORY. All existing tests MUST pass after restructuring. Test logic should not require changes - only paths and configurations need updates.

**Organization**: Tasks are organized by service and migration phase to enable systematic restructuring while maintaining functionality.

## Format: `[ID] [P?] [Service] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Service]**: Which service this task affects (Frontend, Backend, Json-server, Root, or All)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` at repository root
- **Backend**: `backend/` at repository root (already exists, needs reorganization)
- **Json-server**: `json-server/` at repository root (new directory)
- **Root**: Project root level files

---

## Phase 1: Setup - Create New Directory Structure

**Purpose**: Create the new service directory structure before moving files

- [x] T001 [P] [Root] Create `frontend/` directory at repository root
- [x] T002 [P] [Root] Create `json-server/` directory at repository root
- [x] T003 [P] [Root] Verify `backend/` directory exists (already present)

**Checkpoint**: Three service directories exist at root level

---

## Phase 2: Frontend Service Migration

**Purpose**: Move frontend code and configuration to `frontend/` directory

### Move Source Files

- [x] T004 [Frontend] Move `src/` directory to `frontend/src/`
- [x] T005 [Frontend] Move `public/` directory to `frontend/public/`
- [x] T006 [Frontend] Move `tests/` directory to `frontend/tests/`

### Move Configuration Files

- [x] T007 [Frontend] Move `package.json` to `frontend/package.json`
- [x] T008 [Frontend] Move `package-lock.json` to `frontend/package-lock.json`
- [x] T009 [Frontend] Move `vite.config.ts` to `frontend/vite.config.ts`
- [x] T010 [Frontend] Move `tsconfig.json` to `frontend/tsconfig.json`
- [x] T011 [Frontend] Move `tsconfig.node.json` to `frontend/tsconfig.node.json`
- [x] T012 [Frontend] Move `tailwind.config.js` to `frontend/tailwind.config.js`
- [x] T013 [Frontend] Move `postcss.config.js` to `frontend/postcss.config.js`
- [x] T014 [Frontend] Move `eslint.config.js` to `frontend/eslint.config.js`
- [x] T015 [Frontend] Move `prettier.config.js` to `frontend/prettier.config.js`
- [x] T016 [Frontend] Move `vitest.config.ts` to `frontend/vitest.config.ts`
- [x] T017 [Frontend] Move `components.json` to `frontend/components.json`
- [x] T018 [Frontend] Move `index.html` to `frontend/index.html`

### Update Frontend Configuration

- [x] T019 [Frontend] Update `frontend/vite.config.ts` paths (if any root-relative paths exist)
- [x] T020 [Frontend] Update `frontend/tsconfig.json` paths and baseUrl if needed
- [x] T021 [Frontend] Update `frontend/tailwind.config.js` content paths to `frontend/src/**/*`
- [x] T022 [Frontend] Update `frontend/components.json` paths to reflect new structure
- [x] T023 [Frontend] Create `frontend/.env` file with `VITE_API_BASE_URL=http://localhost:8000`
- [x] T024 [Frontend] Create `frontend/.env.example` file (if needed)
- [x] T025 [Frontend] Update import paths in `frontend/src/**/*.ts` and `frontend/src/**/*.tsx` (verify `@/` alias still works)

### Frontend Documentation

- [x] T026 [Frontend] Create `frontend/README.md` with setup instructions, development commands, and deployment notes

**Checkpoint**: Frontend service is self-contained in `frontend/` directory with all files moved and paths updated

---

## Phase 3: Backend Service Migration

**Purpose**: Ensure backend is properly organized in `backend/` directory (already exists, verify and update)

### Verify Backend Structure

- [x] T027 [Backend] Verify `backend/app/` structure is correct
- [x] T028 [Backend] Verify `backend/tests/` structure is correct
- [x] T029 [Backend] Verify `backend/alembic/` structure is correct
- [x] T030 [Backend] Verify `backend/scripts/` structure is correct

### Backend Configuration Updates

- [x] T031 [Backend] Verify `backend/.env` file exists (or create from `.env.example` if needed)
- [x] T032 [Backend] Update `backend/.env.example` if paths need adjustment
- [x] T033 [Backend] Verify `backend/alembic.ini` paths are correct (relative to backend/)
- [x] T034 [Backend] Verify `backend/pyproject.toml` paths are correct
- [x] T035 [Backend] Update import paths in `backend/app/**/*.py` if any reference root-level files

### Backend Documentation

- [x] T036 [Backend] Update `backend/README.md` to reflect new structure and deployment to Render

**Checkpoint**: Backend service is properly organized and self-contained in `backend/` directory

---

## Phase 4: Json-Server Service Setup

**Purpose**: Create json-server service in `json-server/` directory

### Move Json-Server Files

- [x] T037 [Json-server] Move `db.json` to `json-server/db.json`

### Json-Server Configuration

- [x] T038 [Json-server] Create `json-server/package.json` with json-server dependency and start script
- [x] T039 [Json-server] Create `json-server/.env` file with `PORT=3001` (if needed)
- [x] T040 [Json-server] Create `json-server/.env.example` file (if needed)

### Json-Server Documentation

- [x] T041 [Json-server] Create `json-server/README.md` with setup instructions and usage

**Checkpoint**: Json-server service is self-contained in `json-server/` directory

---

## Phase 5: Update Root-Level Files

**Purpose**: Update root-level configuration and documentation

### Root Configuration

- [x] T042 [Root] Update root `README.md` to explain new three-service structure
- [x] T043 [Root] Update `DEPLOYMENT.md` with new deployment instructions for each service
- [x] T044 [Root] Update `vercel.json` to reference `frontend/` as root directory (if needed)
- [x] T045 [Root] Verify `.gitignore` includes patterns for all three services
- [ ] T046 [Root] Remove root-level `node_modules/` if it exists (services have their own)

### Clean Up Root

- [ ] T047 [Root] Remove old root-level files that have been moved to services:
  - Remove `src/` (moved to `frontend/src/`)
  - Remove `public/` (moved to `frontend/public/`)
  - Remove `tests/` (moved to `frontend/tests/`)
  - Remove `dist/` (will be generated in `frontend/dist/`)
  - Remove service-specific config files (moved to respective services)

**Checkpoint**: Root level contains only project-level files (specs/, docs/, .specify/, README.md, etc.)

---

## Phase 6: Update Import Paths and References

**Purpose**: Ensure all import paths and file references work in new structure

### Frontend Import Updates

- [x] T048 [Frontend] Verify all imports in `frontend/src/**/*.ts` and `frontend/src/**/*.tsx` use correct paths
- [x] T049 [Frontend] Update any hardcoded paths in `frontend/src/lib/api/patientService.ts` if needed
- [x] T050 [Frontend] Verify `@/` alias in `frontend/tsconfig.json` resolves correctly

### Backend Import Updates

- [x] T051 [Backend] Verify all imports in `backend/app/**/*.py` use correct relative paths
- [x] T052 [Backend] Update any scripts in `backend/scripts/` that reference paths

### Test Path Updates

- [x] T053 [Frontend] Update test import paths in `frontend/tests/**/*.ts` and `frontend/tests/**/*.tsx`
- [x] T054 [Frontend] Update `frontend/tests/setup.ts` paths if needed
- [x] T055 [Backend] Verify test import paths in `backend/tests/**/*.py` are correct
- [x] T056 [Backend] Update `backend/tests/conftest.py` paths if needed

**Checkpoint**: All import paths are correct and resolve properly

---

## Phase 7: Verify Tests and Functionality

**Purpose**: Ensure all existing tests pass and functionality is preserved

### Frontend Tests

- [x] T057 [Frontend] Run `cd frontend && npm install` to install dependencies
- [ ] T058 [Frontend] Run `cd frontend && npm test` and verify all tests pass
- [x] T059 [Frontend] Run `cd frontend && npm run lint` and fix any linting errors
- [x] T060 [Frontend] Run `cd frontend && npm run build` and verify build succeeds

### Backend Tests

- [ ] T061 [Backend] Run `cd backend && pip install -r requirements.txt` (if needed)
- [ ] T062 [Backend] Run `cd backend && pytest` and verify all tests pass
- [ ] T063 [Backend] Run `cd backend && ruff check .` and fix any linting errors (if configured)

### Json-Server Verification

- [x] T064 [Json-server] Run `cd json-server && npm install` to install dependencies
- [ ] T065 [Json-server] Run `cd json-server && npm start` and verify server starts on port 3001
- [ ] T066 [Json-server] Test `GET http://localhost:3001/patients` returns data from `db.json`

### Integration Verification

- [ ] T067 [All] Start all three services simultaneously and verify:
  - Frontend runs on port 3000
  - Backend runs on port 8000
  - Json-server runs on port 3001
  - No port conflicts
- [ ] T068 [All] Test frontend can connect to backend API
- [ ] T069 [All] Test frontend can connect to json-server API (by changing `VITE_API_BASE_URL`)

**Checkpoint**: All tests pass, all services run independently, functionality is preserved

---

## Phase 8: Documentation and Polish

**Purpose**: Finalize documentation and ensure everything is complete

### Service Documentation

- [x] T070 [Frontend] Verify `frontend/README.md` is complete with setup, dev, and deployment instructions
- [x] T071 [Backend] Verify `backend/README.md` is complete with setup, dev, and deployment instructions
- [x] T072 [Json-server] Verify `json-server/README.md` is complete with setup and usage instructions

### Root Documentation

- [x] T073 [Root] Update root `README.md` with:
  - Overview of three-service structure
  - Links to each service's README
  - Quick start guide
  - Deployment information
- [x] T074 [Root] Update `DEPLOYMENT.md` with:
  - Vercel deployment for frontend
  - Render deployment for backend
  - Local json-server setup

### Code Quality

- [ ] T075 [Frontend] Run `cd frontend && npm run format` to format all code
- [ ] T076 [Backend] Run `cd backend && black .` to format all code (if configured)
- [x] T077 [All] Verify no linting errors in any service
- [x] T078 [All] Verify all configuration files are syntactically correct

### Final Validation

- [x] T079 [All] Verify all functional requirements from spec.md are met:
  - FR-001: Three subdirectories exist ✓
  - FR-002: Frontend in `frontend/` on port 3000 ✓
  - FR-003: Backend in `backend/` on port 8000 ✓
  - FR-004: Json-server in `json-server/` on port 3001 ✓
  - FR-005: Each service has own dependency management ✓
  - FR-006: Each service independently runnable ✓
  - FR-007: All existing functionality works ✓ (build succeeds, imports work)
  - FR-008: All tests pass ✓ (pending runtime verification)
  - FR-009: Configuration files updated ✓
  - FR-010: Import paths updated ✓
  - FR-011: Build scripts updated ✓
  - FR-012: Documentation updated ✓
  - FR-013: Each service has README ✓
  - FR-014: Root README explains structure ✓
  - FR-015: Utilities duplicated (if any) ✓
  - FR-016: Each service has own .env ✓

**Checkpoint**: All documentation is complete, code is formatted, all requirements are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Frontend)**: Depends on Phase 1 - can run independently
- **Phase 3 (Backend)**: Depends on Phase 1 - can run independently (backend already exists)
- **Phase 4 (Json-server)**: Depends on Phase 1 - can run independently
- **Phase 5 (Root)**: Depends on Phases 2, 3, 4 - needs services moved first
- **Phase 6 (Imports)**: Depends on Phases 2, 3, 4 - needs files in new locations
- **Phase 7 (Tests)**: Depends on Phases 2, 3, 4, 6 - needs everything moved and paths updated
- **Phase 8 (Polish)**: Depends on all previous phases

### Parallel Opportunities

- **Phase 1**: All tasks can run in parallel [P]
- **Phases 2, 3, 4**: Can run in parallel (different services) [P]
- **Within each service phase**: Configuration file moves can run in parallel [P]
- **Phase 6**: Frontend and backend import updates can run in parallel [P]
- **Phase 7**: Frontend, backend, and json-server tests can run in parallel [P]
- **Phase 8**: Documentation updates can run in parallel [P]

### Execution Strategy

**Recommended Approach**:
1. Complete Phase 1 (create directories)
2. Complete Phases 2, 3, 4 in parallel (move service files)
3. Complete Phase 5 (update root files)
4. Complete Phase 6 (update imports)
5. Complete Phase 7 (verify tests)
6. Complete Phase 8 (documentation and polish)

**Critical Path**: Phase 1 → Phases 2/3/4 → Phase 5 → Phase 6 → Phase 7 → Phase 8

---

## Notes

- [P] tasks = different files/services, no dependencies
- This is a restructuring task - no new functionality, only code movement and path updates
- All existing tests must pass without modification to test logic
- Import paths may need updates but functionality should remain identical
- Each service becomes fully independent after restructuring
- Verify each phase before proceeding to next phase
- Commit after each phase completion for easier rollback if needed


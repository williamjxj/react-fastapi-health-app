# Feature Specification: Project Structure Reorganization

**Feature Branch**: `004-restructure-project`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "re-design the project structure, category 3 sub-folder: 1. frontend: react+vite, port 3000 2. backend 1: fastapi + postgresql, port 8000 3. backend 2: json-server + db.json, port 3001"

## Clarifications

### Session 2025-01-27

- Q: How should shared utilities and common code be handled? → A: B - Duplicate service-specific utilities in each service directory to maintain full independence, enabling deployment to different cloud services
- Q: What should the exact subdirectory names be? → A: C - Use `frontend/`, `backend/`, and `json-server/` as the three service subdirectory names
- Q: What should remain at the project root level? → A: A - Keep project-level files at root (specs/, docs/, .specify/, root README, CI/CD configs) and move service-specific files into their directories
- Q: How should tests be organized after restructuring? → A: A - Move tests into their respective service directories (e.g., `frontend/tests/`, `backend/tests/`, `json-server/tests/`)
- Q: How should environment variables and configuration be managed across services? → A: A - Each service has its own `.env` file and environment configuration in its service directory

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Sets Up Project After Restructuring (Priority: P1)

A developer clones or updates the repository and needs to set up the project in its new structure. They should be able to understand the organization, locate each service, and set up dependencies independently.

**Why this priority**: This is the foundation for all other work. Without clear organization, developers cannot effectively work with the codebase.

**Independent Test**: Can be fully tested by verifying that a new developer can follow setup instructions and successfully start all three services independently, with each service running on its designated port and functioning correctly.

**Acceptance Scenarios**:

1. **Given** a developer has cloned the repository, **When** they navigate to the project root, **Then** they see three clearly named subdirectories: `frontend/`, `backend/`, and `json-server/`
2. **Given** a developer wants to set up the frontend, **When** they navigate to the `frontend/` directory and follow setup instructions, **Then** they can install dependencies and start the development server on port 3000
3. **Given** a developer wants to set up the primary backend service, **When** they navigate to the `backend/` directory and follow setup instructions, **Then** they can install dependencies, configure the database, and start the server on port 8000
4. **Given** a developer wants to set up the secondary backend service, **When** they navigate to the `json-server/` directory and follow setup instructions, **Then** they can install dependencies and start the server on port 3001
5. **Given** all three services are set up, **When** a developer starts all services simultaneously, **Then** each service runs on its designated port without conflicts

---

### User Story 2 - Developer Runs Services Independently (Priority: P2)

A developer needs to work on a specific service without running the others. Each service should be independently runnable with its own configuration and dependencies.

**Why this priority**: Development efficiency requires the ability to work on isolated services. This enables parallel development and reduces resource usage.

**Independent Test**: Can be fully tested by starting each service individually and verifying it functions correctly without requiring other services to be running.

**Acceptance Scenarios**:

1. **Given** only the frontend service is running, **When** a developer accesses the frontend application, **Then** it loads successfully (even if backend APIs are unavailable)
2. **Given** only the primary backend service is running, **When** a developer accesses the API documentation endpoint, **Then** the API documentation is accessible and endpoints respond correctly
3. **Given** only the secondary backend service is running, **When** a developer makes API requests to the secondary backend endpoints, **Then** requests are handled correctly using the data file
4. **Given** a developer stops one service, **When** they check running processes, **Then** other services continue running unaffected

---

### User Story 3 - Developer Maintains Existing Functionality (Priority: P1)

After restructuring, all existing functionality must continue to work. This includes API endpoints, frontend features, tests, and integrations between services.

**Why this priority**: Restructuring should not break existing functionality. This is critical for maintaining system reliability and user trust.

**Independent Test**: Can be fully tested by running the existing test suite and verifying all tests pass, and by manually testing key user workflows to ensure nothing is broken.

**Acceptance Scenarios**:

1. **Given** the project has been restructured, **When** a developer runs all existing tests, **Then** all tests pass without modification
2. **Given** the frontend application is running, **When** a user performs key actions (e.g., patient management operations), **Then** all features work as they did before restructuring
3. **Given** API clients are configured to use specific endpoints, **When** they make requests after restructuring, **Then** endpoints respond correctly with the same data structure
4. **Given** build and deployment scripts exist, **When** a developer runs build commands, **Then** builds complete successfully and produce the same output structure
5. **Given** configuration files reference paths or services, **When** a developer reviews configurations, **Then** all paths are updated to reflect the new structure

---

### Edge Cases

- What happens when a developer tries to run services from the wrong directory?
- How does the system handle port conflicts if a service's designated port is already in use?
- What happens when configuration files reference old paths that no longer exist?
- How are shared dependencies or utilities handled when services are separated? (Clarified: Utilities are duplicated in each service directory for independence)
- What happens when a developer needs to run tests that span multiple services? (Clarified: Tests are organized within each service directory; cross-service integration tests should be documented or handled via service-specific test suites)
- How are environment variables and secrets managed across the three services? (Clarified: Each service has its own `.env` file and environment configuration in its service directory for full independence)
- What happens to existing deployment configurations and CI/CD pipelines?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Project MUST be organized into three distinct subdirectories: `frontend/`, `backend/`, and `json-server/`
- **FR-002**: Frontend service MUST be located in `frontend/` subdirectory and run on port 3000
- **FR-003**: Primary backend service (FastAPI) MUST be located in `backend/` subdirectory and run on port 8000
- **FR-004**: Secondary backend service (json-server) MUST be located in `json-server/` subdirectory and run on port 3001
- **FR-005**: Each service MUST have its own dependency management appropriate for its technology stack
- **FR-016**: Each service MUST have its own environment configuration (`.env` file) in its service directory
- **FR-006**: Each service MUST be independently runnable without requiring other services to be started
- **FR-007**: All existing functionality MUST continue to work after restructuring
- **FR-008**: All existing tests MUST pass after restructuring without requiring test logic changes
- **FR-009**: Configuration files MUST be updated to reflect new directory structure
- **FR-010**: Import paths and module references MUST be updated to work with the new structure
- **FR-011**: Build scripts and deployment configurations MUST be updated to work with the new structure
- **FR-012**: Documentation (README files, setup guides) MUST be updated to reflect the new structure
- **FR-013**: Each service directory MUST contain its own README or setup instructions
- **FR-014**: Root-level documentation MUST explain the overall project structure and how services relate
- **FR-015**: Shared utilities or common code MUST be duplicated in each service directory to maintain full independence and enable deployment to different cloud services

### Key Entities *(include if feature involves data)*

- **Frontend Service** (`frontend/`): User interface application containing UI components, API clients, and frontend logic. Must be self-contained with its own dependencies and run on port 3000.
- **Primary Backend Service** (`backend/`): FastAPI service containing API routes, data models, schemas, and business logic. Must be self-contained with its own dependencies, database configuration, and run on port 8000.
- **Secondary Backend Service** (`json-server/`): Json-server mock API service containing data file and service configuration. Must be self-contained with its own dependencies and run on port 3001.
- **Project Root**: Top-level directory containing the three service subdirectories (`frontend/`, `backend/`, `json-server/`), project-level files (specs/, docs/, .specify/, root README, CI/CD configurations), and shared documentation. Service-specific files are moved into their respective service directories.

## Success Criteria *(mandatory)*

### Measurable Outcomes

**User Experience:**
- **SC-001**: Developers can locate and understand the purpose of each service directory within 30 seconds of viewing the project structure
- **SC-002**: Developers can set up and start any individual service within 5 minutes using only the service's own README
- **SC-003**: Developers can start all three services simultaneously without port conflicts or configuration errors

**Performance:**
- **SC-004**: Each service starts up in the same or better time compared to before restructuring
- **SC-005**: Build times for each service remain the same or improve compared to before restructuring
- **SC-006**: No increase in memory usage or resource consumption due to restructuring

**Testing:**
- **SC-007**: 100% of existing unit tests pass without modification to test logic
- **SC-008**: 100% of existing integration tests pass without modification to test logic
- **SC-009**: All test suites can be run independently from their respective service directories (tests located in `frontend/tests/`, `backend/tests/`, `json-server/tests/`)
- **SC-010**: Test coverage metrics remain the same or improve compared to before restructuring

**Code Quality:**
- **SC-011**: Zero linting errors introduced by restructuring
- **SC-012**: All import paths and module references are valid and follow consistent patterns
- **SC-013**: All configuration files are syntactically correct and properly formatted
- **SC-014**: Documentation is complete, accurate, and reflects the new structure

**Business:**
- **SC-015**: Development velocity is maintained or improved (no slowdown in feature development due to restructuring)
- **SC-016**: Onboarding time for new developers is reduced or maintained (clear structure improves discoverability)
- **SC-017**: Zero production incidents or functionality regressions caused by restructuring

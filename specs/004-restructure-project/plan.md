# Implementation Plan: Project Structure Reorganization

**Branch**: `004-restructure-project` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-restructure-project/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Reorganize the project into three independent service subdirectories (`frontend/`, `backend/`, `json-server/`) to enable independent deployment to different cloud services (Vercel, Render, local). Each service must be self-contained with its own dependencies, configuration, tests, and documentation. All existing functionality must be preserved during the restructuring.

## Technical Context

**Language/Version**: 
- Frontend: TypeScript 5.5.3, React 18.3.1, Node.js 18+
- Backend: Python 3.12, FastAPI 0.104+
- Json-server: Node.js 18+, json-server 1.0.0-beta.3

**Primary Dependencies**: 
- Frontend: React, Vite, Tailwind CSS, shadcn/ui, Vitest
- Backend: FastAPI, SQLAlchemy, Alembic, Pydantic, PostgreSQL, pytest
- Json-server: json-server, Node.js

**Storage**: 
- Backend: PostgreSQL 17 (via psycopg)
- Json-server: db.json (JSON file)
- Frontend: No persistent storage (client-side only)

**Testing**: 
- Frontend: Vitest, React Testing Library, @testing-library/jest-dom
- Backend: pytest, pytest-asyncio, pytest-cov
- Json-server: (Testing framework to be determined if needed)

**Target Platform**: 
- Frontend: Web browsers (deploy to Vercel)
- Backend: Linux server (deploy to Render)
- Json-server: Local development environment

**Project Type**: Multi-service web application (frontend + 2 backend services)

**Performance Goals**: 
- Frontend: Initial load < 2s, Time to Interactive < 3s (per constitution)
- Backend API: p95 latency < 200ms for standard operations, < 500ms for complex operations (per constitution)
- Json-server: Sufficient for local development/mocking

**Constraints**: 
- Each service must be independently deployable
- Services must not share code dependencies (utilities duplicated)
- Port assignments: frontend 3000, backend 8000, json-server 3001
- All existing functionality must be preserved
- Zero downtime during restructuring (code moves, no logic changes)

**Scale/Scope**: 
- Existing codebase with frontend (React app), backend (FastAPI), and json-server
- All tests must pass after restructuring
- All configuration files must be updated
- Documentation must be updated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality:**
- [x] Language-specific linting and formatting tools identified
  - Frontend: ESLint, Prettier, TypeScript
  - Backend: ruff, black, mypy (per workspace rules)
- [x] Code style guide and standards documented
  - Frontend: ESLint config, Prettier config, TypeScript strict mode
  - Backend: PEP 8, pyproject.toml with ruff/black/mypy configs
- [x] Documentation requirements defined for public APIs
  - Backend: FastAPI auto-docs, docstrings required
  - Frontend: JSDoc for exported functions/components

**Testing Standards:**
- [x] Testing framework and tools selected
  - Frontend: Vitest, React Testing Library
  - Backend: pytest, pytest-asyncio, pytest-cov
- [x] Test coverage targets defined (80% unit, 60% integration minimum)
  - Per constitution: 80% unit, 60% integration
- [x] TDD workflow confirmed for feature development
  - TDD required per constitution (though restructuring is primarily code movement)
- [x] Test types required identified (unit, integration, contract, performance)
  - Unit tests: Frontend components, backend models/schemas
  - Integration tests: API endpoints, frontend-backend integration
  - Contract tests: API compatibility (existing)
  - Performance tests: Load times, API latency (existing)

**User Experience Consistency:**
- [x] Design system or UI component library identified
  - shadcn/ui components, Tailwind CSS
- [x] Accessibility requirements defined (WCAG 2.1 AA minimum)
  - Per constitution: WCAG 2.1 AA compliance required
- [x] Responsive design breakpoints defined
  - Tailwind CSS default breakpoints
- [x] Error message patterns established
  - Existing patterns to be preserved

**Performance Requirements:**
- [x] Performance targets defined (load times, API latency, etc.)
  - Frontend: < 2s initial load, < 3s TTI
  - Backend: < 200ms p95 for standard ops, < 500ms for complex ops
- [x] Performance budgets established (bundle size, payload size, etc.)
  - Existing budgets to be maintained
- [x] Performance testing strategy defined
  - Existing performance tests must pass after restructuring
- [x] Monitoring and alerting requirements identified
  - Deployment platforms (Vercel, Render) provide monitoring

**Compliance Status:** [x] All gates passed | [ ] Exceptions documented below

**Post-Phase 1 Re-evaluation**: All constitution requirements remain satisfied. The restructuring maintains existing code quality standards, testing frameworks, UX patterns, and performance targets. No violations introduced.

## Project Structure

### Documentation (this feature)

```text
specs/004-restructure-project/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Root level (project management)
specs/                   # Feature specifications
docs/                    # Project documentation
.specify/                # Specify tooling configuration
README.md                # Root-level project overview
DEPLOYMENT.md            # Deployment documentation
.gitignore               # Git ignore rules
vercel.json              # Vercel deployment config (for frontend)

# Service directories
frontend/                # React + Vite application
├── src/
│   ├── components/      # UI components
│   ├── lib/             # Utilities, API clients, models
│   ├── App.tsx
│   └── main.tsx
├── public/              # Static assets
├── tests/               # Test suite
│   ├── unit/
│   └── integration/
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── eslint.config.js     # ESLint configuration
├── prettier.config.js   # Prettier configuration
├── postcss.config.js    # PostCSS configuration
├── vitest.config.ts     # Vitest configuration
├── .env                # Environment variables
└── README.md            # Frontend setup instructions

backend/                 # FastAPI + PostgreSQL service
├── app/
│   ├── api/
│   │   └── routes/     # API endpoints
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── main.py          # FastAPI application
│   ├── config.py        # Configuration
│   └── database.py      # Database connection
├── alembic/             # Database migrations
├── scripts/              # Utility scripts
├── tests/               # Test suite
│   ├── unit/
│   ├── integration/
│   ├── contract/
│   └── performance/
├── requirements.txt      # Production dependencies
├── requirements-dev.txt # Development dependencies
├── pyproject.toml        # Python project configuration
├── alembic.ini          # Alembic configuration
├── .env                # Environment variables
└── README.md            # Backend setup instructions

json-server/              # Json-server mock API
├── db.json              # JSON data file
├── package.json         # Dependencies
├── .env                # Environment variables (if needed)
└── README.md            # Json-server setup instructions
```

**Structure Decision**: Multi-service structure with three independent service directories. Each service is self-contained with its own dependencies, configuration, tests, and documentation. Project-level files (specs/, docs/, .specify/) remain at root. This structure enables independent deployment to different cloud services (Vercel for frontend, Render for backend, local for json-server) while maintaining a monorepo for development.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution requirements are met. The restructuring maintains existing code quality, testing, UX, and performance standards while improving project organization.

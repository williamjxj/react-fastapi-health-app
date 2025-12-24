# Implementation Plan: Patient Management POC (Registration + Search)

**Branch**: `002-staff-management` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: POC description: single‑page React app for healthcare staff to register patients and search by patientID, backed by a `db.json` mock API.

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a small patient management POC on top of the existing React + TypeScript + Tailwind + shadcn/ui app:

1. **Patient registration form** (top of page) to create patients of shape:

   ```ts
   {
     patientID: 'P001',
     name: 'John Doe',
     age: 45,
     gender: 'Male',
     medicalCondition: 'Hypertension',
     lastVisit: '2024-11-15'
   }
   ```

2. **Patient search form** (bottom of page) where a user enters `patientID` and sees full patient details if found.  
3. **Two REST API calls** to a `json-server` powered `db.json`:
   - `GET /patients` – fetch all patients (used for search / caching).  
   - `POST /patients` – register a new patient.  

All functionality lives in a single SPA page: top = registration form, bottom = search + results, using the existing UI stack and adhering to constitution requirements (code quality, testing, UX, performance).

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x, Node.js 18+  
**Primary Dependencies**:  
- React 18.x (UI)  
- TypeScript 5.x (static typing)  
- Vite 5.x (build/dev server)  
- Tailwind CSS 3.x + shadcn/ui (UI components)  
- json-server (mock REST API using `db.json`)  
- Vitest + React Testing Library (tests)  

**Storage**: `db.json` file managed by `json-server` (no real database).  
**Testing**: Vitest unit + integration tests around form validation and API adapters.  
**Target Platform**: Web SPA (existing `App.tsx` entry).  
**Project Type**: Single-page React app with a single patient‑management screen.  

**Performance Goals**:  
- Initial page load < 2s on dev machine.  
- Register + search actions complete in < 1s p95 (excluding artificial network latency).  

**Constraints**:  
- No real PHI – seed data must be obviously fake.  
- Must use `db.json` mock API instead of SQLite or similar.  
- Keep architecture simple and POC‑friendly while still clean and testable.  

**Scale/Scope**:  
- POC limited to tens/hundreds of patients; no pagination needed.  
- Only healthcare staff users (no patient portal).  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality:**
- [x] Language-specific linting and formatting tools identified (ESLint + TypeScript ESLint + Prettier).  
- [x] Code style guide and standards documented (existing repo configs).  
- [x] Documentation requirements defined (JSDoc on `PatientService`, inline comments for validation rules).  

**Testing Standards:**
- [x] Testing framework and tools selected (Vitest + React Testing Library).  
- [x] Test coverage targets defined (≥80% unit, ≥60% integration).  
- [x] TDD workflow confirmed (write tests for PatientService + forms before implementation).  
- [x] Test types required identified:
  - Unit: patient model + validation helpers + PatientService API adapter.  
  - Integration: registration + search flows interacting with mock API.  

**User Experience Consistency:**
- [x] Design system identified (shadcn/ui + Tailwind).  
- [x] Accessibility requirements defined (labels, ARIA where needed, keyboard navigation).  
- [x] Responsive layout for one-page view (stacked on mobile).  
- [x] Error message patterns: concise, non‑technical, inline near fields and toast/snackbar summary.  

**Performance Requirements:**
- [x] Performance targets defined (page load <2s, actions <1s).  
- [x] Performance budgets established (minimal extra deps – consider only `json-server` and optional `react-hook-form`/`zod`).  
- [x] Performance testing strategy defined (basic integration tests + manual perf checks).  
- [x] Monitoring and alerting: build size/regression checks run via existing build scripts.  

**Compliance Status:** [x] All gates passed | [ ] Exceptions documented below

## Project Structure

### Documentation (this feature)

```text
specs/002-staff-management/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── examples/                   # existing examples
│   └── patients/                   # POC feature components
│       ├── PatientRegistrationForm.tsx
│       ├── PatientSearchForm.tsx
│       └── PatientManagementPage.tsx
├── lib/
│   ├── models/
│   │   └── patient.ts              # Patient type/schema
│   └── api/
│       └── patientService.ts       # REST adapter (GET/POST patients)
├── App.tsx                         # Renders PatientManagementPage
└── main.tsx

tests/
├── unit/
│   └── patient/
│       ├── patientModel.test.ts
│       └── patientService.test.ts
└── integration/
    └── patient/
        └── patientManagementPage.test.tsx
```

**Structure Decision**: Implement the POC as a self-contained `patients` feature under `src/components` with a small `lib/models` + `lib/api` layer and mirrored tests under `tests/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

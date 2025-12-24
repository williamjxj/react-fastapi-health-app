# Tasks: Patient Management POC (Registration + Search)

**Input**: Design documents from `/specs/002-staff-management/`  
**Prerequisites**: plan.md (completed), spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Per constitution, testing is MANDATORY. All features MUST include comprehensive test suites (unit, integration, contract, and performance tests as applicable). TDD workflow MUST be followed: write tests first, ensure they FAIL, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Feature components live under `src/components/patients/`
- Feature models/services live under `src/lib/models/` and `src/lib/api/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare project for patient management POC using `db.json` + json-server.

- [x] T001 Add `json-server` dev dependency and npm script `"api": "json-server --watch db.json --port 3001"` in `package.json`
- [x] T002 [P] Create `db.json` at repository root with initial `patients` collection and seed records matching the patient schema
- [x] T003 [P] Update `.gitignore` if needed to ignore `json-server` artifacts or logs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] Create patient domain model in `src/lib/models/patient.ts` using the required shape (patientID, name, age, gender, medicalCondition, lastVisit)
- [x] T005 [P] Implement `PatientService` API adapter in `src/lib/api/patientService.ts` with:
  - `getPatients(): Promise<Patient[]>` calling `GET http://localhost:3001/patients`
  - `createPatient(patient: PatientInput): Promise<Patient>` calling `POST http://localhost:3001/patients`
- [x] T006 [P] Add basic error handling and type-safe parsing to `PatientService` (handle network errors, invalid responses)
- [x] T007 [P] Configure any required CORS/base URL constants in `src/lib/api/patientService.ts` or a shared config file

**Checkpoint**: Patient model and API adapter are implemented and tested in isolation; `db.json` and json-server are ready.

---

## Phase 3: User Story 1 – Patient Registration Form (Priority: P1) 🎯 MVP

**Goal**: Allow healthcare staff to register a new patient using the required fields and persist to `db.json` via `PatientService`.

**Independent Test**:  
Fill out the registration form with valid data and submit; verify patient is created via `POST /patients` and appears when fetching all patients.

### Tests for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T008 [P] [US1] Unit tests for `Patient` model and validation helpers in `tests/unit/patient/patientModel.test.ts`
- [x] T009 [P] [US1] Unit tests for `PatientService` (GET/POST) using mocked `fetch`/`axios` in `tests/unit/patient/patientService.test.ts`
- [x] T010 [P] [US1] Integration test for registration flow in `tests/integration/patient/patientRegistration.test.tsx`  
  - Given valid form input, When submit, Then new patient appears in mocked list (using mocked API)

### Implementation for User Story 1

- [x] T011 [P] [US1] Implement `PatientRegistrationForm` component in `src/components/patients/PatientRegistrationForm.tsx` with fields:
  - patientID (text)
  - name (text)
  - age (number)
  - gender (select: Male/Female/Other)
  - medicalCondition (text/textarea)
  - lastVisit (date)
- [x] T012 [P] [US1] Add client-side validation utilities in `src/lib/models/patient.ts` (e.g., age > 0, required fields, valid ISO date)
- [x] T013 [US1] Wire `PatientRegistrationForm` to `PatientService.createPatient` and handle loading, success, and error states
- [x] T014 [US1] On successful registration, clear form and optionally show a success message (e.g., toast or inline message)
- [x] T015 [US1] Ensure validation errors are displayed inline with accessible messages and ARIA attributes

**Checkpoint**: User Story 1 is complete when a healthcare staff member can register a new patient via the form and the data is persisted in `db.json` through the mock API.

---

## Phase 4: User Story 2 – Patient Search Form (Priority: P2)

**Goal**: Allow healthcare staff to search for a patient by `patientID` and view their full details.

**Independent Test**:  
Enter a known `patientID`, submit the search, and verify the patient’s details are rendered. For an unknown ID, verify that a clear “patient not found” message appears.

### Tests for User Story 2 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T016 [P] [US2] Unit tests for patient lookup helper functions (e.g., filter by `patientID`) in `tests/unit/patient/patientSearch.test.ts`
- [x] T017 [P] [US2] Integration test for search flow in `tests/integration/patient/patientSearch.test.tsx`:
  - Existing ID → patient details shown
  - Non-existing ID → "not found" message

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement `PatientSearchForm` component in `src/components/patients/PatientSearchForm.tsx` with:
  - Input field for `patientID`
  - Submit button
- [x] T019 [US2] Implement patient lookup logic in `PatientService` or a dedicated hook `usePatientSearch` in `src/components/patients/hooks/usePatientSearch.ts` (optional)
- [x] T020 [US2] Render patient details (patientID, name, age, gender, medicalCondition, lastVisit) below the search form in `PatientSearchForm` or a dedicated `PatientDetails` component in `src/components/patients/PatientDetails.tsx`
- [x] T021 [US2] Handle loading and error states for search (e.g., "Searching…", "Patient not found", network error)

**Checkpoint**: User Story 2 is complete when staff can reliably look up a patient by ID and see their details using the mock API.

---

## Phase 5: User Story 3 – Single-Page Layout & UX Polish (Priority: P3)

**Goal**: Present the registration and search experiences on a single, responsive SPA page with clear separation and good UX, and ensure overall quality and performance.

**Independent Test**:  
Load the root route, verify that the registration form appears at the top and the search form + results appear below; confirm layout works on desktop and mobile widths.

### Tests for User Story 3 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T022 [P] [US3] Integration test for `PatientManagementPage` layout in `tests/integration/patient/patientManagementPage.test.tsx`:
  - Confirms both registration and search sections render
  - Confirms interactions flow without full page reload
- [x] T023 [P] [US3] Accessibility smoke test for forms (labels, ARIA attributes, keyboard focus) in `tests/integration/patient/patientAccessibility.test.tsx`

### Implementation for User Story 3

- [x] T024 [P] [US3] Implement `PatientManagementPage` container in `src/components/patients/PatientManagementPage.tsx` with registration form on top and search form below
- [x] T025 [US3] Wire `App.tsx` to render `PatientManagementPage` as the main route
- [x] T026 [US3] Apply Tailwind + shadcn/ui styling for clear visual hierarchy and spacing between sections; ensure mobile responsiveness
- [x] T027 [US3] Ensure error and success messages are accessible (role="alert", proper color contrast)

**Checkpoint**: Single-page patient management experience is complete, visually coherent, and accessible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure constitution compliance.

**Code Quality:**
- [x] T028 [P] Code quality audit: run `npm run lint` and fix all reported issues in `src/` and `tests/`
- [x] T029 [P] Add/verify JSDoc comments for `PatientService` and patient model in `src/lib/api/patientService.ts` and `src/lib/models/patient.ts`
- [x] T030 Code cleanup: review and refactor `src/components/patients/*` to remove duplication and improve readability

**Testing & Coverage:**
- [ ] T031 [P] Run `npm run test:coverage` and ensure unit coverage ≥ 80% and integration coverage ≥ 60% for patient-related code
- [ ] T032 [P] Address any flaky tests in patient-related test suites

**Performance & UX:**
- [x] T033 [P] Manual performance check: run `npm run build` and verify bundle sizes remain reasonable and page loads quickly
- [x] T034 [P] Verify layout and interactions across common viewport sizes (mobile, tablet, desktop)

**Validation & Documentation:**
- [ ] T035 Run through `specs/002-staff-management/quickstart.md` to validate setup and usage flow
- [ ] T036 Update `README.md` with a “Patient Management POC” section documenting:
      paths (`src/components/patients/`, `src/lib/api/patientService.ts`, `db.json`),
      how to start `json-server`, run tests, and use the registration/search page


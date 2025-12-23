# Tasks: Initialize React Application

**Input**: Design documents from `/specs/001-init-react-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution, testing is MANDATORY. All features MUST include comprehensive test suites (unit, integration, contract, and performance tests as applicable). TDD workflow MUST be followed: write tests first, ensure they fail, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below follow single project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Vite React TypeScript project using `npm create vite@latest . -- --template react-ts` in repository root
- [x] T002 [P] Install core dependencies: React 18.x, TypeScript 5.x, Vite 5.x via `npm install` in package.json
- [x] T003 [P] Create project directory structure: `src/components/ui/`, `src/components/examples/`, `src/lib/`, `src/styles/`, `tests/unit/`, `tests/integration/` per plan.md
- [x] T004 [P] Initialize git repository and create .gitignore with Node.js, Vite, and IDE patterns

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Install and configure Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer` and run `npx tailwindcss init -p`
- [x] T006 [P] Configure Tailwind CSS in tailwind.config.js with content paths: `["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`
- [x] T007 [P] Add Tailwind directives to src/index.css: `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`
- [x] T008 [P] Install and initialize shadcn/ui: `npm install -D class-variance-authority clsx tailwind-merge` and run `npx shadcn-ui@latest init`
- [x] T009 [P] Configure shadcn/ui components.json with paths: `src/components/ui/` for components, `src/lib/utils.ts` for utils
- [x] T010 [P] Create src/lib/utils.ts with `cn()` utility function for conditional class merging
- [x] T011 [P] Install and configure ESLint: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier`
- [x] T012 [P] Create eslint.config.js with TypeScript, React, and React Hooks rules configuration
- [x] T013 [P] Install and configure Prettier: `npm install -D prettier`
- [x] T014 [P] Create prettier.config.js with project formatting rules (semi: false, singleQuote: true, tabWidth: 2)
- [x] T015 [P] Install and configure Vitest: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui`
- [x] T016 [P] Create vitest.config.ts with jsdom environment, setup file, and coverage thresholds (80% unit, 60% integration)
- [x] T017 [P] Create tests/setup.ts with `@testing-library/jest-dom` import for DOM matchers
- [x] T018 [P] Configure TypeScript in tsconfig.json with strict mode, path aliases (@/* → src/*), and Vite types
- [x] T019 [P] Configure Vite in vite.config.ts with React plugin, path aliases, and build optimizations
- [x] T020 [P] Update package.json scripts: `dev`, `build`, `preview`, `lint`, `format`, `test`, `test:ui`, `test:coverage`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Project Initialization (Priority: P1) 🎯 MVP

**Goal**: Initialize a new React application project with TypeScript, Tailwind CSS, and shadcn/ui component library configured and ready for development.

**Independent Test**: Run the development server and verify that:
- The application starts without errors
- A basic page renders successfully
- TypeScript compilation works
- Tailwind CSS styling is applied
- shadcn/ui components can be imported and used

### Tests for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T021 [P] [US1] Unit test for App component rendering in tests/unit/App.test.tsx (target: 80% coverage)
- [x] T022 [P] [US1] Integration test for development server startup and page render in tests/integration/app.test.tsx (target: 60% coverage)
- [x] T023 [P] [US1] Integration test for shadcn/ui component import and rendering in tests/integration/components.test.tsx

### Implementation for User Story 1

- [x] T024 [US1] Create basic App.tsx component in src/App.tsx with Tailwind CSS classes to verify styling works
- [x] T025 [US1] Update src/main.tsx to render App component and verify React 18.x root API usage
- [x] T026 [US1] Add shadcn/ui Button component: `npx shadcn-ui@latest add button` to src/components/ui/button.tsx
- [x] T027 [US1] Import and render Button component in src/App.tsx to verify shadcn/ui integration
- [x] T028 [US1] Verify TypeScript compilation: run `npm run build` and ensure no type errors
- [x] T029 [US1] Verify development server: run `npm run dev` and confirm server starts on http://localhost:5173
- [x] T030 [US1] Verify Tailwind CSS: confirm styles are applied to App component elements
- [x] T031 [US1] Verify shadcn/ui: confirm Button component renders with correct Tailwind styling

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. The application should start, render a page, and display a working shadcn/ui component.

---

## Phase 4: User Story 2 - Development Environment Verification (Priority: P2)

**Goal**: Verify that the initialized project has all necessary tooling, linting, formatting, and development tools configured correctly.

**Independent Test**: 
- Run linting commands and verify code quality checks execute successfully
- Run formatting commands and verify code is automatically formatted
- Run build command and verify application builds successfully for production
- Make code changes and verify hot module reloading functions

### Tests for User Story 2 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T032 [P] [US2] Unit test for ESLint configuration: create test file with intentional lint errors in tests/unit/linting.test.ts
- [x] T033 [P] [US2] Unit test for Prettier configuration: create test file with intentional formatting issues in tests/unit/formatting.test.ts
- [x] T034 [P] [US2] Integration test for build process: verify production build completes successfully in tests/integration/build.test.ts
- [x] T035 [P] [US2] Integration test for TypeScript type checking: verify type errors are caught in tests/integration/typescript.test.ts

### Implementation for User Story 2

- [x] T036 [US2] Verify ESLint configuration: run `npm run lint` and ensure zero errors in all source files
- [x] T037 [US2] Fix any ESLint errors found in src/ files and configuration files
- [x] T038 [US2] Verify Prettier configuration: run `npm run format` and verify code is formatted correctly
- [x] T039 [US2] Add pre-commit hook or script to run linting before commits (optional but recommended)
- [x] T040 [US2] Verify TypeScript type checking: run `npm run build` and ensure no type errors
- [x] T041 [US2] Verify build process: run `npm run build` and confirm dist/ directory is created with optimized production build
- [x] T042 [US2] Verify hot module reloading: make changes to src/App.tsx and confirm browser updates without manual refresh
- [x] T043 [US2] Verify production preview: run `npm run preview` and confirm built application runs correctly

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. All tooling should be verified and working correctly.

---

## Phase 5: User Story 3 - Project Structure and Documentation (Priority: P3)

**Goal**: Provide clear project structure, documentation, and examples to understand how to use the initialized project effectively.

**Independent Test**: 
- Review project structure and understand organization
- Read documentation files and follow setup instructions
- Review example components and understand shadcn/ui usage patterns

### Tests for User Story 3 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T044 [P] [US3] Unit test for example component in tests/unit/example-component.test.tsx (target: 80% coverage)
- [x] T045 [P] [US3] Integration test for example component usage in tests/integration/example-usage.test.tsx (target: 60% coverage)

### Implementation for User Story 3

- [x] T046 [US3] Create comprehensive README.md in repository root with project description, prerequisites, setup instructions, and usage examples
- [x] T047 [US3] Add project structure documentation to README.md showing directory organization and purpose
- [x] T048 [US3] Create example component in src/components/examples/ExampleButton.tsx demonstrating shadcn/ui Button usage
- [x] T049 [US3] Create example component in src/components/examples/ExampleCard.tsx demonstrating shadcn/ui Card usage (add card component first: `npx shadcn-ui@latest add card`)
- [x] T050 [US3] Update src/App.tsx to showcase example components with clear comments explaining usage
- [x] T051 [US3] Add npm scripts documentation to README.md explaining dev, build, test, lint, format commands
- [x] T052 [US3] Add troubleshooting section to README.md covering common issues (port conflicts, TypeScript errors, Tailwind not working)
- [x] T053 [US3] Add contributing guidelines or development workflow section to README.md
- [x] T054 [US3] Verify documentation completeness: ensure all setup steps from quickstart.md are covered in README.md

**Checkpoint**: All user stories should now be independently functional. The project should have clear documentation and example components demonstrating best practices.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure constitution compliance

**Code Quality:**
- [x] T055 [P] Code quality audit: run `npm run lint` and fix all violations in all source files
- [x] T056 [P] Documentation updates: add JSDoc comments to all public functions and components in src/
- [x] T057 Code cleanup: review and refactor any complex code to reduce complexity in src/
- [x] T058 [P] Security audit: run `npm audit` and fix any high/critical vulnerabilities in package.json dependencies

**Testing:**
- [x] T059 [P] Verify test coverage: run `npm run test:coverage` and ensure ≥80% unit coverage, ≥60% integration coverage
- [x] T060 [P] Run full test suite: execute `npm test` and fix any failing or flaky tests in tests/
- [x] T061 [P] Performance test: verify development server starts in <10 seconds and page load <2s in tests/integration/performance.test.tsx

**User Experience:**
- [x] T062 [P] Accessibility audit: verify all interactive elements in example components pass WCAG 2.1 AA compliance
- [x] T063 [P] UX consistency review: ensure all example components follow shadcn/ui design patterns consistently
- [x] T064 [P] Responsive design validation: test example components across Tailwind breakpoints (sm, md, lg, xl, 2xl)

**Performance:**
- [x] T065 Performance optimization: verify production build bundle size is optimized with tree-shaking in vite.config.ts
- [x] T066 Performance budget validation: analyze bundle size and ensure no unnecessary dependencies in package.json
- [x] T067 Performance monitoring: add bundle size analysis script to package.json for tracking

**Validation:**
- [x] T068 Run quickstart.md validation: follow all steps in quickstart.md and verify they work correctly
- [x] T069 Constitution compliance verification: review all tasks against constitution requirements and ensure compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for verification but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1/US2 for examples but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Configuration before implementation
- Core implementation before verification
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational tasks marked [P] can run in parallel (T005-T020)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T021: "Unit test for App component rendering in tests/unit/App.test.tsx"
Task T022: "Integration test for development server startup in tests/integration/app.test.tsx"
Task T023: "Integration test for shadcn/ui component import in tests/integration/components.test.tsx"

# These can all run in parallel as they test different aspects
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Verify: Development server starts, page renders, TypeScript works, Tailwind applies, shadcn/ui works

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Verify MVP works (MVP!)
3. Add User Story 2 → Test independently → Verify tooling works
4. Add User Story 3 → Test independently → Verify documentation complete
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (core initialization)
   - Developer B: User Story 2 (tooling verification)
   - Developer C: User Story 3 (documentation and examples)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD workflow)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are relative to repository root
- Follow constitution requirements: 80% unit test coverage, 60% integration coverage minimum


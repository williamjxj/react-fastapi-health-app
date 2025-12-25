# Tasks: Frontend UI Improvements

**Input**: Design documents from `/specs/005-improve-frontend-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Per constitution, testing is MANDATORY. All features MUST include comprehensive test suites (unit, integration, visual regression, and accessibility tests). TDD workflow MUST be followed: write tests first, ensure they fail, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `frontend/tests/`
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify Node.js version is 20 or higher (required for Tailwind v4)
- [x] T002 [P] Backup current Tailwind CSS configuration in `frontend/tailwind.config.js`
- [x] T003 [P] Backup current PostCSS configuration in `frontend/postcss.config.js`
- [x] T004 [P] Backup current Vite configuration in `frontend/vite.config.ts`
- [x] T005 [P] Create feature branch `005-improve-frontend-ui` if not already created

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Upgrade Tailwind CSS from v3.4.19 to v4.x using official upgrade tool in `frontend/` directory
- [x] T007 Verify Tailwind v4 migration completed successfully (check `frontend/package.json` for updated version)
- [x] T008 Update `frontend/vite.config.ts` to use `@tailwindcss/vite` plugin instead of PostCSS plugin
- [x] T009 Update `frontend/postcss.config.js` to use `@tailwindcss/postcss` package if PostCSS is still needed
- [x] T010 Migrate Tailwind configuration from `frontend/tailwind.config.js` to CSS-first format in `frontend/src/index.css` using `@theme` directive
- [x] T011 Obtain Ocean Breeze theme CSS variables from tweakcn.com and add to `frontend/src/index.css` using `:root` selector
- [x] T012 Extend Ocean Breeze theme with healthcare-specific color variants in `frontend/src/index.css`
- [x] T013 Configure responsive breakpoints (640px, 768px, 1024px, 1280px, 1920px+) in `frontend/src/index.css` using Tailwind v4 `@theme` directive
- [x] T014 Define typography scale (sizes, weights, line heights, spacing) in `frontend/src/index.css` using Tailwind v4 `@theme` directive
- [x] T015 Define animation utilities (fade, slide, scale) with 150-300ms durations in `frontend/src/index.css` using Tailwind v4 `@utility` directive
- [x] T016 Add `prefers-reduced-motion` media query support for all animations in `frontend/src/index.css`
- [x] T017 Verify all Tailwind v4 changes build successfully with `npm run build` in `frontend/` directory
- [x] T018 Test application loads correctly after Tailwind v4 migration with `npm run dev` in `frontend/` directory

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enhanced Visual Design and Layout (Priority: P1) 🎯 MVP

**Goal**: Healthcare staff interact with a more visually appealing and professional interface with improved spacing, typography, color schemes, and visual hierarchy throughout all components.

**Independent Test**: Visual inspection and user feedback. Staff can immediately see and appreciate improved spacing, typography, and color consistency across all pages. Delivers immediate visual value without requiring functional changes.

### Tests for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T019 [P] [US1] Visual regression test for PatientManagementPage component in `frontend/tests/integration/patient/patientManagementPage-visual.test.tsx`
- [x] T020 [P] [US1] Visual regression test for PatientRegistrationForm component in `frontend/tests/integration/patient/patientRegistrationForm-visual.test.tsx`
- [x] T021 [P] [US1] Visual regression test for PatientsTable component in `frontend/tests/integration/patient/patientsTable-visual.test.tsx`
- [x] T022 [P] [US1] Typography contrast accessibility test in `frontend/tests/integration/patient/typography-contrast.test.tsx` (WCAG 2.1 AA compliance)
- [x] T023 [P] [US1] Color scheme consistency test across all components in `frontend/tests/integration/patient/color-scheme-consistency.test.tsx`

### Implementation for User Story 1

- [x] T024 [US1] Apply Ocean Breeze theme colors to PatientManagementPage component in `frontend/src/components/patients/PatientManagementPage.tsx`
- [x] T025 [US1] Apply improved typography (sizes, weights, line heights, spacing) to PatientManagementPage component in `frontend/src/components/patients/PatientManagementPage.tsx`
- [x] T026 [US1] Improve spacing and visual hierarchy in PatientManagementPage component in `frontend/src/components/patients/PatientManagementPage.tsx`
- [x] T027 [P] [US1] Apply Ocean Breeze theme colors to PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T028 [P] [US1] Apply improved typography to PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T029 [P] [US1] Improve form field spacing and visual grouping in PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T030 [P] [US1] Apply Ocean Breeze theme colors to PatientSearchForm component in `frontend/src/components/patients/PatientSearchForm.tsx`
- [x] T031 [P] [US1] Apply improved typography to PatientSearchForm component in `frontend/src/components/patients/PatientSearchForm.tsx`
- [x] T032 [P] [US1] Apply Ocean Breeze theme colors to PatientsTable component in `frontend/src/components/patients/PatientsTable.tsx`
- [x] T033 [P] [US1] Apply improved typography to PatientsTable component in `frontend/src/components/patients/PatientsTable.tsx`
- [x] T034 [P] [US1] Improve table row visual separation and readability in PatientsTable component in `frontend/src/components/patients/PatientsTable.tsx`
- [x] T035 [P] [US1] Apply Ocean Breeze theme colors to PatientEditDialog component in `frontend/src/components/patients/PatientEditDialog.tsx`
- [x] T036 [P] [US1] Apply improved typography to PatientEditDialog component in `frontend/src/components/patients/PatientEditDialog.tsx`
- [x] T037 [P] [US1] Apply Ocean Breeze theme colors to PatientViewDialog component in `frontend/src/components/patients/PatientViewDialog.tsx`
- [x] T038 [P] [US1] Apply improved typography to PatientViewDialog component in `frontend/src/components/patients/PatientViewDialog.tsx`
- [x] T039 [US1] Verify color contrast meets WCAG 2.1 AA requirements across all components
- [x] T040 [US1] Verify consistent spacing and alignment throughout all patient management components

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Visual design improvements should be visible across all components.

---

## Phase 4: User Story 2 - Smooth Interactions and Feedback (Priority: P2)

**Goal**: Healthcare staff experience smooth transitions, animations, and clear feedback when interacting with the interface. Actions provide immediate visual feedback, loading states are clear, and transitions feel natural and polished with subtle animations (150-300ms duration).

**Independent Test**: Interact with buttons, forms, and navigation elements. Staff can observe smooth transitions, loading indicators, and success/error feedback. Delivers improved perceived performance and user confidence.

### Tests for User Story 2 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T041 [P] [US2] Unit test for button hover/active state animations in `frontend/tests/unit/ui/button-animations.test.tsx`
- [x] T042 [P] [US2] Unit test for form loading state transitions in `frontend/tests/unit/patient/patientRegistrationForm-loading.test.tsx`
- [x] T043 [P] [US2] Integration test for success message appearance animation in `frontend/tests/integration/patient/patientRegistration-success-animation.test.tsx`
- [x] T044 [P] [US2] Integration test for error message appearance animation in `frontend/tests/integration/patient/patientRegistration-error-animation.test.tsx`
- [x] T045 [P] [US2] Performance test for animation frame rates (60fps) in `frontend/tests/performance/animations-fps.test.tsx`
- [x] T046 [P] [US2] Accessibility test for prefers-reduced-motion support in `frontend/tests/integration/accessibility/reduced-motion.test.tsx`

### Implementation for User Story 2

- [x] T047 [US2] Install MagicUI skeleton loader component using `npx shadcn@latest add skeleton --registry magic-ui` in `frontend/` directory
- [x] T048 [US2] Install MagicUI animated button component using `npx shadcn@latest add button-animated --registry magic-ui` in `frontend/` directory
- [x] T049 [US2] Add hover state animations (150-300ms) to Button component in `frontend/src/components/ui/button.tsx`
- [x] T050 [US2] Add active state animations (150-300ms) to Button component in `frontend/src/components/ui/button.tsx`
- [x] T051 [US2] Add focus indicator animations (150-300ms) to Button component in `frontend/src/components/ui/button.tsx`
- [x] T052 [P] [US2] Implement loading state with skeleton loader in PatientsTable component in `frontend/src/components/patients/PatientsTable.tsx`
- [x] T053 [P] [US2] Implement loading state with clear messaging in PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T054 [P] [US2] Add success message appearance animation (fade-in, 200ms) in PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T055 [P] [US2] Add error message appearance animation (fade-in, 200ms) in PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T056 [P] [US2] Add error message appearance animation (fade-in, 200ms) in PatientEditDialog component in `frontend/src/components/patients/PatientEditDialog.tsx`
- [x] T057 [US2] Ensure all animations respect prefers-reduced-motion media query
- [x] T058 [US2] Verify all interactive elements provide visual feedback within 100ms of user interaction
- [x] T059 [US2] Test animation performance maintains 60fps on standard hardware

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Smooth interactions and clear feedback should be visible throughout the interface.

---

## Phase 5: User Story 3 - Enhanced Responsive Design (Priority: P2)

**Goal**: Healthcare staff can effectively use the application on various screen sizes, from desktop monitors to tablets. The interface adapts gracefully to different viewport sizes with appropriate layouts, spacing, and component arrangements.

**Independent Test**: Resize the browser window or view on different devices. Staff can verify that all functionality remains accessible and usable at different screen sizes. Delivers improved accessibility across devices.

### Tests for User Story 3 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T060 [P] [US3] Responsive design test for PatientManagementPage at 640px breakpoint in `frontend/tests/integration/patient/patientManagementPage-responsive-640.test.tsx`
- [x] T061 [P] [US3] Responsive design test for PatientManagementPage at 768px breakpoint in `frontend/tests/integration/patient/patientManagementPage-responsive-768.test.tsx`
- [x] T062 [P] [US3] Responsive design test for PatientManagementPage at 1024px breakpoint in `frontend/tests/integration/patient/patientManagementPage-responsive-1024.test.tsx`
- [x] T063 [P] [US3] Responsive design test for PatientManagementPage at 1280px breakpoint in `frontend/tests/integration/patient/patientManagementPage-responsive-1280.test.tsx`
- [x] T064 [P] [US3] Responsive design test for PatientManagementPage at 1920px breakpoint in `frontend/tests/integration/patient/patientManagementPage-responsive-1920.test.tsx`
- [x] T065 [P] [US3] Responsive design test for PatientsTable at all breakpoints in `frontend/tests/integration/patient/patientsTable-responsive.test.tsx`
- [x] T066 [P] [US3] Touch target size test (minimum 44x44px) for mobile breakpoints in `frontend/tests/integration/accessibility/touch-targets.test.tsx`

### Implementation for User Story 3

- [x] T067 [US3] Update PatientManagementPage layout for responsive breakpoints (640px, 768px, 1024px, 1280px, 1920px+) in `frontend/src/components/patients/PatientManagementPage.tsx`
- [x] T068 [P] [US3] Update PatientRegistrationForm layout for responsive breakpoints in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T069 [P] [US3] Update PatientSearchForm layout for responsive breakpoints in `frontend/src/components/patients/PatientSearchForm.tsx`
- [x] T070 [P] [US3] Update PatientsTable for responsive design (horizontal scroll or column stacking) at smaller breakpoints in `frontend/src/components/patients/PatientsTable.tsx`
- [x] T071 [P] [US3] Update PatientEditDialog for responsive breakpoints in `frontend/src/components/patients/PatientEditDialog.tsx`
- [x] T072 [P] [US3] Update PatientViewDialog for responsive breakpoints in `frontend/src/components/patients/PatientViewDialog.tsx`
- [x] T073 [US3] Ensure all form fields remain usable at all breakpoints
- [x] T074 [US3] Ensure touch targets are minimum 44x44px on mobile breakpoints
- [x] T075 [US3] Verify all functionality remains accessible at all breakpoints (640px, 768px, 1024px, 1280px, 1920px+)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Responsive design should work across all specified breakpoints.

---

## Phase 6: User Story 4 - Improved Empty and Loading States (Priority: P3)

**Goal**: Healthcare staff see helpful, visually appealing empty states when no data is available and clear loading states during data fetching. These states provide context and guidance (brief text with action guidance) rather than leaving users confused.

**Independent Test**: View the application with no data or during slow network conditions. Staff can verify that empty states are helpful and loading states are clear. Delivers improved user guidance during edge cases.

### Tests for User Story 4 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [x] T076 [P] [US4] Unit test for empty state component with action guidance in `frontend/tests/unit/ui/empty-state.test.tsx`
- [x] T077 [P] [US4] Integration test for empty state in PatientsTable when no patients exist in `frontend/tests/integration/patient/patientsTable-empty-state.test.tsx`
- [x] T078 [P] [US4] Integration test for empty state in PatientSearchForm when no results found in `frontend/tests/integration/patient/patientSearch-empty-state.test.tsx`
- [x] T079 [P] [US4] Integration test for loading state appearance within 200ms in `frontend/tests/integration/patient/loading-state-timing.test.tsx`
- [x] T080 [P] [US4] Accessibility test for empty state messages (screen reader compatibility) in `frontend/tests/integration/accessibility/empty-state-aria.test.tsx`

### Implementation for User Story 4

- [x] T081 [US4] Install MagicUI empty state component using `npx shadcn@latest add empty-state --registry magic-ui` in `frontend/` directory
- [x] T082 [US4] Create EmptyState component with brief text and action button in `frontend/src/components/ui/empty-state.tsx`
- [x] T083 [US4] Customize EmptyState component to match Ocean Breeze theme in `frontend/src/components/ui/empty-state.tsx`
- [x] T084 [P] [US4] Implement empty state in PatientsTable when no patients exist (with "Add First Patient" action button) in `frontend/src/components/patients/PatientsTable.tsx`
- [x] T085 [P] [US4] Implement empty state in PatientSearchForm when no results found (with search adjustment suggestion) in `frontend/src/components/patients/PatientSearchForm.tsx`
- [x] T086 [P] [US4] Enhance loading state in PatientsTable with skeleton loader and clear messaging in `frontend/src/components/patients/PatientsTable.tsx`
- [x] T087 [P] [US4] Enhance loading state in PatientRegistrationForm with clear messaging in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [x] T088 [US4] Ensure all loading states appear within 200ms of triggering asynchronous operation
- [x] T089 [US4] Verify all empty states include brief text messages with clear action guidance (buttons/links)

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently. Empty and loading states should be helpful and visually appealing.

---

## Phase 7: User Story 5 - Enhanced Accessibility and Keyboard Navigation (Priority: P3)

**Goal**: Healthcare staff can navigate and use the application effectively using only keyboard input, and the interface meets accessibility standards for screen readers and assistive technologies.

**Independent Test**: Navigate the application using only keyboard input and test with screen readers. Staff can verify all functionality is accessible without a mouse. Delivers improved accessibility compliance and usability.

### Tests for User Story 5 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation. TDD is NON-NEGOTIABLE.**

- [ ] T090 [P] [US5] Keyboard navigation test for logical tab order in `frontend/tests/integration/accessibility/keyboard-navigation.test.tsx`
- [ ] T091 [P] [US5] Keyboard navigation test for visible focus indicators in `frontend/tests/integration/accessibility/focus-indicators.test.tsx`
- [ ] T092 [P] [US5] Screen reader test for ARIA labels in `frontend/tests/integration/accessibility/aria-labels.test.tsx`
- [ ] T093 [P] [US5] Screen reader test for semantic HTML structure in `frontend/tests/integration/accessibility/semantic-html.test.tsx`
- [ ] T094 [P] [US5] WCAG 2.1 AA compliance test for color contrast in `frontend/tests/integration/accessibility/wcag-contrast.test.tsx`
- [ ] T095 [P] [US5] WCAG 2.1 AA compliance test for keyboard navigation in `frontend/tests/integration/accessibility/wcag-keyboard.test.tsx`
- [ ] T096 [P] [US5] WCAG 2.1 AA compliance test for screen reader compatibility in `frontend/tests/integration/accessibility/wcag-screen-reader.test.tsx`

### Implementation for User Story 5

- [ ] T097 [US5] Add logical tab order to PatientManagementPage component in `frontend/src/components/patients/PatientManagementPage.tsx`
- [ ] T098 [P] [US5] Add visible focus indicators to all interactive elements in PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [ ] T099 [P] [US5] Add visible focus indicators to all interactive elements in PatientSearchForm component in `frontend/src/components/patients/PatientSearchForm.tsx`
- [ ] T100 [P] [US5] Add visible focus indicators to all interactive elements in PatientsTable component in `frontend/src/components/patients/PatientsTable.tsx`
- [ ] T101 [P] [US5] Add appropriate ARIA labels to PatientRegistrationForm component in `frontend/src/components/patients/PatientRegistrationForm.tsx`
- [ ] T102 [P] [US5] Add appropriate ARIA labels to PatientSearchForm component in `frontend/src/components/patients/PatientSearchForm.tsx`
- [ ] T103 [P] [US5] Add appropriate ARIA labels to PatientsTable component in `frontend/src/components/patients/PatientsTable.tsx`
- [ ] T104 [P] [US5] Ensure semantic HTML structure in PatientEditDialog component in `frontend/src/components/patients/PatientEditDialog.tsx`
- [ ] T105 [P] [US5] Ensure semantic HTML structure in PatientViewDialog component in `frontend/src/components/patients/PatientViewDialog.tsx`
- [ ] T106 [US5] Verify all interactive elements receive focus in logical order
- [ ] T107 [US5] Verify all elements have appropriate ARIA labels for screen readers
- [ ] T108 [US5] Verify all primary tasks can be completed using only keyboard navigation

**Checkpoint**: At this point, all user stories should be independently functional. Full accessibility compliance should be achieved.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure constitution compliance

**Code Quality:**
- [ ] T109 [P] Code quality audit: run ESLint and fix all violations in `frontend/` directory
- [ ] T110 [P] Code quality audit: run Prettier and format all code in `frontend/` directory
- [ ] T111 [P] Documentation updates: ensure all new UI components include JSDoc/TypeScript documentation
- [ ] T112 Code cleanup and refactoring to reduce complexity (cyclomatic complexity < 10 per function)
- [ ] T113 [P] TypeScript type checking: ensure zero type errors in `frontend/` directory

**Testing:**
- [ ] T114 [P] Verify unit test coverage meets 80% threshold in `frontend/tests/unit/` directory
- [ ] T115 [P] Verify integration test coverage meets 60% threshold in `frontend/tests/integration/` directory
- [ ] T116 [P] Run full test suite and fix any flaky tests in `frontend/tests/` directory
- [ ] T117 [P] Visual regression test suite execution and validation in `frontend/tests/integration/` directory
- [ ] T118 [P] Accessibility test suite execution and validation in `frontend/tests/integration/accessibility/` directory

**User Experience:**
- [ ] T119 [P] Accessibility audit (WCAG 2.1 AA compliance) across all components
- [ ] T120 [P] UX consistency review across all patient management components
- [ ] T121 [P] Responsive design validation across all breakpoints (640px, 768px, 1024px, 1280px, 1920px+)
- [ ] T122 Verify all animations respect prefers-reduced-motion preferences

**Performance:**
- [ ] T123 Performance optimization: verify page load time < 2s and TTI < 3s
- [ ] T124 Performance budget validation: verify bundle size increase < 50KB (gzipped)
- [ ] T125 Performance test: verify animation frame rates maintain 60fps on standard hardware
- [ ] T126 Performance test: verify no memory leaks during extended use sessions (30+ minutes)
- [ ] T127 Run bundle analysis with `npm run analyze` in `frontend/` directory

**Integration:**
- [ ] T128 Install Aceternity UI components selectively (enhanced card layouts, typography components) using `npx shadcn@latest add [component] --registry aceternity` in `frontend/` directory
- [ ] T129 Apply Aceternity UI components to enhance visual hierarchy where appropriate
- [ ] T130 Customize Aceternity UI components to match Ocean Breeze theme and subtle animation requirements

**Validation:**
- [ ] T131 Run quickstart.md validation checklist
- [ ] T132 Constitution compliance verification (code quality, testing, UX, performance)
- [ ] T133 Final visual inspection and user acceptance testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Enhances US1/US2 but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Enhances US1/US2/US3 but independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Enhances all previous stories but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Component updates can be done in parallel (different files)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks can run in parallel after T006 (Tailwind upgrade)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Component updates within a story marked [P] can run in parallel (different files)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all component updates for User Story 1 together:
Task: "Apply Ocean Breeze theme colors to PatientRegistrationForm component"
Task: "Apply Ocean Breeze theme colors to PatientSearchForm component"
Task: "Apply Ocean Breeze theme colors to PatientsTable component"
Task: "Apply Ocean Breeze theme colors to PatientEditDialog component"
Task: "Apply Ocean Breeze theme colors to PatientViewDialog component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Polish phase → Final validation → Deploy
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Visual Design)
   - Developer B: User Story 2 (Interactions) + User Story 4 (Empty States)
   - Developer C: User Story 3 (Responsive) + User Story 5 (Accessibility)
3. Stories complete and integrate independently
4. Polish phase: All developers collaborate on cross-cutting concerns

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All animations must be subtle (150-300ms duration)
- All components must respect prefers-reduced-motion
- All color schemes must meet WCAG 2.1 AA contrast requirements


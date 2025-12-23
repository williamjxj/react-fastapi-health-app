# Research: React Application Initialization

**Date**: 2025-01-27  
**Feature**: Initialize React Application  
**Purpose**: Research best practices and technical decisions for initializing a modern React application with TypeScript, Tailwind CSS, and shadcn/ui

## Research Questions

1. What are the best practices for setting up Vite with React and TypeScript?
2. How to properly integrate shadcn/ui with Vite and Tailwind CSS?
3. What ESLint and Prettier configurations are recommended for React/TypeScript projects?
4. How to configure Vitest with React Testing Library for component testing?
5. What project structure best practices should be followed?

## Findings

### 1. Vite + React + TypeScript Setup

**Decision**: Use `npm create vite@latest` with React + TypeScript template, then customize configuration.

**Rationale**: 
- Vite provides fast HMR and optimized builds
- Official Vite React template includes TypeScript support out of the box
- Minimal configuration needed for production-ready setup
- Excellent developer experience with instant server start

**Alternatives Considered**:
- Create React App (CRA): Deprecated, slower, being phased out
- Next.js: Overkill for a clean SPA, adds unnecessary complexity
- Manual Webpack setup: Too much configuration overhead

**Key Configuration Points**:
- `vite.config.ts`: Configure path aliases, plugins, build options
- `tsconfig.json`: Strict mode enabled, path mapping for clean imports
- Use `@vitejs/plugin-react` for React support
- Enable React Fast Refresh for optimal HMR

**References**:
- Vite official documentation: https://vitejs.dev/guide/
- React plugin: https://github.com/vitejs/vite-plugin-react

### 2. shadcn/ui Integration

**Decision**: Use shadcn/ui CLI (`npx shadcn-ui@latest init`) to initialize, then add components as needed.

**Rationale**:
- shadcn/ui is designed to work with Tailwind CSS and React
- Components are copied into project (not installed as dependencies)
- Full control over component code and styling
- Built on Radix UI primitives for accessibility
- Follows WAI-ARIA patterns (aligns with constitution requirements)

**Integration Steps**:
1. Initialize Tailwind CSS first
2. Run `npx shadcn-ui@latest init` to configure
3. Configure `components.json` for component paths
4. Add components using `npx shadcn-ui@latest add [component]`

**Key Configuration**:
- `components.json`: Defines component paths, tailwind config location, aliases
- Components installed to `src/components/ui/` by default
- Uses `cn()` utility for conditional class merging
- Requires `tailwindcss-animate` plugin for animations

**Alternatives Considered**:
- Material-UI: Heavier bundle, different design philosophy
- Chakra UI: Good but different styling approach
- Ant Design: Enterprise-focused, less customizable

**References**:
- shadcn/ui documentation: https://ui.shadcn.com/
- Radix UI primitives: https://www.radix-ui.com/

### 3. ESLint + Prettier Configuration

**Decision**: Use ESLint with TypeScript ESLint parser and React plugins, Prettier for formatting with integration.

**Rationale**:
- Industry standard for React/TypeScript projects
- Comprehensive rule sets for code quality
- Prettier handles formatting, ESLint handles code quality
- Prevents conflicts with `eslint-config-prettier`

**Configuration Approach**:
- `eslint.config.js`: Use flat config (ESLint 9+) or legacy config
- Extend: `@typescript-eslint/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`
- Add `eslint-config-prettier` to disable conflicting rules
- Configure Prettier with `.prettierrc` or `prettier.config.js`
- Add format script and lint script to `package.json`

**Key Rules**:
- TypeScript strict mode checks
- React hooks rules
- Import ordering and organization
- Accessibility rules (jsx-a11y plugin recommended)

**Alternatives Considered**:
- Biome: Modern all-in-one tool, but less ecosystem support
- ESLint only: Missing formatting consistency
- Prettier only: Missing code quality checks

**References**:
- TypeScript ESLint: https://typescript-eslint.io/
- ESLint React plugin: https://github.com/jsx-eslint/eslint-plugin-react
- Prettier: https://prettier.io/

### 4. Vitest + React Testing Library

**Decision**: Use Vitest as test runner with React Testing Library for component testing.

**Rationale**:
- Vitest is the standard testing framework for Vite projects
- Fast execution with ESM support
- Compatible with Jest API (easy migration)
- React Testing Library is the recommended approach for React testing
- Focuses on testing user behavior, not implementation

**Configuration Approach**:
- `vitest.config.ts`: Configure test environment, setup files, coverage
- Use `@testing-library/react` for component rendering
- Use `@testing-library/jest-dom` for DOM matchers
- Use `@testing-library/user-event` for user interactions
- Configure coverage thresholds (80% unit, 60% integration per constitution)

**Test Structure**:
- Unit tests: Test individual functions, utilities, hooks
- Integration tests: Test component interactions, user flows
- Setup file: Configure test environment, global mocks, matchers

**Key Practices**:
- Test user behavior, not implementation details
- Use accessible queries (getByRole, getByLabelText)
- Mock external dependencies appropriately
- Keep tests isolated and independent

**Alternatives Considered**:
- Jest: More setup required with Vite, slower
- Playwright/Cypress: E2E testing, different use case
- Vitest only: Missing React-specific testing utilities

**References**:
- Vitest documentation: https://vitest.dev/
- React Testing Library: https://testing-library.com/react
- Testing Best Practices: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

### 5. Project Structure Best Practices

**Decision**: Follow feature-based organization with clear separation of concerns.

**Rationale**:
- Scalable structure that grows with the project
- Clear organization improves maintainability
- Aligns with React and TypeScript best practices
- Supports modular component architecture

**Structure Principles**:
- Group by feature/domain when project grows
- Keep shared components in `components/ui/`
- Utilities and helpers in `lib/`
- Configuration files at root
- Tests mirror source structure

**Key Directories**:
- `src/components/`: React components (feature components and UI components)
- `src/lib/`: Utility functions, helpers, constants
- `src/styles/`: Global styles, Tailwind config
- `tests/`: Test files organized by type (unit, integration)

**File Naming**:
- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Tests: `*.test.ts` or `*.test.tsx`
- Configuration: kebab-case or standard names

**Alternatives Considered**:
- Flat structure: Doesn't scale well
- Domain-driven: Overkill for initial setup
- Atomic design: Too prescriptive for small projects

**References**:
- React documentation: https://react.dev/learn/thinking-in-react
- TypeScript project structure: https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html

## Additional Considerations

### Node.js Version
- **Decision**: Support Node.js 18+ (LTS recommended)
- **Rationale**: Vite and modern tooling require Node 18+
- **Action**: Document in README, add `.nvmrc` or `engines` in package.json

### TypeScript Configuration
- **Decision**: Enable strict mode, use path aliases
- **Rationale**: Catches errors early, improves code quality
- **Action**: Configure `tsconfig.json` with strict options, path mapping

### Tailwind CSS Configuration
- **Decision**: Use default Tailwind config with custom theme extensions
- **Rationale**: shadcn/ui works with default Tailwind setup
- **Action**: Configure `tailwind.config.js` with content paths, theme extensions

### Performance Optimization
- **Decision**: Enable tree-shaking, code splitting, production optimizations
- **Rationale**: Meets performance requirements (bundle size, load time)
- **Action**: Configure Vite build options, analyze bundle size

## Summary

All research questions have been resolved. The technical stack is well-defined:
- **Build Tool**: Vite 5.x
- **Framework**: React 18.x with TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Components**: shadcn/ui
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Package Manager**: npm

The project structure follows React best practices and is designed to scale. All decisions align with constitution requirements for code quality, testing, UX consistency, and performance.


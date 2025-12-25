# Research: Project Structure Reorganization

**Feature**: 004-restructure-project  
**Date**: 2025-01-27  
**Purpose**: Research best practices and patterns for reorganizing a monorepo into independent service directories

## Research Questions

### 1. Monorepo Service Organization Patterns

**Question**: What are best practices for organizing multiple services in a monorepo while maintaining deployment independence?

**Findings**:
- **Decision**: Use flat service directories at root level (`frontend/`, `backend/`, `json-server/`)
- **Rationale**: 
  - Flat structure is simpler and more discoverable than nested structures
  - Each service directory is self-contained with its own dependencies
  - Enables independent deployment without complex build orchestration
  - Aligns with common monorepo patterns (e.g., Nx, Turborepo use similar flat structures)
- **Alternatives considered**:
  - Nested structure (`services/frontend/`, `services/backend/`) - Rejected: Adds unnecessary nesting, harder to navigate
  - Workspace-based structure (using npm/pnpm workspaces) - Rejected: Adds complexity, not needed for independent deployments
  - Separate repositories - Rejected: Loses monorepo benefits (shared specs, docs, easier development)

### 2. Deployment Independence for Multi-Cloud Services

**Question**: How to structure services for deployment to different cloud platforms (Vercel, Render, local) while maintaining independence?

**Findings**:
- **Decision**: Each service has its own configuration files, environment variables, and deployment configs in its directory
- **Rationale**:
  - Vercel automatically detects frontend projects with `package.json` and `vite.config.ts` in the service directory
  - Render can deploy from a subdirectory using build commands that reference the service directory
  - Local json-server can run independently with its own `package.json`
  - Each service's `.env` file is service-specific and not shared
- **Alternatives considered**:
  - Shared deployment configuration - Rejected: Violates independence requirement, makes deployment platform-specific
  - Root-level deployment configs - Rejected: Doesn't work well with Vercel/Render subdirectory deployments

### 3. Code Duplication vs. Shared Utilities

**Question**: Should shared utilities be duplicated or shared when services need independence?

**Findings**:
- **Decision**: Duplicate service-specific utilities in each service directory
- **Rationale**:
  - Enables true deployment independence (no shared code dependencies)
  - Each service can evolve its utilities independently
  - Avoids version conflicts and dependency issues
  - Simplifies deployment (no need to package shared code)
  - Aligns with microservices best practices (bounded contexts)
- **Alternatives considered**:
  - Shared `common/` directory - Rejected: Creates dependency coupling, complicates deployment
  - Shared npm package - Rejected: Adds build complexity, version management overhead
  - Import from other services - Rejected: Violates independence, creates circular dependencies

### 4. Test Organization in Multi-Service Monorepo

**Question**: How should tests be organized when services are separated?

**Findings**:
- **Decision**: Move tests into each service's directory (`frontend/tests/`, `backend/tests/`, `json-server/tests/`)
- **Rationale**:
  - Tests are service-specific and should live with the code they test
  - Enables independent test execution per service
  - Simplifies CI/CD (can test services in parallel)
  - Aligns with service independence principle
  - Each service can have its own test configuration
- **Alternatives considered**:
  - Root-level `tests/` directory - Rejected: Doesn't support service independence, harder to run service-specific tests
  - Shared test utilities at root - Rejected: Creates coupling, violates independence

### 5. Environment Variable Management

**Question**: How should environment variables be managed across independent services?

**Findings**:
- **Decision**: Each service has its own `.env` file in its service directory
- **Rationale**:
  - Enables service-specific configuration without conflicts
  - Each deployment platform (Vercel, Render) can set environment variables per service
  - No shared secrets or configuration coupling
  - Simplifies local development (each service manages its own env)
- **Alternatives considered**:
  - Root-level `.env` with prefixes - Rejected: Creates coupling, harder to manage per-service
  - Shared `.env.example` at root - Rejected: Can be maintained, but each service should have its own example

### 6. Migration Strategy for Restructuring

**Question**: What is the safest approach to restructure existing code without breaking functionality?

**Findings**:
- **Decision**: Use a systematic migration approach: create new directories, move files incrementally, update imports, verify tests pass at each step
- **Rationale**:
  - Incremental approach reduces risk of breaking changes
  - Can verify functionality at each step
  - Easier to rollback if issues arise
  - Maintains git history better than large file moves
- **Migration steps**:
  1. Create new service directories
  2. Move source files (preserve structure within each service)
  3. Move configuration files
  4. Move tests
  5. Update import paths
  6. Update configuration file paths
  7. Update documentation
  8. Verify all tests pass
  9. Update deployment configurations
- **Alternatives considered**:
  - Big bang migration (move everything at once) - Rejected: High risk, harder to debug issues
  - Automated refactoring tools - Considered: Could help with import path updates, but manual verification still needed

### 7. Vercel Deployment from Subdirectory

**Question**: How does Vercel handle deployments from a subdirectory?

**Findings**:
- **Decision**: Use Vercel's "Root Directory" setting or `vercel.json` with build configuration
- **Rationale**:
  - Vercel supports deploying from subdirectories via project settings
  - Can specify root directory in Vercel dashboard or `vercel.json`
  - Build commands run from the specified root directory
  - Output directory can be specified relative to root directory
- **Configuration**:
  - Set "Root Directory" to `frontend/` in Vercel project settings
  - Or use `vercel.json` with `buildCommand` and `outputDirectory` relative to root
- **Alternatives considered**:
  - Deploy entire monorepo - Rejected: Unnecessary, includes backend code
  - Separate repository - Rejected: Loses monorepo benefits

### 8. Render Deployment from Subdirectory

**Question**: How does Render handle deployments from a subdirectory?

**Findings**:
- **Decision**: Use Render's "Root Directory" setting in service configuration
- **Rationale**:
  - Render supports specifying a root directory for the service
  - Build commands run from the specified root directory
  - Environment variables are service-specific
  - Database connections can be configured per service
- **Configuration**:
  - Set "Root Directory" to `backend/` in Render service settings
  - Build command: `pip install -r requirements.txt && alembic upgrade head`
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Alternatives considered**:
  - Deploy entire monorepo - Rejected: Includes frontend/json-server code unnecessarily
  - Separate repository - Rejected: Loses monorepo benefits

### 9. Documentation Organization

**Question**: How should documentation be organized for a multi-service monorepo?

**Findings**:
- **Decision**: Root-level docs for project overview, service-specific READMEs in each service directory
- **Rationale**:
  - Root README explains overall project structure and how services relate
  - Each service README provides service-specific setup and usage
  - Project-level docs (specs/, docs/) remain at root for shared knowledge
  - Clear separation: project docs at root, service docs in services
- **Structure**:
  - `README.md` (root): Project overview, service relationships, getting started
  - `frontend/README.md`: Frontend setup, development, deployment
  - `backend/README.md`: Backend setup, API docs, database setup
  - `json-server/README.md`: Json-server setup and usage
  - `docs/`: Project-level documentation (migration guides, architecture decisions)
- **Alternatives considered**:
  - All docs at root - Rejected: Doesn't scale, harder to find service-specific info
  - All docs in services - Rejected: Loses project-level context

### 10. CI/CD Pipeline Updates

**Question**: How should CI/CD pipelines be updated for the new structure?

**Findings**:
- **Decision**: Update CI/CD to test and build each service independently from its directory
- **Rationale**:
  - Each service can be tested in parallel
  - Build commands run from service directories
  - Deployment steps are service-specific
  - Can selectively deploy services
- **CI/CD structure**:
  - Test frontend: `cd frontend && npm test`
  - Test backend: `cd backend && pytest`
  - Build frontend: `cd frontend && npm run build`
  - Build backend: (handled by Render)
  - Deploy: Service-specific deployment steps
- **Alternatives considered**:
  - Single unified CI/CD - Rejected: Doesn't support independent service deployment
  - Separate CI/CD per service - Considered: Could work, but monorepo allows shared CI config

## Summary

All research questions resolved. The restructuring approach uses:
- Flat service directories at root level
- Independent configuration, dependencies, and tests per service
- Duplicated utilities for true independence
- Service-specific documentation
- Incremental migration strategy
- Platform-specific deployment configurations

No unresolved clarifications remain. Ready to proceed to Phase 1 design.


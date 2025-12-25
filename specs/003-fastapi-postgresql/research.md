# Research: Backend Migration to FastAPI and PostgreSQL

**Date**: 2025-01-27  
**Feature**: Backend Migration to FastAPI and PostgreSQL

## Technology Decisions

### FastAPI Framework

**Decision**: Use FastAPI as the web framework for the REST API backend.

**Rationale**:
- Modern, high-performance async framework built on Starlette and Pydantic
- Automatic OpenAPI/Swagger documentation generation
- Type hints and Pydantic integration for data validation
- Excellent performance (comparable to Node.js and Go)
- Growing ecosystem and strong community support
- Easy to learn for Python developers

**Alternatives Considered**:
- **Flask**: More mature but synchronous, requires more boilerplate for async operations
- **Django**: Full-featured but heavyweight for a simple REST API, includes unnecessary features
- **Tornado**: Async but less modern, smaller community

### SQLAlchemy 2.0 ORM

**Decision**: Use SQLAlchemy 2.0 with async support for database operations.

**Rationale**:
- Industry-standard Python ORM with excellent PostgreSQL support
- SQLAlchemy 2.0 provides modern async/await syntax
- Strong type hints and query builder
- Alembic integration for database migrations
- Mature and well-documented

**Alternatives Considered**:
- **Tortoise ORM**: Async-first but smaller ecosystem
- **Databases + SQLAlchemy Core**: More control but more boilerplate
- **Raw SQL with psycopg**: Too low-level, loses ORM benefits

### Pydantic for Data Validation

**Decision**: Use Pydantic 2.0 for request/response validation and serialization.

**Rationale**:
- Native FastAPI integration (FastAPI built on Pydantic)
- Type-safe data validation with clear error messages
- Automatic JSON serialization/deserialization
- Can share models between API and database layers
- Excellent performance and validation features

**Alternatives Considered**:
- **Marshmallow**: Mature but more verbose, not native to FastAPI
- **Manual validation**: Too error-prone and time-consuming

### Alembic for Migrations

**Decision**: Use Alembic for database schema migrations.

**Rationale**:
- Official SQLAlchemy migration tool
- Version-controlled schema changes
- Rollback capabilities
- Automatic migration script generation
- Industry standard for SQLAlchemy projects

**Alternatives Considered**:
- **Manual SQL scripts**: No version control, error-prone
- **Django migrations**: Tied to Django framework

### PostgreSQL 17

**Decision**: Use PostgreSQL 17 as the database.

**Rationale**:
- User-specified requirement
- Production-grade relational database
- Excellent performance and reliability
- Rich feature set (JSON support, full-text search, etc.)
- Strong ecosystem and tooling
- Render cloud service supports PostgreSQL

**Alternatives Considered**:
- **SQLite**: Too limited for production, no concurrent writes
- **MySQL**: Less feature-rich, user specified PostgreSQL

### psycopg (psycopg3) for Database Driver

**Decision**: Use psycopg (PostgreSQL adapter) with async support.

**Rationale**:
- Official PostgreSQL adapter for Python
- Async support for FastAPI async endpoints
- Excellent performance and reliability
- SQLAlchemy 2.0 async support requires psycopg
- Active development and maintenance

**Alternatives Considered**:
- **asyncpg**: Faster but less compatible with SQLAlchemy async
- **psycopg2**: Synchronous, doesn't support SQLAlchemy 2.0 async

### Deployment: Render Cloud Service

**Decision**: Deploy FastAPI backend to Render cloud service.

**Rationale**:
- User-specified requirement
- Easy PostgreSQL database provisioning
- Automatic HTTPS and SSL certificates
- Environment variable management
- Git-based deployments
- Free tier available for development
- Good documentation and support

**Alternatives Considered**:
- **Vercel**: Better for serverless, but PostgreSQL integration more complex
- **Railway**: Similar features but user specified Render
- **Heroku**: More expensive, less modern
- **AWS/GCP/Azure**: More complex setup, overkill for initial deployment

### Environment Configuration

**Decision**: Use python-dotenv for local development, environment variables for production.

**Rationale**:
- Standard Python practice
- Secure (no secrets in code)
- Easy local development with .env file
- Render supports environment variables natively
- Compatible with all deployment platforms

**Alternatives Considered**:
- **Config files**: Less secure, harder to manage across environments
- **Hardcoded values**: Security risk, not flexible

## Architecture Patterns

### API Layer Structure

**Decision**: Separate routes, services, and models into distinct layers.

**Rationale**:
- Clear separation of concerns
- Easy to test each layer independently
- Follows FastAPI best practices
- Maintainable and scalable

**Structure**:
- `routes/`: API endpoint definitions (FastAPI routers)
- `services/`: Business logic (database operations, validation)
- `models/`: SQLAlchemy database models
- `schemas/`: Pydantic request/response models

### Database Connection Management

**Decision**: Use SQLAlchemy async session with dependency injection in FastAPI.

**Rationale**:
- FastAPI dependency injection system provides clean session management
- Automatic connection pooling
- Proper async context management
- Follows FastAPI best practices

**Pattern**:
```python
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

### Data Migration Strategy

**Decision**: Create one-time migration script to transfer data from db.json to PostgreSQL.

**Rationale**:
- Simple and straightforward for initial migration
- Can be run manually or as part of setup
- Verifiable (can compare counts, validate data)
- No need for complex migration framework for one-time operation

**Approach**:
- Read db.json file
- Validate each patient record
- Insert into PostgreSQL using SQLAlchemy
- Report success/failure statistics

## API Compatibility Strategy

### Endpoint Compatibility

**Decision**: Maintain exact json-server endpoint structure and response format.

**Rationale**:
- Zero frontend changes required
- Lower risk migration
- Can test compatibility with existing frontend code

**Implementation**:
- `GET /patients`: Return array of all patients (same format as json-server)
- `POST /patients`: Accept patient object, return created patient with auto-generated id
- Same HTTP status codes (200, 201, 400, 404, 500)
- Same error response format

### CORS Configuration

**Decision**: Enable CORS for frontend domain(s) in FastAPI.

**Rationale**:
- Frontend and backend on different domains (Vercel/Cloudflare vs Render)
- Required for browser-based API calls
- FastAPI has built-in CORS middleware

**Configuration**:
- Allow specific origins (Vercel/Cloudflare domains)
- Allow credentials if needed
- Configure appropriate headers

## Testing Strategy

### Test Database

**Decision**: Use separate test database or SQLite in-memory for tests.

**Rationale**:
- Isolate tests from development data
- Fast test execution
- Can run tests in CI/CD without PostgreSQL setup

**Approach**:
- Use pytest fixtures for test database setup/teardown
- Use transactions that rollback after each test
- SQLite in-memory for unit tests, PostgreSQL for integration tests

### API Testing

**Decision**: Use httpx TestClient for FastAPI endpoint testing.

**Rationale**:
- FastAPI recommended testing approach
- Async support
- Easy to use
- Can test full request/response cycle

## Performance Considerations

### Database Indexing

**Decision**: Create indexes on frequently queried fields (patientID, name).

**Rationale**:
- Improve query performance
- Essential for search operations
- Standard database optimization practice

**Indexes**:
- Primary key on `id` (automatic)
- Unique index on `patientID` (business requirement)
- Index on `name` (for future search features)

### Connection Pooling

**Decision**: Use SQLAlchemy connection pooling with appropriate pool size.

**Rationale**:
- Efficient database connection management
- Handle concurrent requests
- Default SQLAlchemy pool settings are usually sufficient

## Security Considerations

### Input Validation

**Decision**: Use Pydantic models for all request validation.

**Rationale**:
- Automatic validation with clear error messages
- Type safety
- Prevents SQL injection and other attacks
- FastAPI integration

### Environment Variables

**Decision**: Store all sensitive data (database credentials) in environment variables.

**Rationale**:
- Never commit secrets to version control
- Easy to manage across environments
- Render supports environment variables
- Standard security practice

## Deployment Considerations

### Render Configuration

**Decision**: Use Render's web service for FastAPI and managed PostgreSQL database.

**Rationale**:
- User-specified requirement
- Easy setup and management
- Automatic deployments from Git
- Built-in PostgreSQL support

**Configuration**:
- Web service type: Python
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables from Render dashboard

### Health Check Endpoint

**Decision**: Implement `/health` endpoint for Render health checks.

**Rationale**:
- Render uses health checks to verify service is running
- Can check database connectivity
- Useful for monitoring

## Migration Risks and Mitigation

### Data Loss Risk

**Risk**: Data could be lost during migration from db.json to PostgreSQL.

**Mitigation**:
- Backup db.json before migration
- Validate data after migration (count records, spot-check data)
- Migration script with dry-run mode
- Test migration on copy of data first

### API Compatibility Risk

**Risk**: API response format might differ from json-server, breaking frontend.

**Mitigation**:
- Write contract tests comparing responses
- Test with actual frontend code
- Maintain exact field names and types
- Test all endpoints before deployment

### Database Connection Issues

**Risk**: Database connection failures in production.

**Mitigation**:
- Proper error handling and logging
- Connection retry logic
- Health check endpoint
- Monitor database connection pool

## References

- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLAlchemy 2.0 Documentation: https://docs.sqlalchemy.org/en/20/
- Pydantic Documentation: https://docs.pydantic.dev/
- Alembic Documentation: https://alembic.sqlalchemy.org/
- Render Documentation: https://render.com/docs
- PostgreSQL 17 Documentation: https://www.postgresql.org/docs/17/


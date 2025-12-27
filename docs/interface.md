# Database Interface Documentation

## Async Database Connection Setup

### Current Implementation: PostgreSQL with psycopg3

The application uses `postgresql+psycopg://` connection strings with async Python code (`async def`, `AsyncSession`). **This is correct and fully supported.**

### How It Works

1. **Connection String Format**: `postgresql+psycopg://[user]:[password]@[host]:[port]/[database]`
   - Uses **psycopg3** (modern version of psycopg)
   - psycopg3 fully supports async operations

2. **SQLAlchemy Async Engine**: 
   ```python
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
   
   engine = create_async_engine(
       settings.database_url,  # postgresql+psycopg://...
       pool_size=5,
       max_overflow=10,
   )
   ```
   - `create_async_engine()` automatically detects the driver from the connection string
   - Uses the appropriate async adapter for psycopg3

3. **Async Session Management**:
   ```python
   from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
   
   AsyncSessionLocal = async_sessionmaker(
       engine,
       class_=AsyncSession,
       expire_on_commit=False,
   )
   ```

4. **Async Database Operations**:
   ```python
   async def get_db() -> AsyncSession:
       async with AsyncSessionLocal() as session:
           try:
               yield session
           except Exception:
               await session.rollback()
               raise
           finally:
               await session.close()
   ```

### Why This Works

- **psycopg3** (the modern version) fully supports async operations
- SQLAlchemy's `create_async_engine()` automatically uses the async adapter
- The combination of `postgresql+psycopg://` + `AsyncSession` + `async def` is the correct pattern
- All database operations use `await` for async execution

### psycopg vs asyncpg

#### psycopg3 (Current Implementation)

**Pros:**
- ✅ Fully supports both sync and async operations
- ✅ Mature, stable, and widely used
- ✅ Works seamlessly with SQLAlchemy async
- ✅ Good performance for most use cases
- ✅ Better compatibility with existing PostgreSQL features

**Cons:**
- Slightly more overhead for pure async workloads (supports both sync/async)

**Connection String**: `postgresql+psycopg://...`

#### asyncpg (Alternative)

**Pros:**
- ✅ Pure async driver (designed specifically for async)
- ✅ Potentially better performance for high-concurrency async workloads
- ✅ Lower-level async implementation

**Cons:**
- Async-only (no sync support)
- Less mature ecosystem
- May require more configuration for some PostgreSQL features

**Connection String**: `postgresql+asyncpg://...`

### When to Use Each

**Use psycopg3 (Current)** when:
- You need both sync and async support
- You want maximum compatibility and stability
- Your workload doesn't require extreme async performance
- You're using SQLAlchemy (works seamlessly)

**Use asyncpg** when:
- You have a pure async application (no sync code)
- You need maximum async performance for high-concurrency workloads
- You're comfortable with async-only driver limitations

### Current Setup Status

✅ **The current implementation is correct and production-ready**

The application correctly uses:
- `postgresql+psycopg://` connection strings
- `create_async_engine()` for async engine creation
- `AsyncSession` and `async_sessionmaker` for session management
- `async def` functions for all database operations
- `await` for all database queries

### Migration Considerations

If migrating from `psycopg` to `asyncpg`:

1. **Update Connection Strings**: Change `postgresql+psycopg://` → `postgresql+asyncpg://`
2. **Update Dependencies**: Replace `psycopg[binary]` with `asyncpg` in requirements
3. **Update Alembic**: Ensure sync migrations still use `psycopg2` (Alembic needs sync driver)
4. **Test Thoroughly**: Verify all async operations work correctly
5. **Update Documentation**: Update all references to the new driver

**Note**: Migration is optional - the current psycopg3 setup is fully functional and performant.

### Code Examples

#### Current Pattern (psycopg3)

```python
# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

engine = create_async_engine(
    "postgresql+psycopg://user:pass@host:port/db",
    pool_size=5,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# main.py or routes
async def get_patients(db: AsyncSession):
    result = await db.execute(select(Patient))
    return result.scalars().all()
```

#### Alternative Pattern (asyncpg)

```python
# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

engine = create_async_engine(
    "postgresql+asyncpg://user:pass@host:port/db",  # Changed here
    pool_size=5,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Usage remains the same
async def get_patients(db: AsyncSession):
    result = await db.execute(select(Patient))
    return result.scalars().all()
```

More from claude.ai:

## FastAPI + PostgreSQL (Supabase) + asyncpg

**FastAPI** is an async framework, so using `async def` for your route handlers is the right approach when you want non-blocking database operations.

**However**, there's one important clarification about your database driver:

### Database Driver Options

1. **`postgresql+asyncpg`** (recommended for async)
   - Use this in your SQLAlchemy connection string
   - Fully async, works great with `async def`
   - Example: `postgresql+asyncpg://user:pass@host/db`

2. **`postgresql+psycopg`** (psycopg3, supports async)
   - Also works with async when using `AsyncConnection`
   - Example: `postgresql+psycopg://user:pass@host/db`

3. **`postgresql+psycopg2`** (older, sync only)
   - Don't use this with `async def` - it will block

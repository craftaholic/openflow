import type { Skill } from '../../interfaces/skill'

export const python: Skill = {
  name: "python",
  description: "Python patterns for backend development",
  instruction: `# Python

## Type Hints

\`\`\`python
from typing import TypeVar, Generic, Protocol, TypedDict
from dataclasses import dataclass

T = TypeVar('T')
E = TypeVar('E', bound=Exception)

class Result[T]:
    def __init__(self, value: T | None, error: E | None):
        self._value = value
        self._error = error

    @property
    def is_ok(self) -> bool: ...
    @property
    def value(self) -> T: ...
    @property
    def error(self) -> E | None: ...

class Repository(Protocol):
    def get(self, id: str) -> User | None: ...
    def save(self, user: User) -> None: ...

class UserDict(TypedDict):
    id: str
    name: str
    email: str
\`\`\`

## Error Handling

\`\`\`python
class AppError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class NotFoundError(AppError):
    def __init__(self, resource: str, id: str):
        super().__init__(f"{resource} with id {id} not found", 404)

class ValidationError(AppError):
    def __init__(self, field: str, message: str):
        super().__init__(f"{field}: {message}", 400)

def fetch_user(id: str) -> Result[User, AppError]:
    try:
        user = db.get(User, id)
        if not user:
            return Result.err(NotFoundError("User", id))
        return Result.ok(user)
    except DatabaseError as e:
        return Result.err(AppError(str(e), 500))
\`\`\`

## Context Managers

\`\`\`python
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db_connection():
    conn = await get_connection()
    try:
        yield conn
        await conn.commit()
    except Exception:
        await conn.rollback()
        raise
    finally:
        await conn.release()

async def create_user(data: dict) -> User:
    async with get_db_connection() as conn:
        return await conn.execute("INSERT INTO users ...", data)
\`\`\`

## Dependency Injection

\`\`\`python
from injector import Injector, inject

class UserService:
    @inject
    def __init__(self, repository: Repository, logger: Logger):
        self.repository = repository
        self.logger = logger

def create_injector() -> Injector:
    return Injector([
        RepositoryModule(),
        LoggerModule(),
    ])
\`\`\`

## Async Patterns

\`\`\`python
import asyncio
from typing import AsyncIterator

async def stream_users() -> AsyncIterator[User]:
    async with pool.cursor() as cursor:
        async for row in cursor:
            yield User.from_row(row)

async def process_batch(items: list[Item], batch_size: int = 100) -> list[Result]:
    results = []
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        results.extend(await asyncio.gather(
            *[process_item(item) for item in batch],
            return_exceptions=True
        ))
    return results
\`\`\`

## Testing

\`\`\`python
import pytest
from unittest.mock import AsyncMock, MagicMock

@pytest.fixture
def mock_repo():
    repo = MagicMock(spec=Repository)
    repo.get = AsyncMock(return_value=User(id="1", name="Test"))
    repo.save = AsyncMock()
    return repo

class TestUserService:
    @pytest.mark.asyncio
    async def test_create_user(self, mock_repo):
        svc = UserService(mock_repo)
        result = await svc.create(User(name="Test"))
        assert result.id == "1"
        mock_repo.save.assert_called_once()
\`\`\`

## Best Practices

- Use type hints consistently (PEP 484)
- Prefer composition over inheritance
- Use dataclasses for data objects
- Async/await for I/O bound operations
- pytest for testing with fixtures
- Keep functions small and focused
- Use ABC/Protocol for interfaces
- Avoid globals and module-level state
`
}

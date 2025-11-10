from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from config.settings import settings

# Engine async (DATABASE_URL debe usar driver async, p.ej. mysql+aiomysql://user:pass@host:3306/dbname)
engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)

# AsyncSession factory; expire_on_commit=False evita que atributos "expiren" tras commit
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

# Dependencia FastAPI: provee AsyncSession por petición
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
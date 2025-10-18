# app/config/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from .settings import settings

# Creamos el motor asíncrono para SQLAlchemy
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # Pone en True para ver las consultas SQL en la consola
)

# Creamos una fábrica de sesiones asíncronas
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base declarativa para nuestros modelos ORM
Base = declarative_base()

# Dependencia de FastAPI para obtener una sesión de BD en cada request
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
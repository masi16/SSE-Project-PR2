from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from ..config.settings import settings

# Engine async (SQLAlchemy Core). DATABASE_URL debe usar driver async (ej: mysql+aiomysql://...)
engine = create_async_engine(settings.DATABASE_URL, echo=True, future=True)

# Dependencia FastAPI: entrega una conexión async (con transacción por petición).
# En los servicios usar: await conn.execute(text("..."), params) y para resultados usar .mappings()
async def get_db():
    # usar engine.begin() para abrir una transacción que commit/rollback automáticamente
    async with engine.begin() as conn:
        yield conn
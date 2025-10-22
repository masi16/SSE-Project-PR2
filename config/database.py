from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from .settings import settings 
# 1. Crear el motor (engine) de SQLAlchemy
# Este es el punto de entrada principal a la base de datos.
# 'echo=True' es muy útil durante el desarrollo para ver las consultas SQL que se generan.
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
)

# 2. Crear una fábrica de sesiones asíncronas
# AsyncSessionLocal es una "fábrica" que creará nuevas sesiones de BD cuando se necesiten.
# La conexión es asíncrona, cumpliendo con el requisito del práctico.
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False  # Importante para trabajar con modelos fuera de la sesión
)

# 3. Crear una clase Base declarativa
# Todos tus modelos del ORM (en la carpeta models/) heredarán de esta clase.
Base = declarative_base()

# 4. Dependencia de FastAPI para la Sesión de Base de Datos
# Esta función es una "dependencia" que FastAPI inyectará en cada ruta que la necesite.
# Se encarga de abrir una sesión al inicio de la petición y cerrarla al final.
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
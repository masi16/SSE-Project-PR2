from fastapi import FastAPI
from routers import expediente_router, auth_router
from app.config.database import engine, Base

# Comando para crear todas las tablas en la BD (ejecutar una vez al inicio)
# async def create_db_and_tables():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

app = FastAPI(
    title="API - Sistema de Seguimiento de Expedientes",
    description="Trabajo Práctico Final de Programación II.",
    version="1.0.0"
)

# @app.on_event("startup")
# async def on_startup():
#     await create_db_and_tables()

# Incluir los routers en la aplicación principal
app.include_router(expediente_router.router)
app.include_router(auth_router.router)
# ... incluye los demás routers ...

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API del Sistema de Seguimiento de Expedientes"}
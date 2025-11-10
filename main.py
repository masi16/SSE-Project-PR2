from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from sqlalchemy import text

from config.database import engine
from routers import expediente, auth  # importa aquí los routers que uses

app = FastAPI(
    title="API - Sistema de Seguimiento de Expedientes",
    description="Trabajo Práctico Final de Programación II.",
    version="1.0.0"
)

# CORS (ajusta en producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    logging.info("Arrancando aplicación: comprobando conexión a la base de datos...")
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        logging.info("Conexión a la base de datos OK")
    except Exception:
        logging.exception("No se pudo conectar a la base de datos en startup")

@app.on_event("shutdown")
async def on_shutdown():
    logging.info("Cerrando recursos...")
    try:
        engine.dispose()
        logging.info("Engine dispuesto correctamente")
    except Exception:
        logging.exception("Error al disponer engine")

# Incluir routers
app.include_router(expediente.router)
app.include_router(auth.router)
# app.include_router(...)  # incluye otros routers aquí

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API del Sistema de Seguimiento de Expedientes"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine
from models.models import Base

# Routers
from routers import auth, usuario, cliente, abogado, expediente, movimiento, resolucion, estado

# FUNCIÓN PARA CREAR LAS TABLAS
async def init_db():
    """Crea todas las tablas en la base de datos que no existan."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# CREACIÓN DE LA APLICACIÓN FASTAPI
app = FastAPI(
    title="API de Gestión de Expedientes Legales",
    description="API para un sistema de gestión integral de expedientes legales",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# EVENTO DE STARTUP
@app.on_event("startup")
async def on_startup():
    """Se ejecuta al iniciar la aplicación."""
    print("🚀 Iniciando aplicación...")
    print("📊 Creando tablas de base de datos...")
    await init_db()
    print("✅ Tablas creadas exitosamente.")

# EVENTO DE SHUTDOWN
@app.on_event("shutdown")
async def on_shutdown():
    """Se ejecuta al cerrar la aplicación."""
    print("🛑 Cerrando aplicación...")

# INCLUIR ROUTERS
app.include_router(auth.router)
app.include_router(usuario.router)
app.include_router(estado.router)  # ✅ NUEVO
app.include_router(cliente.router)
app.include_router(abogado.router)
app.include_router(expediente.router)
app.include_router(movimiento.router)
app.include_router(resolucion.router)

# RUTA PRINCIPAL
@app.get("/")
async def root():
    """Endpoint raíz para verificar que la API está funcionando."""
    return {
        "message": "API de Gestión de Expedientes Legales",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Endpoint de health check."""
    return {
        "status": "ok",
        "message": "API está funcionando correctamente"
    }

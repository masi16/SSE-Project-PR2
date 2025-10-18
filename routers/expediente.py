from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..config.database import get_db
from ..services import expediente_service
from ..schemas import expediente_schemas

router = APIRouter(
    prefix="/expedientes",
    tags=["Expedientes"]
    # Para proteger rutas: dependencies=[Depends(get_current_active_user)]
)

@router.post("/", response_model=expediente_schemas.Expediente, status_code=201)
async def create_new_expediente(
    expediente: expediente_schemas.ExpedienteCreate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Crea un nuevo expediente.
    - **Validaciones:** Pydantic se encarga de las validaciones de tipo y formato.
    """
    return await expediente_service.create_expediente(db=db, expediente=expediente)

@router.get("/{expediente_id}", response_model=expediente_schemas.Expediente)
async def read_expediente(expediente_id: int, db: AsyncSession = Depends(get_db)):
    db_expediente = await expediente_service.get_expediente(db, expediente_id)
    if db_expediente is None:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    return db_expediente

# ... aquí defines las rutas para GET (todos), PUT y DELETE, llamando a sus
# respectivas funciones en expediente_service ...
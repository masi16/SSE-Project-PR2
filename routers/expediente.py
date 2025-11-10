from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any

from config.database import get_db
from services import expediente as expediente_service
from schemas import expediente as expediente_schemas
from utils.auth import get_current_user

router = APIRouter(
    prefix="/expedientes",
    tags=["Expedientes"],
    # Para proteger rutas: dependencies=[Depends(get_current_active_user)]
)

@router.post("/", response_model=expediente_schemas.ExpedienteSimple, status_code=status.HTTP_201_CREATED)
async def create_new_expediente(
    expediente: expediente_schemas.ExpedienteCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """
    Crea un nuevo expediente.
    - Pydantic valida el payload.
    - `expediente_service.create_expediente` debe encargarse de verificar FKs y permisos.
    """
    created = await expediente_service.create_expediente(db=db, expediente=expediente, current_user=current_user)
    if not created:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el expediente")
    return created

@router.get("/", response_model=List[expediente_schemas.ExpedienteSimple])
async def list_expedientes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """Listado paginado de expedientes."""
    return await expediente_service.get_expedientes(db=db, skip=skip, limit=limit, current_user=current_user)

@router.get("/{expediente_id}", response_model=expediente_schemas.ExpedienteSimple)
async def read_expediente(
    expediente_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    db_expediente = await expediente_service.get_expediente(db, expediente_id, current_user)
    if db_expediente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expediente no encontrado")
    return db_expediente

@router.put("/{expediente_id}", response_model=expediente_schemas.ExpedienteSimple)
async def update_expediente(
    expediente_id: int,
    expediente_in: expediente_schemas.ExpedienteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """
    Actualiza un expediente. `expediente_service.update_expediente` debe:
    - validar existencia
    - aplicar permisos (quién puede editar)
    - comprobar FKs si vienen en el payload
    """
    updated = await expediente_service.update_expediente(db, expediente_id, expediente_in, current_user)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expediente no encontrado o no autorizado")
    return updated

@router.delete("/{expediente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expediente(
    expediente_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """
    Elimina un expediente. El servicio puede implementar soft-delete o comprobaciones de integridad.
    """
    deleted = await expediente_service.delete_expediente(db, expediente_id, current_user)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expediente no encontrado o no autorizado")
    return None
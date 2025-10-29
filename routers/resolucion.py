from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any, Optional

from ..config.database import get_db
from ..services import resolucion_service
from ..schemas import resolucion as resolucion_schema
from ..utils.security import get_current_user

router = APIRouter(tags=["Resoluciones"], prefix="/resoluciones")


@router.post("/", response_model=resolucion_schema.ResolucionOut, status_code=status.HTTP_201_CREATED)
async def create_resolucion(
    resolucion_in: resolucion_schema.ResolucionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    created = await resolucion_service.create_resolucion(db, resolucion_in, current_user)
    if not created:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear la resolución (falta expediente o datos inválidos)")
    return created


@router.post("/expedientes/{expediente_id}", response_model=resolucion_schema.ResolucionOut, status_code=status.HTTP_201_CREATED)
async def create_resolucion_for_expediente(
    expediente_id: int,
    resolucion_in: resolucion_schema.ResolucionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    created = await resolucion_service.create_resolucion(db, resolucion_in, current_user, expediente_id=expediente_id)
    if not created:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear la resolución para el expediente")
    return created


@router.get("/", response_model=List[resolucion_schema.ResolucionOut])
async def list_resoluciones(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    return await resolucion_service.get_resoluciones(db, skip=skip, limit=limit)


@router.get("/{resolucion_id}", response_model=resolucion_schema.ResolucionOut)
async def get_resolucion(
    resolucion_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    obj = await resolucion_service.get_resolucion(db, resolucion_id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resolución no encontrada")
    return obj


@router.put("/{resolucion_id}", response_model=resolucion_schema.ResolucionOut)
async def update_resolucion(
    resolucion_id: int,
    resolucion_in: resolucion_schema.ResolucionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    updated = await resolucion_service.update_resolucion(db, resolucion_id, resolucion_in, current_user)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resolución no encontrada o no se pudo actualizar")
    return updated


@router.delete("/{resolucion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resolucion(
    resolucion_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    deleted = await resolucion_service.delete_resolucion(db, resolucion_id, current_user)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resolución no encontrada")
    return None
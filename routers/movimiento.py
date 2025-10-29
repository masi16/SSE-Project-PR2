from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any

from ..config.database import get_db
from ..services import movimiento_service
from ..schemas import movimiento as movimiento_schema
from ..utils.security import get_current_user

router = APIRouter(tags=["Movimientos"], prefix="/movimientos")

@router.post("/", response_model=movimiento_schema.MovimientoOut, status_code=status.HTTP_201_CREATED)
async def create_movimiento(
    movimiento_in: movimiento_schema.MovimientoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    created = await movimiento_service.create_movimiento(db, movimiento_in, current_user)
    if not created:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el movimiento")
    return created

@router.get("/", response_model=List[movimiento_schema.MovimientoOut])
async def list_movimientos(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    return await movimiento_service.get_movimientos(db, skip=skip, limit=limit, current_user=current_user)

@router.get("/{movimiento_id}", response_model=movimiento_schema.MovimientoOut)
async def get_movimiento(
    movimiento_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    obj = await movimiento_service.get_movimiento(db, movimiento_id, current_user)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movimiento no encontrado")
    return obj

@router.put("/{movimiento_id}", response_model=movimiento_schema.MovimientoOut)
async def update_movimiento(
    movimiento_id: int,
    movimiento_in: movimiento_schema.MovimientoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    updated = await movimiento_service.update_movimiento(db, movimiento_id, movimiento_in, current_user)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movimiento no encontrado")
    return updated

@router.delete("/{movimiento_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movimiento(
    movimiento_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    deleted = await movimiento_service.delete_movimiento(db, movimiento_id, current_user)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movimiento no encontrado")
    return None


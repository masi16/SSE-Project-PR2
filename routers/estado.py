from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any

from config.database import get_db
from services import estado as estado_service
from schemas import estado as estado_schema
from utils.auth import get_current_user

router = APIRouter(tags=["Estados"], prefix="/estados")

@router.post("/", response_model=estado_schema.EstadoOut, status_code=status.HTTP_201_CREATED)
async def create_estado(
    estado_in: estado_schema.EstadoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    created = await estado_service.create_estado(db, estado_in, current_user)
    if not created:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el estado")
    return created

@router.get("/", response_model=List[estado_schema.EstadoOut])
async def list_estados(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    return await estado_service.get_estados(db, skip=skip, limit=limit)

@router.get("/{estado_id}", response_model=estado_schema.EstadoOut)
async def get_estado(
    estado_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    estado = await estado_service.get_estado(db, estado_id, current_user)
    if not estado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    return estado

@router.put("/{estado_id}", response_model=estado_schema.EstadoOut)
async def update_estado(
    estado_id: int,
    estado_in: estado_schema.EstadoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    estado = await estado_service.update_estado(db, estado_id, estado_in, current_user)
    if not estado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    return estado

@router.delete("/{estado_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_estado(
    estado_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    deleted = await estado_service.delete_estado(db, estado_id, current_user)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    return None
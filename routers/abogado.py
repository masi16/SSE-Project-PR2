from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..config.database import get_db
from ..services import abogado_service
from ..schemas import abogado as abogado_schema
from ..utils.security import get_current_user

router = APIRouter(tags=["Abogados"], prefix="/abogados")

@router.post("/", response_model=abogado_schema.AbogadoOut, status_code=status.HTTP_201_CREATED)
async def create_abogado(
    abogado_in: abogado_schema.AbogadoCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return await abogado_service.create_abogado(db, abogado_in)

@router.get("/", response_model=List[abogado_schema.AbogadoOut])
async def list_abogados(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return await abogado_service.get_abogados(db, skip=skip, limit=limit)

@router.get("/{abogado_id}", response_model=abogado_schema.AbogadoOut)
async def get_abogado(
    abogado_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    abogado = await abogado_service.get_abogado(db, abogado_id)
    if not abogado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Abogado no encontrado")
    return abogado

@router.put("/{abogado_id}", response_model=abogado_schema.AbogadoOut)
async def update_abogado(
    abogado_id: int,
    abogado_in: abogado_schema.AbogadoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    abogado = await abogado_service.update_abogado(db, abogado_id, abogado_in)
    if not abogado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Abogado no encontrado")
    return abogado

@router.delete("/{abogado_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_abogado(
    abogado_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    deleted = await abogado_service.delete_abogado(db, abogado_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Abogado no encontrado")
    return None


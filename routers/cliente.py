from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any

from ..config.database import get_db
from ..services import cliente_service 
from ..schemas import cliente as cliente_schema
from ..utils.security import get_current_user

router = APIRouter(tags=["Clientes"], prefix="/clientes")

@router.post("/", response_model=cliente_schema.ClienteOut, status_code=status.HTTP_201_CREATED)
async def create_cliente(
    cliente_in: cliente_schema.ClienteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    created = await cliente_service.create_cliente(db, cliente_in, current_user)
    if not created:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el cliente")
    return created

@router.get("/", response_model=List[cliente_schema.ClienteOut])
async def read_clientes(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    return await cliente_service.get_clientes(db, skip=skip, limit=limit, current_user=current_user)

@router.get("/{cliente_id}", response_model=cliente_schema.ClienteOut)
async def read_cliente(
    cliente_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    cliente = await cliente_service.get_cliente(db, cliente_id, current_user)
    if not cliente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    return cliente


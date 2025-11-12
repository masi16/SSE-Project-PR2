from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from schemas.usuario import UsuarioCreate, UsuarioOut
import services.usuario as usuario_service_module
from config.database import get_db
from utils.auth import get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("/", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
async def create_usuario(
    usuario: UsuarioCreate,
    db: AsyncSession = Depends(get_db)
):
    nuevo_usuario = await usuario_service_module.create_usuario(usuario_data=usuario, db=db)
    if not nuevo_usuario:
        raise HTTPException(status_code=400, detail="No se pudo crear el usuario.")
    return nuevo_usuario

@router.get("/", response_model=List[UsuarioOut])
async def read_current_user(
    current_user: UsuarioOut = Depends(get_current_user)
):
    return [current_user]

@router.get("/all", response_model=List[UsuarioOut])
async def read_all_usuarios(
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user)
):
    if current_user.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tienes permiso para ver todos los usuarios."
        )
    
    usuarios = await usuario_service_module.get_all_usuarios(db)
    return usuarios

@router.get("/{usuario_id}", response_model=UsuarioOut)
async def read_usuario_by_id(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user)
):
    if current_user.rol != "admin" and current_user.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tienes permiso para ver este usuario."
        )
    
    usuario = await usuario_service_module.get_usuario_by_id(usuario_id, db)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado."
        )
    return usuario

@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioOut = Depends(get_current_user)
):
    if current_user.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tienes permiso para eliminar usuarios."
        )
    
    usuario = await usuario_service_module.get_usuario_by_id(usuario_id, db)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado."
        )
    
    await usuario_service_module.delete_usuario(usuario_id, db)
    return None
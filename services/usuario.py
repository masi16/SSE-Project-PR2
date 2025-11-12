from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.usuario import UsuarioCreate, UsuarioOut
from utils.auth import get_password_hash, verify_password
import traceback

async def _get_user_by_email_with_password(email: str, db: AsyncSession):
    try:
        query = text("""
            SELECT id, email, rol, fk_abogado_id, password_hash 
            FROM usuarios 
            WHERE email = :email
        """)
        result = await db.execute(query, {"email": email})
        row = result.mappings().one_or_none()
        if row:
            return dict(row)
        return None
    except Exception as e:
        print(f"Error en _get_user_by_email_with_password: {str(e)}")
        traceback.print_exc()
        return None

async def get_usuario_by_email(email: str, db: AsyncSession) -> Optional[UsuarioOut]:
    user_data = await _get_user_by_email_with_password(email, db)
    if user_data:
        return UsuarioOut.model_validate(user_data)
    return None

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[UsuarioOut]:
    user_with_password = await _get_user_by_email_with_password(email=email, db=db)
    
    if not user_with_password:
        return None
    
    if not verify_password(password, user_with_password['password_hash']):
        return None
    
    return UsuarioOut.model_validate(user_with_password)

async def create_usuario(usuario_data: UsuarioCreate, db: AsyncSession) -> Optional[UsuarioOut]:
    try:
        existing_user = await get_usuario_by_email(email=usuario_data.email, db=db)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un usuario registrado con este email.",
            )
        
        hashed_password = get_password_hash(usuario_data.password)

        # Para MariaDB: INSERT sin RETURNING
        query = text("""
            INSERT INTO usuarios (email, rol, fk_abogado_id, password_hash)
            VALUES (:email, :rol, :fk_abogado_id, :password_hash)
        """)
        
        values = {
            "email": usuario_data.email,
            "rol": usuario_data.rol,
            "fk_abogado_id": usuario_data.fk_abogado_id,
            "password_hash": hashed_password
        }
        
        result = await db.execute(query, values)
        await db.commit()
        
        # Obtener el usuario creado por email
        created_user = await get_usuario_by_email(email=usuario_data.email, db=db)
        return created_user
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        print(f"Error en create_usuario: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al crear el usuario: {str(e)}"
        )

async def get_all_usuarios(db: AsyncSession) -> List[UsuarioOut]:
    try:
        query = text("""
            SELECT id, email, rol, fk_abogado_id 
            FROM usuarios
        """)
        
        result = await db.execute(query)
        usuarios = [UsuarioOut.model_validate(row) for row in result.mappings()]
        return usuarios
    except Exception as e:
        print(f"Error en get_all_usuarios: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuarios: {str(e)}"
        )

async def get_usuario_by_id(usuario_id: int, db: AsyncSession) -> Optional[UsuarioOut]:
    try:
        query = text("""
            SELECT id, email, rol, fk_abogado_id 
            FROM usuarios 
            WHERE id = :id
        """)
        
        result = await db.execute(query, {"id": usuario_id})
        row = result.mappings().one_or_none()
        if row:
            return UsuarioOut.model_validate(row)
        return None
    except Exception as e:
        print(f"Error en get_usuario_by_id: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener usuario: {str(e)}"
        )

async def delete_usuario(usuario_id: int, db: AsyncSession) -> bool:
    try:
        query = text("""
            DELETE FROM usuarios 
            WHERE id = :id
        """)
        
        result = await db.execute(query, {"id": usuario_id})
        await db.commit()
        return result.rowcount > 0
    except Exception as e:
        await db.rollback()
        print(f"Error en delete_usuario: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar usuario: {str(e)}"
        )
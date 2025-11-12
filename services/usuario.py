from typing import List
from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

# Importaciones necesarias
from schemas.usuario import UsuarioCreate, UsuarioOut
from utils.auth import get_password_hash # ¡MUY IMPORTANTE para la seguridad!

# ======================================================================
# Nota: TODAS las funciones ahora reciben 'db: AsyncSession' como parámetro.
# Ya no se usa 'get_db()' dentro de las funciones.
# ======================================================================

async def get_usuario_by_email(email: str, db: AsyncSession) -> UsuarioOut | None:
    query = text("SELECT id, email, rol, fk_abogado_id, password_hash FROM usuarios WHERE email = :email")
    result = await db.execute(query, {"email": email})
    user_row = result.mappings().one_or_none()

    if user_row:
        return UsuarioOut(**user_row)
    return None

async def create_usuario(usuario_data: UsuarioCreate, db: AsyncSession) -> UsuarioOut:
    # 1. Hashear la contraseña ANTES de guardarla en la base de datos
    hashed_password = get_password_hash(usuario_data.password)

    query = text("""
        INSERT INTO usuarios (email, rol, fk_abogado_id, password_hash)
        VALUES (:email, :rol, :fk_abogado_id, :password_hash)
        RETURNING id, email, rol, fk_abogado_id
    """)
    
    # Preparamos los valores para la consulta
    values = {
        "email": usuario_data.email,
        "rol": "abogado", # Asignamos el rol por defecto aquí
        "fk_abogado_id": None, # Asumimos que no se asigna al registrarse
        "password_hash": hashed_password
    }
    
    try:
        # 2. Ejecutar la consulta usando la sesión 'db'
        result = await db.execute(query, values)
        # 3. Confirmar la transacción
        await db.commit()
        
        new_user_row = result.mappings().one()
        return UsuarioOut(**new_user_row)
    except Exception as e:
        await db.rollback()
        # En producción, loggearías el error 'e'
        raise HTTPException(status_code=500, detail="Error al crear el usuario.")

async def get_usuarios(db: AsyncSession) -> List[UsuarioOut]:
    query = text("SELECT id, email, rol, fk_abogado_id FROM usuarios")
    result = await db.execute(query)
    user_rows = result.mappings().all()
    return [UsuarioOut(**row) for row in user_rows]

async def get_usuario(usuario_id: int, db: AsyncSession) -> UsuarioOut:
    query = text("SELECT id, email, rol, fk_abogado_id FROM usuarios WHERE id = :id")
    result = await db.execute(query, {"id": usuario_id})
    user_row = result.mappings().one_or_none()
    
    if not user_row:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    return UsuarioOut(**user_row)

async def update_usuario(usuario_id: int, usuario_data: UsuarioCreate, db: AsyncSession) -> UsuarioOut:
    # Primero, verifica que el usuario exista
    await get_usuario(usuario_id, db)

    # Hashea la nueva contraseña si se proporciona
    hashed_password = get_password_hash(usuario_data.password)

    query = text("""
        UPDATE usuarios
        SET email = :email, rol = :rol, fk_abogado_id = :fk_abogado_id, password_hash = :password_hash
        WHERE id = :id
        RETURNING id, email, rol, fk_abogado_id
    """)
    
    values = usuario_data.dict()
    values.pop('password', None)
    values['password_hash'] = hashed_password
    values['id'] = usuario_id
    
    result = await db.execute(query, values)
    await db.commit()
    
    updated_user_row = result.mappings().one()
    return UsuarioOut(**updated_user_row)

async def delete_usuario(usuario_id: int, db: AsyncSession) -> dict:
    # Primero, verifica que el usuario exista
    await get_usuario(usuario_id, db)
    
    query = text("DELETE FROM usuarios WHERE id = :id")
    
    result = await db.execute(query, {"id": usuario_id})
    await db.commit()

    # Comprobamos si se eliminó alguna fila
    if result.rowcount == 0:
        # Esto es redundante si get_usuario ya lanzó el 404, pero es una buena práctica
        raise HTTPException(status_code=404, detail="Usuario no encontrado para eliminar")
    
    return {"message": "Usuario eliminado exitosamente"}
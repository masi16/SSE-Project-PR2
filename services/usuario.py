from typing import List
from fastapi import HTTPException
from config.database import get_db
from schemas.usuario import UsuarioCreate, UsuarioOut

async def create_usuario(usuario: UsuarioCreate) -> UsuarioOut:
    query = """
    INSERT INTO usuarios (email, rol, fk_abogado_id, password)
    VALUES (:email, :rol, :fk_abogado_id, :password)
    RETURNING id, email, rol, fk_abogado_id
    """
    row = await get_db().fetch_one(query, values=usuario.dict())
    return UsuarioOut(**row)

async def get_usuarios() -> List[UsuarioOut]:
    query = "SELECT id, email, rol, fk_abogado_id FROM usuarios"
    rows = await get_db().fetch_all(query)
    return [UsuarioOut(**row) for row in rows]

async def get_usuario(usuario_id: int) -> UsuarioOut:
    query = "SELECT id, email, rol, fk_abogado_id FROM usuarios WHERE id = :id"
    row = await get_db().fetch_one(query, values={"id": usuario_id})
    if row:
        return UsuarioOut(**row)
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

async def update_usuario(usuario_id: int, usuario: UsuarioCreate) -> UsuarioOut:
    query = """
    UPDATE usuarios
    SET email = :email, rol = :rol, fk_abogado_id = :fk_abogado_id, password = :password
    WHERE id = :id
    RETURNING id, email, rol, fk_abogado_id
    """
    values = usuario.dict()
    values.update({"id": usuario_id})
    row = await get_db().fetch_one(query, values=values)
    if row:
        return UsuarioOut(**row)
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

async def delete_usuario(usuario_id: int) -> None:
    query = "DELETE FROM usuarios WHERE id = :id"
    result = await get_db().execute(query, values={"id": usuario_id})
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
from typing import List
from fastapi import HTTPException
from config.database import get_db
from schemas.abogado import AbogadoCreate, AbogadoOut
from sqlalchemy import text 

async def create_abogado(abogado: AbogadoCreate) -> AbogadoOut:
    query = text("""
    INSERT INTO abogados (nombre, apellido, email, telefono, especialidad)
    VALUES (:nombre, :apellido, :email, :telefono, :especialidad)
    RETURNING id, nombre, apellido, email, telefono, especialidad
    """)
    row = await get_db().fetch_one(query, values=abogado.dict())
    return AbogadoOut(**row)

async def get_abogados() -> List[AbogadoOut]:
    query = text("SELECT id, nombre, apellido, email, telefono, especialidad FROM abogados")
    rows = await get_db().fetch_all(query)
    return [AbogadoOut(**row) for row in rows]

async def get_abogado(abogado_id: int) -> AbogadoOut:
    query = text("SELECT id, nombre, apellido, email, telefono, especialidad FROM abogados WHERE id = :id")
    row = await get_db().fetch_one(query, values={"id": abogado_id})
    if row:
        return AbogadoOut(**row)
    raise HTTPException(status_code=404, detail="Abogado no encontrado")

async def update_abogado(abogado_id: int, abogado: AbogadoCreate) -> AbogadoOut:
    query = text("""
    UPDATE abogados
    SET nombre = :nombre, apellido = :apellido, email = :email, telefono = :telefono, especialidad = :especialidad
    WHERE id = :id
    RETURNING id, nombre, apellido, email, telefono, especialidad
    """)
    values = abogado.dict()
    values.update({"id": abogado_id})
    row = await get_db().fetch_one(query, values=values)
    if row:
        return AbogadoOut(**row)
    raise HTTPException(status_code=404, detail="Abogado no encontrado")

async def delete_abogado(abogado_id: int) -> None:
    query = text("DELETE FROM abogados WHERE id = :id")
    result = await get_db().execute(query, values={"id": abogado_id})
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Abogado no encontrado")

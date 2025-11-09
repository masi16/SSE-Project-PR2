from typing import List
from fastapi import HTTPException
from config.database import db
from schemas.cliente import ConsultaCreate, ConsultaOut

async def create_consulta(consulta: ConsultaCreate) -> ConsultaOut:
    query = """
    INSERT INTO consultas (cliente_id, asunto, descripcion, fecha)
    VALUES (:cliente_id, :asunto, :descripcion, :fecha)
    RETURNING id, cliente_id, asunto, descripcion, fecha
    """
    row = await db.fetch_one(query, values=consulta.dict())
    return ConsultaOut(**row)

async def get_consultas() -> List[ConsultaOut]:
    query = "SELECT id, cliente_id, asunto, descripcion, fecha FROM consultas"
    rows = await db.fetch_all(query)
    return [ConsultaOut(**row) for row in rows]

async def get_consulta(consulta_id: int) -> ConsultaOut:
    query = "SELECT id, cliente_id, asunto, descripcion, fecha FROM consultas WHERE id = :id"
    row = await db.fetch_one(query, values={"id": consulta_id})
    if row:
        return ConsultaOut(**row)
    raise HTTPException(status_code=404, detail="Consulta no encontrada")

async def update_consulta(consulta_id: int, consulta: ConsultaCreate) -> ConsultaOut:
    query = """
    UPDATE consultas
    SET cliente_id = :cliente_id, asunto = :asunto, descripcion = :descripcion, fecha = :fecha
    WHERE id = :id
    RETURNING id, cliente_id, asunto, descripcion, fecha
    """
    values = consulta.dict()
    values.update({"id": consulta_id})
    row = await db.fetch_one(query, values=values)
    if row:
        return ConsultaOut(**row)
    raise HTTPException(status_code=404, detail="Consulta no encontrada")

async def delete_consulta(consulta_id: int) -> None:
    query = "DELETE FROM consultas WHERE id = :id"
    result = await db.execute(query, values={"id": consulta_id})
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")

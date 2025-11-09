from typing import List
from fastapi import HTTPException
from config.database import db
from schemas.movimientos import ExpedienteCreate, ExpedienteOut 

async def create_expediente(expediente: ExpedienteCreate) -> ExpedienteOut:
    query = """
    INSERT INTO expedientes (nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_juzgado_id, fk_tipo_juicio_id, fk_estado_id)
    VALUES (:nro_expediente, :caratula, :fecha_ingreso, :fk_cliente_id, :fk_abogado_id, :fk_juzgado_id, :fk_tipo_juicio_id, :fk_estado_id)
    RETURNING id, nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_juzgado_id, fk_tipo_juicio_id, fk_estado_id
    """
    values = expediente.dict()
    result = await db.fetch_one(query=query, values=values)
    if not result:
        raise HTTPException(status_code=500, detail="Error al crear el expediente")
    return ExpedienteOut(**result)

async def get_expediente_by_id(expediente_id: int) -> ExpedienteOut:
    query = "SELECT * FROM expedientes WHERE id = :id"
    result = await db.fetch_one(query=query, values={"id": expediente_id})
    if not result:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    return ExpedienteOut(**result)

async def get_all_expedientes() -> List[ExpedienteOut]:
    query = "SELECT * FROM expedientes"
    results = await db.fetch_all(query=query)
    expedientes = [ExpedienteOut(**result) for result in results]
    return expedientes

async def delete_expediente(expediente_id: int) -> None:
    query = "DELETE FROM expedientes WHERE id = :id"
    result = await db.execute(query=query, values={"id": expediente_id})
    if result == 0:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
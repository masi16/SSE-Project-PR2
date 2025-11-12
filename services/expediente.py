from typing import List
from fastapi import HTTPException
from config.database import get_db
from schemas.expediente import ExpedienteCreate, ExpedienteSimple
from sqlalchemy import text 
async def create_expediente(expediente: ExpedienteCreate) -> ExpedienteSimple:
    query = text("""
    INSERT INTO expedientes (nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_juzgado_id, fk_tipo_juicio_id, fk_estado_id)
    VALUES (:nro_expediente, :caratula, :fecha_ingreso, :fk_cliente_id, :fk_abogado_id, :fk_juzgado_id, :fk_tipo_juicio_id, :fk_estado_id)
    RETURNING id, nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_juzgado_id, fk_tipo_juicio_id, fk_estado_id
    """)
    values = expediente.dict()
    result = await get_db().fetch_one(query=query, values=values)
    if not result:
        raise HTTPException(status_code=500, detail="Error al crear el expediente")
    return ExpedienteSimple(**result)

async def get_expediente_by_id(expediente_id: int) -> ExpedienteSimple:
    query = text("SELECT * FROM expedientes WHERE id = :id")
    result = await get_db().fetch_one(query=query, values={"id": expediente_id})
    if not result:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    return ExpedienteSimple(**result)

async def get_all_expedientes() -> List[ExpedienteSimple]:
    query = text("SELECT * FROM expedientes")
    results = await get_db().fetch_all(query=query)
    expedientes = [ExpedienteSimple(**result) for result in results]
    return expedientes

async def delete_expediente(expediente_id: int) -> None:
    query = text("DELETE FROM expedientes WHERE id = :id")
    result = await get_db().execute(query=query, values={"id": expediente_id})
    if result == 0:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
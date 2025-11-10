from typing import List
from fastapi import HTTPException
from config.database import get_db
from schemas.cliente import ClienteCreate, ClienteOut

async def create_cliente(cliente: ClienteCreate) -> ClienteOut:
    query = """
    INSERT INTO clientes (nombre, apellido, email, telefono)
    VALUES (:nombre, :apellido, :email, :telefono)
    RETURNING id, nombre, apellido, email, telefono
    """
    row = await get_db().fetch_one(query, values=cliente.dict())
    return ClienteOut(**row)

async def get_clientes() -> List[ClienteOut]:
    query = "SELECT id, nombre, apellido, email, telefono FROM clientes"
    rows = await get_db().fetch_all(query)
    return [ClienteOut(**row) for row in rows]

async def get_cliente(cliente_id: int) -> ClienteOut:
    query = "SELECT id, nombre, apellido, email, telefono FROM clientes WHERE id = :id"
    row = await get_db().fetch_one(query, values={"id": cliente_id})
    if row:
        return ClienteOut(**row)
    raise HTTPException(status_code=404, detail="Cliente no encontrado")

async def update_cliente(cliente_id: int, cliente: ClienteCreate) -> ClienteOut:
    query = """
    UPDATE clientes
    SET nombre = :nombre, apellido = :apellido, email = :email, telefono = :telefono
    WHERE id = :id
    RETURNING id, nombre, apellido, email, telefono
    """
    values = cliente.dict()
    values.update({"id": cliente_id})
    row = await get_db().fetch_one(query, values=values)
    if row:
        return ClienteOut(**row)
    raise HTTPException(status_code=404, detail="Cliente no encontrado")

async def delete_cliente(cliente_id: int) -> None:
    query = "DELETE FROM clientes WHERE id = :id"
    result = await get_db().execute(query, values={"id": cliente_id})
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

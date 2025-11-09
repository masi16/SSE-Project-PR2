from typing import List
from fastapi import HTTPException
from config.database import db
from schemas.movimientos import MovimientoCreate, MovimientoOut

async def create_movimiento(movimiento: MovimientoCreate) -> MovimientoOut:
    new_movimiento = await db.movimientos.insert_one(movimiento.dict())
    created_movimiento = await db.movimientos.find_one({"_id": new_movimiento.inserted_id})
    return MovimientoOut(**created_movimiento)

async def get_movimiento_by_id(movimiento_id: str) -> MovimientoOut:
    movimiento = await db.movimientos.find_one({"_id": movimiento_id})
    if movimiento is None:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")
    return MovimientoOut(**movimiento)

async def get_all_movimientos() -> List[MovimientoOut]:
    movimientos = []
    cursor = db.movimientos.find()
    async for movimiento in cursor:
        movimientos.append(MovimientoOut(**movimiento))
    return movimientos

async def delete_movimiento(movimiento_id: str) -> None:
    result = await db.movimientos.delete_one({"_id": movimiento_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")

from typing import List
from fastapi import HTTPException
from config.database import get_db
from schemas.resolucion import ResolucionCreate, ResolucionOut 

async def create_resolucion(resolucion: ResolucionCreate) -> ResolucionOut:
    new_resolucion = await get_db().resoluciones.insert_one(resolucion.dict())
    created_resolucion = await get_db().resoluciones.find_one({"_id": new_resolucion.inserted_id})
    return ResolucionOut(**created_resolucion)

async def get_resolucion_by_id(resolucion_id: str) -> ResolucionOut:
    resolucion = await get_db().resoluciones.find_one({"_id": resolucion_id})
    if resolucion is None:
        raise HTTPException(status_code=404, detail="Resolucion no encontrada")
    return ResolucionOut(**resolucion)

async def get_all_resoluciones() -> List[ResolucionOut]:
    resoluciones = []
    cursor = get_db().resoluciones.find()
    async for resolucion in cursor:
        resoluciones.append(ResolucionOut(**resolucion))
    return resoluciones

async def delete_resolucion(resolucion_id: str) -> None:
    result = await get_db().resoluciones.delete_one({"_id": resolucion_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resolucion no encontrada") 

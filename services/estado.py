from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.estado import EstadoCreate, EstadoUpdate, EstadoOut
import traceback

async def create_estado(db: AsyncSession, estado_data: EstadoCreate, current_user) -> Optional[EstadoOut]:
    try:
        query = text("""
            INSERT INTO estados (nombre, descripcion)
            VALUES (:nombre, :descripcion)
        """)
        
        values = {
            "nombre": estado_data.nombre,
            "descripcion": estado_data.descripcion
        }
        await db.execute(query, values)
        await db.commit()
        
        select_query = text("SELECT id, nombre, descripcion FROM estados WHERE nombre = :nombre")
        result = await db.execute(select_query, {"nombre": estado_data.nombre})
        row = result.mappings().one_or_none()
        
        if row:
            return EstadoOut.model_validate(row)
        return None
    except Exception as e:
        await db.rollback()
        print(f"Error en create_estado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_estados(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[EstadoOut]:
    try:
        query = text("SELECT id, nombre, descripcion FROM estados LIMIT :limit OFFSET :skip")
        result = await db.execute(query, {"limit": limit, "skip": skip})
        estados = [EstadoOut.model_validate(row) for row in result.mappings()]
        return estados
    except Exception as e:
        print(f"Error en get_estados: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_estado(db: AsyncSession, estado_id: int, current_user) -> Optional[EstadoOut]:
    try:
        query = text("SELECT id, nombre, descripcion FROM estados WHERE id = :id")
        result = await db.execute(query, {"id": estado_id})
        row = result.mappings().one_or_none()
        
        if row:
            return EstadoOut.model_validate(row)
        return None
    except Exception as e:
        print(f"Error en get_estado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def update_estado(db: AsyncSession, estado_id: int, estado_data: EstadoUpdate, current_user) -> Optional[EstadoOut]:
    try:
        update_fields = []
        values = {"id": estado_id}
        
        if estado_data.nombre:
            update_fields.append("nombre = :nombre")
            values["nombre"] = estado_data.nombre
        if estado_data.descripcion:
            update_fields.append("descripcion = :descripcion")
            values["descripcion"] = estado_data.descripcion
        
        if not update_fields:
            return await get_estado(db, estado_id, current_user)
        
        query_str = f"UPDATE estados SET {', '.join(update_fields)} WHERE id = :id"
        query = text(query_str)
        
        await db.execute(query, values)
        await db.commit()
        
        return await get_estado(db, estado_id, current_user)
    except Exception as e:
        await db.rollback()
        print(f"Error en update_estado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def delete_estado(db: AsyncSession, estado_id: int, current_user) -> bool:
    try:
        query = text("DELETE FROM estados WHERE id = :id")
        result = await db.execute(query, {"id": estado_id})
        await db.commit()
        return result.rowcount > 0
    except Exception as e:
        await db.rollback()
        print(f"Error en delete_estado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
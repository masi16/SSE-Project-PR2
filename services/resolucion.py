from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.resolucion import ResolucionCreate, ResolucionUpdate, ResolucionOut
import traceback

async def create_resolucion(db: AsyncSession, resolucion_data: ResolucionCreate, current_user, expediente_id: Optional[int] = None) -> Optional[ResolucionOut]:
    try:
        fk_expediente = expediente_id or resolucion_data.fk_expediente_id

        query = text("""
            INSERT INTO resoluciones (texto_resolucion, fecha_resolucion, fk_expediente_id)
            VALUES (:texto_resolucion, :fecha_resolucion, :fk_expediente_id)
        """)
        
        values = {
            "texto_resolucion": resolucion_data.texto_resolucion,
            "fecha_resolucion": resolucion_data.fecha_resolucion,
            "fk_expediente_id": fk_expediente
        }
        result = await db.execute(query, values)
        await db.commit()

        created_id = result.lastrowid
        if not created_id:
             raise HTTPException(status_code=500, detail="No se pudo obtener el ID de la resolución creada.")

        return await get_resolucion(db, created_id, current_user)
        

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        print(f"Error en create_resolucion: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_resoluciones(db: AsyncSession, skip: int = 0, limit: int = 100, current_user=None) -> List[ResolucionOut]:
    try:
        query = text("""
            SELECT id, texto_resolucion, fecha_resolucion, fecha_creacion, fk_expediente_id, 
                   NULL as fk_tipo_resolucion_id
            FROM resoluciones
            ORDER BY id DESC
            LIMIT :limit OFFSET :skip
        """)
        result = await db.execute(query, {"limit": limit, "skip": skip})
       
        rows = result.mappings().all()
        resoluciones = [ResolucionOut.model_validate(dict(row)) for row in rows]
        return resoluciones
    except Exception as e:
        print(f"Error en get_resoluciones: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_resolucion(db: AsyncSession, resolucion_id: int, current_user) -> Optional[ResolucionOut]:
    try:
        query = text("""
            SELECT id, texto_resolucion, fecha_resolucion, fecha_creacion, fk_expediente_id,
                   NULL as fk_tipo_resolucion_id
            FROM resoluciones
            WHERE id = :id
        """)
        result = await db.execute(query, {"id": resolucion_id})
        row = result.mappings().one_or_none()
        
        if row:
            return ResolucionOut.model_validate(dict(row))
        return None
    except Exception as e:
        print(f"Error en get_resolucion: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def update_resolucion(db: AsyncSession, resolucion_id: int, resolucion_data: ResolucionUpdate, current_user) -> Optional[ResolucionOut]:
    try:
        update_fields = []
        values = {"id": resolucion_id}
        
        if resolucion_data.texto_resolucion:
            update_fields.append("texto_resolucion = :texto_resolucion")
            values["texto_resolucion"] = resolucion_data.texto_resolucion
        if resolucion_data.fecha_resolucion:
            update_fields.append("fecha_resolucion = :fecha_resolucion")
            values["fecha_resolucion"] = resolucion_data.fecha_resolucion
        
        if not update_fields:
            return await get_resolucion(db, resolucion_id, current_user)
        
        query_str = f"UPDATE resoluciones SET {', '.join(update_fields)} WHERE id = :id"
        query = text(query_str)
        
        await db.execute(query, values)
        await db.commit()
        
        return await get_resolucion(db, resolucion_id, current_user)
    except Exception as e:
        await db.rollback()
        print(f"Error en update_resolucion: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def delete_resolucion(db: AsyncSession, resolucion_id: int, current_user) -> bool:
    try:
        query = text("DELETE FROM resoluciones WHERE id = :id")
        result = await db.execute(query, {"id": resolucion_id})
        await db.commit()
        return result.rowcount > 0
    except Exception as e:
        await db.rollback()
        print(f"Error en delete_resolucion: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
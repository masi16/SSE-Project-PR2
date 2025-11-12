# Archivo: backend/src/services/movimiento.py

from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.movimientos import MovimientoCreate, MovimientoUpdate, MovimientoOut
import traceback

async def create_movimiento(db: AsyncSession, movimiento_data: MovimientoCreate, current_user) -> Optional[MovimientoOut]:
    """Crea un nuevo movimiento."""
    try:
        query = text("""
            INSERT INTO movimientos (fecha_movimiento, descripcion, fk_expediente_id)
            VALUES (:fecha_movimiento, :descripcion, :fk_expediente_id)
        """)
        
        values = {
            "fecha_movimiento": movimiento_data.fecha_movimiento,
            "descripcion": movimiento_data.descripcion,
            "fk_expediente_id": movimiento_data.fk_expediente_id
        }
        
        # --- INICIO DE LA CORRECCIÓN ---
        # 1. Ejecutamos el INSERT y guardamos el resultado
        result = await db.execute(query, values)
        await db.commit()

        # 2. Obtenemos el ID del objeto cursor del resultado
        created_id = result.lastrowid
        if not created_id:
             raise HTTPException(status_code=500, detail="No se pudo obtener el ID del movimiento creado.")

        # 3. Usamos ese ID para obtener el objeto completo y devolverlo
        return await get_movimiento(db, created_id, current_user)
        # --- FIN DE LA CORRECCIÓN ---

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        print(f"Error en create_movimiento: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_movimientos(db: AsyncSession, skip: int = 0, limit: int = 50, current_user=None) -> List[MovimientoOut]:
    """Obtiene lista paginada de movimientos."""
    try:
        query = text("""
            SELECT id, fecha_movimiento, descripcion, fk_expediente_id, fecha_creacion
            FROM movimientos
            ORDER BY id DESC
            LIMIT :limit OFFSET :skip
        """)
        result = await db.execute(query, {"limit": limit, "skip": skip})
        rows = result.mappings().all()
        # Convertimos cada fila a dict antes de la validación para robustez
        movimientos = [MovimientoOut.model_validate(dict(row)) for row in rows]
        return movimientos
    except Exception as e:
        print(f"Error en get_movimientos: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_movimiento(db: AsyncSession, movimiento_id: int, current_user) -> Optional[MovimientoOut]:
    """Obtiene un movimiento específico por ID."""
    try:
        query = text("""
            SELECT id, fecha_movimiento, descripcion, fk_expediente_id, fecha_creacion
            FROM movimientos
            WHERE id = :id
        """)
        result = await db.execute(query, {"id": movimiento_id})
        row = result.mappings().one_or_none()
        
        if row:
            # Convertimos a dict antes de la validación
            return MovimientoOut.model_validate(dict(row))
        return None
    except Exception as e:
        print(f"Error en get_movimiento: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def update_movimiento(db: AsyncSession, movimiento_id: int, movimiento_data: MovimientoUpdate, current_user) -> Optional[MovimientoOut]:
    """Actualiza un movimiento."""
    try:
        update_fields = []
        values = {"id": movimiento_id}
        
        if movimiento_data.fecha_movimiento:
            update_fields.append("fecha_movimiento = :fecha_movimiento")
            values["fecha_movimiento"] = movimiento_data.fecha_movimiento
        if movimiento_data.descripcion:
            update_fields.append("descripcion = :descripcion")
            values["descripcion"] = movimiento_data.descripcion
        
        if not update_fields:
            return await get_movimiento(db, movimiento_id, current_user)
        
        query_str = f"UPDATE movimientos SET {', '.join(update_fields)} WHERE id = :id"
        query = text(query_str)
        
        await db.execute(query, values)
        await db.commit()
        
        return await get_movimiento(db, movimiento_id, current_user)
    except Exception as e:
        await db.rollback()
        print(f"Error en update_movimiento: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def delete_movimiento(db: AsyncSession, movimiento_id: int, current_user) -> bool:
    """Elimina un movimiento."""
    try:
        query = text("DELETE FROM movimientos WHERE id = :id")
        result = await db.execute(query, {"id": movimiento_id})
        await db.commit()
        return result.rowcount > 0
    except Exception as e:
        await db.rollback()
        print(f"Error en delete_movimiento: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
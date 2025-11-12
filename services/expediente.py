from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from pymysql.err import IntegrityError as PyMySQLIntegrityError
from sqlalchemy.exc import IntegrityError as SQLAlchemyIntegrityError

from schemas.expediente import ExpedienteCreate, ExpedienteUpdate, ExpedienteSimple
import traceback

async def create_expediente(db: AsyncSession, expediente: ExpedienteCreate, current_user) -> Optional[ExpedienteSimple]:
    """Crea un nuevo expediente."""
    try:
        query = text("""
            INSERT INTO expedientes (nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_estado_id)
            VALUES (:nro_expediente, :caratula, :fecha_ingreso, :fk_cliente_id, :fk_abogado_id, :fk_estado_id)
        """)
        
        values = {
            "nro_expediente": expediente.nro_expediente,
            "caratula": expediente.caratula,
            "fecha_ingreso": expediente.fecha_ingreso,
            "fk_cliente_id": expediente.fk_cliente_id,
            "fk_abogado_id": expediente.fk_abogado_id,
            "fk_estado_id": expediente.fk_estado_id or 1,
        }
        
        await db.execute(query, values)
        await db.commit()
        
        select_query = text("SELECT id, nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_estado_id FROM expedientes WHERE nro_expediente = :nro_expediente")
        result = await db.execute(select_query, {"nro_expediente": expediente.nro_expediente})
        row = result.mappings().one_or_none()
        
        if row:
            return ExpedienteSimple.model_validate(dict(row))
        return None

    except (PyMySQLIntegrityError, SQLAlchemyIntegrityError) as e:
        await db.rollback()
        if "Duplicate entry" in str(e) and "for key 'nro_expediente'" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un expediente con este número."
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error de integridad en la base de datos: {str(e)}"
        )
    except Exception as e:
        await db.rollback()
        print(f"Error en create_expediente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_expedientes(db: AsyncSession, skip: int = 0, limit: int = 50, current_user=None, estado_id: Optional[int] = None) -> List[ExpedienteSimple]:
    """Obtiene lista paginada de expedientes."""
    try:
        where_clause = ""
        params = {"limit": limit, "skip": skip}
        
        if estado_id:
            where_clause = "WHERE fk_estado_id = :estado_id"
            params["estado_id"] = estado_id
        
        query = text(f"""
            SELECT id, nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_estado_id
            FROM expedientes
            {where_clause}
            ORDER BY id DESC
            LIMIT :limit OFFSET :skip
        """)
        result = await db.execute(query, params)
        rows = result.mappings().all()

        expedientes = [ExpedienteSimple.model_validate(dict(row)) for row in rows]
        return expedientes

    except Exception as e:
        print(f"Error en get_expedientes: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_expediente(db: AsyncSession, expediente_id: int, current_user) -> Optional[ExpedienteSimple]:
    """Obtiene un expediente específico por ID."""
    try:
        query = text("""
            SELECT id, nro_expediente, caratula, fecha_ingreso, fk_cliente_id, fk_abogado_id, fk_estado_id
            FROM expedientes
            WHERE id = :id
        """)
        result = await db.execute(query, {"id": expediente_id})
        row = result.mappings().one_or_none()
        
        if row:
            return ExpedienteSimple.model_validate(dict(row))
        return None
    except Exception as e:
        print(f"Error en get_expediente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def update_expediente(db: AsyncSession, expediente_id: int, expediente_data: ExpedienteUpdate, current_user) -> Optional[ExpedienteSimple]:
    """Actualiza un expediente."""
    try:
        update_fields = []
        values = {"id": expediente_id}
        
        if expediente_data.caratula:
            update_fields.append("caratula = :caratula")
            values["caratula"] = expediente_data.caratula
        if expediente_data.fk_estado_id is not None:
            update_fields.append("fk_estado_id = :fk_estado_id")
            values["fk_estado_id"] = expediente_data.fk_estado_id
        
        if not update_fields:
            return await get_expediente(db, expediente_id, current_user)
        
        query_str = f"UPDATE expedientes SET {', '.join(update_fields)} WHERE id = :id"
        query = text(query_str)
        
        await db.execute(query, values)
        await db.commit()
        
        return await get_expediente(db, expediente_id, current_user)
    except Exception as e:
        await db.rollback()
        print(f"Error en update_expediente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def delete_expediente(db: AsyncSession, expediente_id: int, current_user) -> bool:
    """Elimina un expediente."""
    try:
        query = text("DELETE FROM expedientes WHERE id = :id")
        result = await db.execute(query, {"id": expediente_id})
        await db.commit()
        return result.rowcount > 0
    except Exception as e:
        await db.rollback()
        print(f"Error en delete_expediente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
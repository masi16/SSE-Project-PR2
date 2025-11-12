from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.abogado import AbogadoCreate, AbogadoUpdate, AbogadoOut
import traceback

async def create_abogado(db: AsyncSession, abogado_data: AbogadoCreate, current_user) -> Optional[AbogadoOut]:
    try:
        query = text("""
            INSERT INTO abogados (nombre, apellido, matricula, telefono)
            VALUES (:nombre, :apellido, :matricula, :telefono)
        """)
        
        values = abogado_data.dict()
        await db.execute(query, values)
        await db.commit()
        
        select_query = text("SELECT * FROM abogados WHERE matricula = :matricula")
        result = await db.execute(select_query, {"matricula": abogado_data.matricula})
        row = result.mappings().one_or_none()
        
        if row:
            return AbogadoOut.model_validate(row)
        return None
    except Exception as e:
        await db.rollback()
        print(f"Error en create_abogado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_abogados(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[AbogadoOut]:
    try:
        query = text("SELECT id, nombre, apellido, matricula, telefono FROM abogados LIMIT :limit OFFSET :skip")
        result = await db.execute(query, {"limit": limit, "skip": skip})
        abogados = [AbogadoOut.model_validate(row) for row in result.mappings()]
        return abogados
    except Exception as e:
        print(f"Error en get_abogados: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_abogado(db: AsyncSession, abogado_id: int, current_user) -> Optional[AbogadoOut]:
    try:
        query = text("SELECT id, nombre, apellido, matricula, telefono FROM abogados WHERE id = :id")
        result = await db.execute(query, {"id": abogado_id})
        row = result.mappings().one_or_none()
        
        if row:
            return AbogadoOut.model_validate(row)
        return None
    except Exception as e:
        print(f"Error en get_abogado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def update_abogado(db: AsyncSession, abogado_id: int, abogado_data: AbogadoUpdate, current_user) -> Optional[AbogadoOut]:
    try:
        update_fields = []
        values = {"id": abogado_id}
        
        if abogado_data.nombre:
            update_fields.append("nombre = :nombre")
            values["nombre"] = abogado_data.nombre
        if abogado_data.apellido:
            update_fields.append("apellido = :apellido")
            values["apellido"] = abogado_data.apellido
        if abogado_data.matricula:
            update_fields.append("matricula = :matricula")
            values["matricula"] = abogado_data.matricula
        if abogado_data.telefono:
            update_fields.append("telefono = :telefono")
            values["telefono"] = abogado_data.telefono
        
        if not update_fields:
            return await get_abogado(db, abogado_id, current_user)
        
        query_str = f"UPDATE abogados SET {', '.join(update_fields)} WHERE id = :id"
        query = text(query_str)
        
        await db.execute(query, values)
        await db.commit()
        
        return await get_abogado(db, abogado_id, current_user)
    except Exception as e:
        await db.rollback()
        print(f"Error en update_abogado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def delete_abogado(db: AsyncSession, abogado_id: int, current_user) -> bool:
    try:
        query = text("DELETE FROM abogados WHERE id = :id")
        result = await db.execute(query, {"id": abogado_id})
        await db.commit()
        return result.rowcount > 0
    except Exception as e:
        await db.rollback()
        print(f"Error en delete_abogado: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
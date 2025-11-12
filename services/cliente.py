from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.cliente import ClienteCreate, ClienteUpdate, ClienteOut
import traceback

async def create_cliente(db: AsyncSession, cliente_data: ClienteCreate, current_user) -> Optional[ClienteOut]:
    try:
        query = text("""
            INSERT INTO clientes (nombre, apellido, email, telefono)
            VALUES (:nombre, :apellido, :email, :telefono)
        """)
        
        values = cliente_data.dict()
        await db.execute(query, values)
        await db.commit()
        
        select_query = text("SELECT * FROM clientes WHERE email = :email")
        result = await db.execute(select_query, {"email": cliente_data.email})
        row = result.mappings().one_or_none()
        
        if row:
            return ClienteOut.model_validate(row)
        return None
    except Exception as e:
        await db.rollback()
        print(f"Error en create_cliente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_clientes(db: AsyncSession, skip: int = 0, limit: int = 100, current_user=None) -> List[ClienteOut]:
    try:
        query = text("SELECT id, nombre, apellido, email, telefono FROM clientes LIMIT :limit OFFSET :skip")
        result = await db.execute(query, {"limit": limit, "skip": skip})
        clientes = [ClienteOut.model_validate(row) for row in result.mappings()]
        return clientes
    except Exception as e:
        print(f"Error en get_clientes: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def get_cliente(db: AsyncSession, cliente_id: int, current_user) -> Optional[ClienteOut]:
    try:
        query = text("SELECT id, nombre, apellido, email, telefono FROM clientes WHERE id = :id")
        result = await db.execute(query, {"id": cliente_id})
        row = result.mappings().one_or_none()
        
        if row:
            return ClienteOut.model_validate(row)
        return None
    except Exception as e:
        print(f"Error en get_cliente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def update_cliente(db: AsyncSession, cliente_id: int, cliente_data: ClienteUpdate, current_user) -> Optional[ClienteOut]:
    try:
        update_fields = []
        values = {"id": cliente_id}
        
        if cliente_data.nombre:
            update_fields.append("nombre = :nombre")
            values["nombre"] = cliente_data.nombre
        if cliente_data.apellido:
            update_fields.append("apellido = :apellido")
            values["apellido"] = cliente_data.apellido
        if cliente_data.email:
            update_fields.append("email = :email")
            values["email"] = cliente_data.email
        if cliente_data.telefono:
            update_fields.append("telefono = :telefono")
            values["telefono"] = cliente_data.telefono
        
        if not update_fields:
            return await get_cliente(db, cliente_id, current_user)
        
        query_str = f"UPDATE clientes SET {', '.join(update_fields)} WHERE id = :id"
        query = text(query_str)
        
        await db.execute(query, values)
        await db.commit()
        
        return await get_cliente(db, cliente_id, current_user)
    except Exception as e:
        await db.rollback()
        print(f"Error en update_cliente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def delete_cliente(db: AsyncSession, cliente_id: int, current_user) -> bool:
    try:
        query = text("DELETE FROM clientes WHERE id = :id")
        result = await db.execute(query, {"id": cliente_id})
        await db.commit()
        return result.rowcount > 0
    except Exception as e:
        await db.rollback()
        print(f"Error en delete_cliente: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
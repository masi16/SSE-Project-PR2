from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete, func
from ..models import expediente_models as models
from ..schemas import expediente_schemas as schemas

# --- CRUD (Create, Read, Update, Delete) ---

async def create_expediente(db: AsyncSession, expediente: schemas.ExpedienteCreate):
    db_expediente = models.Expediente(**expediente.model_dump())
    db.add(db_expediente)
    await db.commit()
    await db.refresh(db_expediente)
    return db_expediente

async def get_expediente(db: AsyncSession, expediente_id: int):
    result = await db.execute(select(models.Expediente).filter(models.Expediente.id == expediente_id))
    return result.scalars().first()

# --- Consultas Complejas (Requisito del Práctico) ---

async def get_expedientes_con_info_cliente(db: AsyncSession, skip: int = 0, limit: int = 100):
    # Consulta con INNER JOIN (implícito en SQLAlchemy)
    query = select(models.Expediente, models.Cliente.nombre, models.Cliente.apellido)\
            .join(models.Cliente, models.Expediente.fk_cliente_id == models.Cliente.id)\
            .offset(skip).limit(limit)
    result = await db.execute(query)
    return result.all()

async def count_expedientes_por_abogado(db: AsyncSession):
    # Consulta con GROUP BY
    query = select(models.Expediente.fk_abogado_id, func.count(models.Expediente.id).label("total"))\
            .group_by(models.Expediente.fk_abogado_id)
    result = await db.execute(query)
    return result.all()
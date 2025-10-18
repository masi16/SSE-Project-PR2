from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

# Schema base con los campos compartidos
class ExpedienteBase(BaseModel):
    nro_expediente: str = Field(..., min_length=3, max_length=50)
    caratula: str = Field(..., max_length=255)
    fecha_ingreso: date
    fk_cliente_id: int
    fk_abogado_id: int

# Schema para la creación de un expediente (lo que la API espera recibir)
class ExpedienteCreate(ExpedienteBase):
    pass # Hereda todos los campos

# Schema para la actualización
class ExpedienteUpdate(BaseModel):
    nro_expediente: Optional[str] = None
    caratula: Optional[str] = None
    # ... otros campos que permitas actualizar ...

# Schema para la respuesta de la API (lo que la API devuelve)
class Expediente(ExpedienteBase):
    id: int
    fecha_creacion: date

    class Config:
        from_attributes = True # Magia para que Pydantic entienda los modelos SQLAlchemy
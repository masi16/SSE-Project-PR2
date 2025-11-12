from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class EstadoInfo(BaseModel):
    id: int
    nombre: str

class ExpedienteBase(BaseModel):
    nro_expediente: str = Field(..., max_length=50)
    caratula: str = Field(..., max_length=255)
    fecha_ingreso: date
    fk_cliente_id: int
    fk_abogado_id: int
    fk_estado_id: Optional[int] = Field(1, description="ID del estado (default: 1 = Abierto)")
    fk_tipo_juicio_id: Optional[int] = None

class ExpedienteCreate(ExpedienteBase):
    pass

class ExpedienteUpdate(BaseModel):
    caratula: Optional[str] = Field(None, max_length=255)
    fk_estado_id: Optional[int] = None

class ExpedienteSimple(BaseModel):
    id: int
    nro_expediente: str
    caratula: str
    fecha_ingreso: date
    fk_cliente_id: int
    fk_abogado_id: int
    # --- INICIO DE LA CORRECCIÓN ---
    # Permitimos que el estado sea opcional (puede ser None)
    fk_estado_id: Optional[int] = None
    # --- FIN DE LA CORRECCIÓN ---
    
    class Config:
        from_attributes = True

class ExpedienteConEstado(ExpedienteSimple):
    estado: Optional[EstadoInfo] = None
    
    class Config:
        from_attributes = True

class ExpedienteDetallado(ExpedienteSimple):
    class Config:
        from_attributes = True
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List
from .cliente import ClienteOut as Cliente
from .abogado import AbogadoOut as Abogado 
from .movimientos import MovimientoOut as Movimientos
from .resolucion import ResolucionOut as Resolucion

class ExpedienteBase(BaseModel):
    nro_expediente: str = Field(..., max_length=50)
    caratula: str = Field(..., max_length=255)
    fecha_ingreso: date
    fk_cliente_id: int
    fk_abogado_id: int
    fk_juzgado_id: int
    fk_tipo_juicio_id: Optional[int] = None
    fk_estado_id: Optional[int] = None

class ExpedienteCreate(ExpedienteBase):
    pass

class ExpedienteUpdate(BaseModel):
    caratula: Optional[str] = Field(None, max_length=255)
    fk_estado_id: Optional[int] = None

class ExpedienteSimple(ExpedienteBase):
    id: int
    
    class Config:
        from_attributes = True

class ExpedienteDetallado(ExpedienteSimple):
    cliente: Cliente
    abogado: Abogado
    movimientos: List[Movimientos] = []
    resoluciones: List[Resolucion] = []
    
    class Config:
        from_attributes = True
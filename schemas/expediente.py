from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List
from .cliente import Cliente
from .abogado import Abogado 
from .movimientos import Movimientos
from .resolucion import Resolucion

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
    # Podríamos añadir aquí un campo para el primer movimiento si quisiéramos
    # primer_movimiento_desc: str
    pass

class ExpedienteUpdate(BaseModel):
    # Para actualizar, solo permitimos cambiar ciertos campos
    caratula: Optional[str] = Field(None, max_length=255)
    fk_estado_id: Optional[int] = None
    # No permitimos cambiar el cliente o el abogado, por ejemplo

# --- SCHEMAS DE RESPUESTA ---

# Schema básico de respuesta (para listas, donde no queremos todos los detalles)
class ExpedienteSimple(ExpedienteBase):
    id: int
    
    class Config:
        from_attributes = True

# Schema de respuesta detallado (para cuando se pide un solo expediente)
class ExpedienteDetallado(ExpedienteSimple):
    # Anidamos la información de las claves foráneas
    # El frontend recibirá el objeto completo del cliente, no solo su ID.
    cliente: Cliente
    abogado: Abogado
    
    # También podemos anidar las listas de movimientos y resoluciones
    movimientos: List[Movimientos] = []
    resoluciones: List[Resolucion] = []
    
    class Config:
        from_attributes = True
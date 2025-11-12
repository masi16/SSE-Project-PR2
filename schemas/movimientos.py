from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class MovimientoCreate(BaseModel):
    fecha_movimiento: date = Field(..., example="2025-01-01")
    descripcion: Optional[str] = Field(None, max_length=2000)
    fk_expediente_id: int = Field(..., example=1)

class MovimientoUpdate(BaseModel):
    fecha_movimiento: Optional[date] = Field(None)
    descripcion: Optional[str] = Field(None, max_length=2000)

class MovimientoOut(BaseModel):
    id: int
    fecha_movimiento: date
    descripcion: Optional[str] = None
    fk_expediente_id: int
    fecha_creacion: Optional[datetime] = None
    
    class Config:
        from_attributes = True
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class MovimientoCreate(BaseModel):
    fecha_movimiento: date = Field(..., example="2025-01-01", description="Fecha del movimiento (AAAA-MM-DD)")
    descripcion: Optional[str] = Field(None, max_length=2000, example="Presentación de escrito inicial")
    fk_expediente_id: int = Field(..., example=1, description="ID del expediente al que pertenece el movimiento")

class MovimientoUpdate(BaseModel):
    fecha_movimiento: Optional[date] = Field(None, example="2025-01-02")
    descripcion: Optional[str] = Field(None, max_length=2000)
    fk_expediente_id: Optional[int] = Field(None)

class MovimientoOut(BaseModel):
    id: int
    fecha_movimiento: date
    descripcion: Optional[str]
    fk_expediente_id: int
    fecha_creacion: datetime

    class Config:
        orm_mode = True

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class ResolucionCreate(BaseModel):
    texto_resolucion: str = Field(..., example="La resolución del caso es favorable al demandante.")
    fecha_resolucion: date = Field(..., example="2024-11-20", description="Fecha de la resolución en formato AAAA-MM-DD")
    fk_tipo_resolucion_id: Optional[int] = Field(None, example=1, description="ID del tipo de resolución (opcional)")
    
    
    fk_expediente_id: int = Field(..., example=1, description="ID del expediente asociado")
    

class ResolucionUpdate(BaseModel):
    texto_resolucion: Optional[str] = Field(None, example="Texto actualizado")
    fecha_resolucion: Optional[date] = Field(None, example="2024-12-01")
    fk_tipo_resolucion_id: Optional[int] = Field(None, example=2)

class ResolucionOut(BaseModel):
    id: int
    texto_resolucion: str
    fecha_resolucion: Optional[date]
    fecha_creacion: datetime
    fk_tipo_resolucion_id: Optional[int]
    fk_expediente_id: Optional[int]

    class Config:
        orm_mode = True
from pydantic import BaseModel, Field 
from typing import Optional
from datetime import date 

class ConsultaCreate(BaseModel): 
    fecha_consulta: date = Field(..., example="2024-07-15") 
    tema_consulta: str = Field(..., min_length=5, max_length=200, example="Consulta sobre productos") 
    detalles_adicionales: Optional[str] = Field(None, max_length=500, example="Detalles adicionales sobre la consulta")

class ConsultaUpdate(BaseModel): 
    fecha_consulta: Optional[date] = Field(None, example="2024-07-15") 
    tema_consulta: Optional[str] = Field(None, min_length=5, max_length=200) 
    detalles_adicionales: Optional[str] = Field(None, max_length=500)

class ConsultaOut(BaseModel): 
    id: int 
    fecha_consulta: date
    tema_consulta: str = Field(..., min_length=5, max_length=200)


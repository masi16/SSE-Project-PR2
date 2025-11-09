from pydantic import BaseModel, Field
from typing import Optional

class JuzgadoCreate(BaseModel): 
    nombre: str = Field(..., min_length=2, max_length=100)
    fuero: str = Field(..., min_length=2, max_length=100)
    circunscripcion: str = Field(..., min_length=2, max_length=100)

class JuzgadoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    fuero: Optional[str] = Field(None, min_length=2, max_length=100)
    circunscripcion: Optional[str] = Field(None, min_length=2, max_length=100)

class JuzgadoOut(BaseModel): 
    id: int 
    nombre: str 
    fuero: str
    circunscripcion: str
from pydantic import BaseModel, Field
from typing import Optional

class AbogadoCreate(BaseModel): 
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
    matricula: str = Field(..., min_length=5, max_length=20)
    telefono: Optional[str] = Field(None, regex=r'^\+?[\d\s-]+$')

class AbogadoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    apellido: Optional[str] = Field(None, min_length=2, max_length=100)
    matricula: Optional[str] = Field(None, min_length=5, max_length=20)
    telefono: Optional[str] = Field(None, regex=r'^\+?[\d\s-]+$')
    
class AbogadoOut(BaseModel): 
    id: int 
    nombre: str 
    apellido: str
    matricula: str
    telefono: Optional[str] = None
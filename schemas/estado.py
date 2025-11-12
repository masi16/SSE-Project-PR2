from pydantic import BaseModel, Field
from typing import Optional

class EstadoCreate(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=50, example="Abierto")
    descripcion: Optional[str] = Field(None, max_length=255)

class EstadoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=3, max_length=50)
    descripcion: Optional[str] = Field(None, max_length=255)

class EstadoOut(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None

    class Config:
        from_attributes = True
        orm_mode = True
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ClienteCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, example="Juan")
    apellido: str = Field(..., min_length=2, max_length=100, example="Gómez")
    email: EmailStr = Field(..., example="juan.perez@example.com")
    telefono: Optional[str] = Field(None, example="+34123456789")

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    apellido: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = Field(None)
    telefono: Optional[str] = Field(None, example="+34123456789")

class ClienteOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None

    class Config:
        orm_mode = True
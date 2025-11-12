from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UsuarioBase(BaseModel):
    email: EmailStr
    rol: str = "Usuario"
    fk_abogado_id: Optional[int] = None

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8, description="La contraseña debe tener al menos 8 caracteres")

class UsuarioOut(UsuarioBase):
    id: int
    
    class Config:
        from_attributes = True
        orm_mode = True
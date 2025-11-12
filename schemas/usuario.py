from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UsuarioBase(BaseModel):
    email: EmailStr
    rol: str = "usuario"
    fk_abogado_id: Optional[int] = None

class UsuarioCreate(UsuarioBase):
    password: str = Field(
        ..., 
        min_length=8,
        max_length=72,
        description="La contraseña debe tener entre 8 y 72 caracteres (límite de bcrypt)"
    )

class UsuarioUpdate(BaseModel):
    email: Optional[EmailStr] = None
    rol: Optional[str] = None
    fk_abogado_id: Optional[int] = None

class UsuarioOut(UsuarioBase):
    id: int
    
    class Config:
        from_attributes = True
        orm_mode = True
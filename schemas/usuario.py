from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UsuarioBase(BaseModel):
    email: EmailStr
    rol: str = Field(..., pattern="^(abogado|admin)$") # Valida que el rol sea uno de los permitidos
    fk_abogado_id: Optional[int] = None

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8, description="La contraseña debe tener al menos 8 caracteres")

class Usuario(UsuarioBase):
    id: int
    
    class Config:
        from_attributes = True
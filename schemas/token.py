from pydantic import BaseModel
from typing import Optional

# Schema para la respuesta del endpoint de login
class Token(BaseModel):
    access_token: str
    token_type: str
    
# Schema para los datos contenidos dentro del token JWT
class TokenData(BaseModel):
    email: Optional[str] = None
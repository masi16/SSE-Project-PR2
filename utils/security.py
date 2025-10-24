from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

# Importamos la configuración y la función para obtener la sesión de BD
from ..config.settings import settings
from ..config.database import get_db
# Importaremos el servicio de usuario para buscar usuarios en la BD
from ..services import usuario_service 
# Importaremos un schema para validar los datos del token
from ..schemas.expediente import TokenData 

# 1. Configuración de Seguridad para Contraseñas
# Usamos bcrypt, el algoritmo estándar y más seguro para hashear contraseñas.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. Esquema de Seguridad de FastAPI para obtener el token de las cabeceras
# tokenUrl="token" le dice a la documentación de Swagger UI a qué endpoint debe apuntar para obtener el token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- FUNCIONES DE MANEJO DE CONTRASEÑAS ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si una contraseña en texto plano coincide con su hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Genera el hash de una contraseña en texto plano."""
    return pwd_context.hash(password)

# --- FUNCIONES DE MANEJO DE JWT ---

def create_access_token(data: dict):
    """Crea un nuevo token de acceso JWT."""
    to_encode = data.copy()
    
    # Añadimos un tiempo de expiración al token
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # Codificamos el token con nuestra clave secreta y algoritmo
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

# --- DEPENDENCIA PARA PROTEGER RUTAS ---

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
):
    """
    Dependencia de FastAPI: decodifica el token, valida las credenciales
    y devuelve el usuario actual de la base de datos.
    Esta función será el "guardián" de nuestras rutas protegidas.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decodificamos el token
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub") # "sub" (subject) es el nombre estándar para el identificador del usuario
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        # Si el token es inválido (expirado, malformado, etc.)
        raise credentials_exception
        
    # Buscamos al usuario en la base de datos
    user = await usuario_service.get_usuario_by_email(db, email=token_data.email)
    
    if user is None:
        # Si el usuario no existe en la BD (p. ej. fue eliminado después de emitir el token)
        raise credentials_exception
        
    return user
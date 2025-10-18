# app/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # URL de conexión a la base de datos MySQL (con driver asíncrono aiomysql)
    DATABASE_URL: str
    
    # Clave secreta para firmar los tokens JWT
    JWT_SECRET_KEY: str
    
    # Algoritmo para JWT
    JWT_ALGORITHM: str = "HS256"
    
    # Tiempo de expiración del token de acceso en minutos
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        # Lee las variables desde un archivo .env
        env_file = ".env"

settings = Settings()
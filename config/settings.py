from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    
    # 1. URL de Conexión a tu Base de Datos MySQL
    # El formato incluye el driver asíncrono 'aiomysql' como pide el práctico.
    DATABASE_URL: str
    
    # 2. Clave Secreta para firmar los JSON Web Tokens (JWT)
    # Debe ser una cadena de texto larga y aleatoria.
    JWT_SECRET_KEY: str
    
    # 3. Algoritmo de encriptación para los JWT
    JWT_ALGORITHM: str = "HS256"
    
    # 4. Tiempo de vida del token de acceso en minutos
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        # Indica a Pydantic que lea las variables desde este archivo
        env_file = ".env"

# Creamos una instancia global de la configuración para usarla en toda la app
settings = Settings()
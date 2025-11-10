from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    username: str 
    password: str
    host: str
    port: int
    database: str
    # URL completa para SQLAlchemy async (ej: mysql+aiomysql://user:pass@host:3306/dbname)
    DATABASE_URL: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
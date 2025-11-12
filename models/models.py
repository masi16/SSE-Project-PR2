from sqlalchemy import (
    Column, Integer, String, Date, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

# --- NUEVA TABLA: ESTADO ---
class Estado(Base):
    __tablename__ = "estados"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), unique=True, nullable=False)
    descripcion = Column(String(255), nullable=True)
    
    # Relaciones
    expedientes = relationship("Expediente", back_populates="estado")

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(50), nullable=False, default="usuario")
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    
    fk_abogado_id = Column(Integer, ForeignKey("abogados.id"), nullable=True)
    abogado = relationship("Abogado", back_populates="usuario")

class Abogado(Base):
    __tablename__ = "abogados"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    matricula = Column(String(20), unique=True, nullable=False)
    telefono = Column(String(50), nullable=True)

    usuario = relationship("Usuario", back_populates="abogado", uselist=False)
    expedientes = relationship("Expediente", back_populates="abogado")

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True)
    telefono = Column(String(50), nullable=True)

    expedientes = relationship("Expediente", back_populates="cliente")

class Expediente(Base):
    __tablename__ = "expedientes"
    id = Column(Integer, primary_key=True, index=True)
    nro_expediente = Column(String(50), unique=True, nullable=False)
    caratula = Column(String(255), nullable=False)
    fecha_ingreso = Column(Date, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    fk_cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    fk_abogado_id = Column(Integer, ForeignKey("abogados.id"), nullable=False)
    fk_estado_id = Column(Integer, ForeignKey("estados.id"), nullable=False, default=1)

    # Relaciones
    cliente = relationship("Cliente", back_populates="expedientes")
    abogado = relationship("Abogado", back_populates="expedientes")
    estado = relationship("Estado", back_populates="expedientes")
    movimientos = relationship("Movimiento", back_populates="expediente")
    resoluciones = relationship("Resolucion", back_populates="expediente")

class Movimiento(Base):
    __tablename__ = "movimientos"
    id = Column(Integer, primary_key=True, index=True)
    fecha_movimiento = Column(Date, nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    
    fk_expediente_id = Column(Integer, ForeignKey("expedientes.id"), nullable=False)
    expediente = relationship("Expediente", back_populates="movimientos")

class Resolucion(Base):
    __tablename__ = "resoluciones"
    id = Column(Integer, primary_key=True, index=True)
    texto_resolucion = Column(Text, nullable=False)
    fecha_resolucion = Column(Date, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())

    fk_expediente_id = Column(Integer, ForeignKey("expedientes.id"), nullable=False)
    expediente = relationship("Expediente", back_populates="resoluciones")
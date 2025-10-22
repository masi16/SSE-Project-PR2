import email
from pymysql import NULL
from sqlalchemy import (Column, Integer, String, Date, Text, ForeignKey, TIMESTAMP, Enum)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..config.database import Base

class Abogado(Base):
    __tablename__ = "abogados"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    matricula = Column(String(20), unique=True, nullable=True)
    telefono = Column(String(20), nullable=True)

    expedientes = relationship("Expediente", back_populates="abogado", cascade="all, delete-orphan")
    usuario = relationship("Usuario", back_populates="abogado", uselist=False)

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    telefono = Column(String(20), nullable=True)

    expedientes = relationship("Expediente", back_populates="cliente", cascade="all, delete-orphan")
    consultas = relationship("Consulta", back_populates="cliente", cascade="all, delete-orphan")

class EstadoExpediente(Base):
    __tablename__ = "estados_expediente"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(50), unique=True, nullable=False)

    expedientes = relationship("Expediente", back_populates="estado_expediente")

class TipoJuicio(Base):
    __tablename__ = "tipos_juicio"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(50), unique=True, nullable=False)

class TipoResolucion(Base):
    __tablename__ = "tipos_resolucion"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(50), unique=True, nullable=False)

class Juzgado(Base):
    __tablename__ = "juzgados"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(150), nullable=False)
    fuero = Column(String(50), nullable=True)
    circunscripcion = Column(String(50), nullable=True)

    expedientes = relationship("Expediente", back_populates="juzgado", cascade="all, delete-orphan")

class Expediente(Base):
    __tablename__ = "expedientes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nro_expediente = Column(String(50), nullable=False, unique=True)
    caratula = Column(String(255), nullable=False)
    fecha_ingreso = Column(Date, nullable=False)

    fk_tipo_juicio_id = Column(Integer, ForeignKey("tipos_juicio.id"), nullable=True)
    fk_estado_id = Column(Integer, ForeignKey("estados_expediente.id"), nullable=True)
    fk_cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    fk_abogado_id = Column(Integer, ForeignKey("abogados.id"), nullable=False)
    fk_juzgado_id = Column(Integer, ForeignKey("juzgados.id"), nullable=True)

    fecha_creacion = Column(TIMESTAMP, nullable=True, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, nullable=True, server_default=func.now(), onupdate=func.now())

    abogado = relationship("Abogado", back_populates="expedientes")
    cliente = relationship("Cliente", back_populates="expedientes")
    estado_expediente = relationship("EstadoExpediente", back_populates="expedientes")
    tipo_juicio = relationship("TipoJuicio")
    juzgado = relationship("Juzgado", back_populates="expedientes")

    resoluciones = relationship("Resolucion", back_populates="expediente", cascade="all, delete-orphan")
    movimientos = relationship("Movimiento", back_populates="expediente", cascade="all, delete-orphan")
    consultas = relationship("Consulta", back_populates="expediente", cascade="all, delete-orphan")

class Movimiento(Base):
    __tablename__ = "movimientos"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    fecha_movimiento = Column(Date, nullable=False)
    descripcion = Column(Text, nullable=True)
    fk_expediente_id = Column(Integer, ForeignKey("expedientes.id"), nullable=False)
    fecha_creacion = Column(TIMESTAMP, nullable=True, server_default=func.now())

    expediente = relationship("Expediente", back_populates="movimientos")

class Resolucion(Base):
    __tablename__ = "resoluciones"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    fecha_resolucion = Column(Date, nullable=True)
    texto_resolucion = Column(Text, nullable=True)
    fk_tipo_resolucion_id = Column(Integer, ForeignKey("tipos_resolucion.id"), nullable=True)
    fk_expediente_id = Column(Integer, ForeignKey("expedientes.id"), nullable=False)
    fecha_creacion = Column(TIMESTAMP, nullable=True, server_default=func.now())

    expediente = relationship("Expediente", back_populates="resoluciones")
    tipo_resolucion = relationship("TipoResolucion")

class Consulta(Base):
    __tablename__ = "consultas"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    fecha_consulta = Column(TIMESTAMP, nullable=False, server_default=func.now())
    tema_consulta = Column(Text, nullable=False)
    fk_cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    fk_abogado_id = Column(Integer, ForeignKey("abogados.id"), nullable=False)
    fk_expediente_id = Column(Integer, ForeignKey("expedientes.id"), nullable=True)

    cliente = relationship("Cliente", back_populates="consultas")
    abogado = relationship("Abogado")
    expediente = relationship("Expediente", back_populates="consultas")

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    fk_abogado_id = Column(Integer, ForeignKey("abogados.id"), unique=True, nullable=True)
    rol = Column(Enum('abogado', 'admin', name="rol_enum"), nullable=False, default='abogado')
    fecha_creacion = Column(TIMESTAMP, nullable=True, server_default=func.now())

    abogado = relationship("Abogado", back_populates="usuario")

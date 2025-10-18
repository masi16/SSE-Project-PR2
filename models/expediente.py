import email
from pymysql import NULL
from sqlalchemy import (Column, Integer, String, Date, Text, ForeignKey, 
                        TIMESTAMP, Enum)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..config.database import Base

# Debes crear una clase para CADA tabla que diseñaste.
# Aquí un ejemplo con Expediente y Usuario.

class Abogado(Base): 
    __tablename__ = "Abogados"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    matricula = Column(String(20), unique=True, nullable=True)
    telefono = Column(String(20), nullable=True)
    expedientes = relationship("Expediente", back_populates="abogado")
    # Equivalente SQL:
    # CREATE TABLE `Abogados` (
    #   `id` int NOT NULL AUTO_INCREMENT,
    #   `nombre` varchar(100) NOT NULL,
    #   `apellido` varchar(100) NOT NULL,
    #   `matricula` varchar(20) DEFAULT NULL,
    #   `telefono` varchar(20) DEFAULT NULL,
    #   PRIMARY KEY (`id`),
    #   UNIQUE KEY `matricula` (`matricula`)

class Cliente(Base): 
    __tablename__ = "Cliente"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    telefono = Column(String(20), nullable=False)
    expedientes = relationship("Expediente", back_populates="cliente")
    # Equivalente SQL: CREATE TABLE `clientes` (
  #`id` int NOT NULL AUTO_INCREMENT,
  #`nombre` varchar(100) NOT NULL,
  #`apellido` varchar(100) NOT NULL,
  #`email` varchar(100) DEFAULT NULL,
  #`telefono` varchar(20) NOT NULL,
  #PRIMARY KEY (`id`),
  #UNIQUE KEY `email` (`email`)
#) ENGINE=InnoDB DEFAULT CHARSET=latin1



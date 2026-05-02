from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Numeric, Text, Boolean
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from .database import Base

class TipoCondicion(enum.Enum):
    UNO = "1"
    DOS = "2"

class TipoAdelanto(enum.Enum):
    VALE_COMBUSTIBLE = "Vale Combustible"
    VALE_EFECTIVO = "Vale Efectivo"

class RolUsuario(enum.Enum):
    SUPERADMINISTRADOR = "superadministrador"
    OPERADOR = "operador"

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    cuit = Column(String(20), unique=True, nullable=False)
    activo = Column(Boolean, default=True)
    viajes = relationship("Viaje", back_populates="cliente")
    tarifas = relationship("Tarifa", back_populates="cliente")

class Transportista(Base):
    __tablename__ = "transportistas"
    id = Column(Integer, primary_key=True, index=True)
    codTrans = Column(Integer, unique=True, index=True)
    nomTrans = Column(String(100), nullable=False)
    cuitTrans = Column(String(20), unique=True, nullable=False)
    telTrans = Column(String(50))
    calleTrans = Column(String(100))
    nroCalleTrans = Column(String(20))
    cp = Column(String(20))
    localidad = Column(String(100))
    provincia = Column(String(100))
    activo = Column(Boolean, default=True)
    viajes = relationship("Viaje", back_populates="transportista")
    adelantos = relationship("Adelanto", back_populates="transportista")

class Tarifa(Base):
    __tablename__ = "tarifas"
    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    precio_km_ton = Column(Numeric(12, 2), nullable=False) # Precio base
    fecha_desde = Column(DateTime, nullable=False)
    fecha_hasta = Column(DateTime, nullable=False)
    cliente = relationship("Cliente", back_populates="tarifas")

class Viaje(Base):
    __tablename__ = "viajes"
    id = Column(Integer, primary_key=True, index=True)
    ordenante = Column(String(100), unique=True, index=True, nullable=False)
    propio_tercero = Column(String(50))
    chofer = Column(String(100))
    fecha = Column(DateTime, default=datetime.utcnow)
    carta_porte = Column(String(100), index=True, nullable=False)
    mercaderia = Column(String(100))
    dominio_camion = Column(String(20))        # Patente del camión
    dominio_acoplado = Column(String(20))      # Patente del acoplado (opcional)
    lugar_desde = Column(String(100))
    lugar_hasta = Column(String(100))
    prov_origen = Column(String(50))
    prov_destino = Column(String(50))
    kms = Column(Float, default=0.0)
    kilos = Column(Float, default=0.0)
    cubicaje = Column(Float, default=0.0)
    condicion = Column(Enum(TipoCondicion), nullable=False)
    
    # Lógica Financiera
    tarifa_aplicada = Column(Numeric(12, 2))
    importe = Column(Numeric(12, 2))      # kms * (kilos/1000) * tarifa
    comision_8 = Column(Numeric(12, 2))   # importe * 0.08
    neto = Column(Numeric(12, 2))         # importe - comision
    iva_21 = Column(Numeric(12, 2))       # neto * 0.21
    varios = Column(Numeric(12, 2), default=0.0)
    adelantos_consumidos = Column(Numeric(12, 2), default=0.0)
    saldo = Column(Numeric(12, 2))
    
    # Facturación y Administración
    orden_pago = Column(String(100))
    factura_gavem = Column(String(100))
    imp_fact_gavem = Column(Numeric(12, 2))
    nro_fc_transportista = Column(String(100))
    imp_fact_transportista = Column(Numeric(12, 2))
    rentabilidad = Column(Numeric(12, 2))
    comentario = Column(Text)
    observaciones = Column(Text)

    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    transportista_id = Column(Integer, ForeignKey("transportistas.id"))
    cliente = relationship("Cliente", back_populates="viajes")
    transportista = relationship("Transportista", back_populates="viajes")
    adelantos = relationship("Adelanto", back_populates="viaje")

class Adelanto(Base):
    __tablename__ = "adelantos"
    id = Column(Integer, primary_key=True)
    nro_vale = Column(String(50), unique=True)
    tipo = Column(Enum(TipoAdelanto), nullable=False)
    monto_total = Column(Numeric(12, 2), nullable=False)
    fecha_emision = Column(DateTime, default=datetime.utcnow)
    observaciones = Column(Text, nullable=True)
    transportista_id = Column(Integer, ForeignKey("transportistas.id"))
    viaje_id = Column(Integer, ForeignKey("viajes.id"), nullable=True)  # Un adelanto -> un solo viaje (opcional)
    transportista = relationship("Transportista", back_populates="adelantos")
    viaje = relationship("Viaje", back_populates="adelantos")

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column("hashed_password", String(255), nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    telefono = Column(String(50), nullable=True)
    rol = Column(String(30), nullable=False, default=RolUsuario.OPERADOR.value)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=datetime.utcnow)
    actualizado_en = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sesiones = relationship("SessionToken", back_populates="usuario", cascade="all, delete-orphan")

class SessionToken(Base):
    __tablename__ = "session_tokens"
    id = Column(Integer, primary_key=True)
    token = Column(String(255), unique=True, index=True, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    expiracion = Column(DateTime, nullable=False)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=datetime.utcnow)
    usuario = relationship("Usuario", back_populates="sesiones")

class HistorialCambio(Base):
    __tablename__ = "historial_cambios"
    id = Column(Integer, primary_key=True)
    entidad = Column(String(50), nullable=False) # 'Viaje' o 'Adelanto'
    entidad_id = Column(Integer, index=True, nullable=False)
    accion = Column(String(50), nullable=False) # 'CREACION', 'MODIFICACION', 'ELIMINACION'
    detalles = Column(Text) # JSON con detalles (qué cambió)
    usuario = Column(String(100), default="Usuario del Sistema")
    empleado_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True, index=True)
    empleado_nombre = Column(String(100), nullable=True)
    empleado_apellido = Column(String(100), nullable=True)
    empleado_telefono = Column(String(50), nullable=True)
    fecha = Column(DateTime, default=datetime.utcnow)
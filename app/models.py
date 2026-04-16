from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Numeric, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

# --- ENUMERACIONES (Reglas de Negocio) ---

class TipoCondicion(enum.Enum):
    CONDICION_1 = "Condicion 1"
    CONDICION_2 = "Condicion 2"

class TipoAdelanto(enum.Enum):
    VALE_COMBUSTIBLE = "Vale Combustible"
    VALE_EFECTIVO = "Vale Efectivo"

class EstadoViaje(enum.Enum):
    PENDIENTE = "Pendiente"      # Creado
    FINALIZADO = "Finalizado"    # Con datos de descarga
    LIQUIDADO = "Liquidado"      # Ya pagado al transportista

# --- MODELOS MAESTROS ---

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
    codigo_fletero = Column(Integer, unique=True)
    nombre = Column(String(100), nullable=False)
    cuit = Column(String(20), unique=True, nullable=False)
    telefono = Column(String(50))
    activo = Column(Boolean, default=True)

    viajes = relationship("Viaje", back_populates="transportista")
    adelantos = relationship("Adelanto", back_populates="transportista")

class Tarifa(Base):
    __tablename__ = "tarifas"
    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    origen = Column(String(100))
    destino = Column(String(100))
    precio_km_ton = Column(Numeric(12, 2), nullable=False)
    fecha_vigencia = Column(DateTime, default=datetime.utcnow)
    
    cliente = relationship("Cliente", back_populates="tarifas")

# --- NÚCLEO OPERATIVO: VIAJES ---

class Viaje(Base):
    """
    Representa la operación logística completa de GAVEM SA.
    """
    __tablename__ = "viajes"
    id = Column(Integer, primary_key=True, index=True)
    
    # REQUERIMIENTO: Ordenante como identificador único del recorrido
    ordenante = Column(String(100), unique=True, index=True, nullable=False)
    carta_de_porte = Column(String(100), index=True)
    
    # REQUERIMIENTO: Datos del Chofer (Nombre y Teléfono sin ID)
    nombre_chofer = Column(String(100))
    telefono_chofer = Column(String(50))
    
    # REQUERIMIENTO: Condición 1 o Condición 2
    condicion = Column(Enum(TipoCondicion), nullable=False)

    # Datos de Ruta y Carga (Excel)
    fecha_viaje = Column(DateTime, default=datetime.utcnow)
    mercaderia = Column(String(100))
    procedencia = Column(String(100))
    destino = Column(String(100))
    kms = Column(Float, default=0.0)
    kilos = Column(Float, default=0.0)

    # --- LÓGICA FINANCIERA (GAVEM SA) ---
    tarifa_aplicada = Column(Numeric(12, 2)) # Precio del momento
    importe_bruto = Column(Numeric(12, 2))   # kms * kilos * tarifa
    
    # Comisión Gavem (8%)
    porcentaje_comision = Column(Numeric(5, 2), default=8.00)
    monto_comision = Column(Numeric(12, 2))  
    
    # Valor Neto e IVA (21%)
    valor_neto = Column(Numeric(12, 2))      # Importe Bruto - Comisión
    monto_iva = Column(Numeric(12, 2))       # Valor Neto * 0.21
    
    # Deducciones y Saldo Final
    varios = Column(Numeric(12, 2), default=0.00)
    saldo_a_pagar = Column(Numeric(12, 2))   # (Neto + IVA) - Adelantos - Varios
    
    # Datos Administrativos
    factura_gavem = Column(String(50))
    factura_fletero = Column(String(50))
    orden_de_pago = Column(String(50))
    observaciones = Column(Text)
    
    estado = Column(Enum(EstadoViaje), default=EstadoViaje.PENDIENTE)

    # Relaciones
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
    
    # Si es Combustible (Excel)
    litros = Column(Float, nullable=True)
    precio_unitario_litro = Column(Numeric(12, 2), nullable=True)
    
    transportista_id = Column(Integer, ForeignKey("transportistas.id"))
    viaje_id = Column(Integer, ForeignKey("viajes.id"), nullable=True)

    transportista = relationship("Transportista", back_populates="adelantos")
    viaje = relationship("Viaje", back_populates="adelantos")
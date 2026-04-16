# Gavem-SA


from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Numeric, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

# --- ENUMERACIONES PARA CONSISTENCIA ---

class TipoAdelanto(enum.Enum):
    VALE_COMBUSTIBLE = "Vale Combustible"
    VALE_EFECTIVO = "Vale Efectivo"

class EstadoViaje(enum.Enum):
    PENDIENTE = "Pendiente"
    FINALIZADO = "Finalizado"
    LIQUIDADO = "Liquidado" # Ya se generó el pago final

# --- MODELOS DE MAESTROS (GESTIÓN DE CLIENTES Y TRANSPORTISTAS) ---

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    cuit = Column(String(20), unique=True, nullable=False)
    direccion = Column(String(200))
    activo = Column(Boolean, default=True) # Para eliminar (desactivar) clientes

    viajes = relationship("Viaje", back_populates="cliente")
    tarifas = relationship("Tarifa", back_populates="cliente")

class Transportista(Base):
    __tablename__ = "transportistas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    cuit = Column(String(20), unique=True, nullable=False)
    telefono = Column(String(50))
    activo = Column(Boolean, default=True)

    viajes = relationship("Viaje", back_populates="transportista")
    adelantos = relationship("Adelanto", back_populates="transportista")

class Tarifa(Base):
    """
    Gestiona lo que paga un cliente. 
    Permite cargar tarifas actuales y futuras según la fecha.
    """
    __tablename__ = "tarifas"
    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    origen = Column(String(100))
    destino = Column(String(100))
    # La tarifa es: Precio por Kilómetro por Tonelada
    precio_km_ton = Column(Numeric(10, 2), nullable=False)
    fecha_vigencia = Column(DateTime, default=datetime.utcnow) # Para futuras tarifas
    
    cliente = relationship("Cliente", back_populates="tarifas")

# --- NÚCLEO OPERATIVO: VIAJES Y ADELANTOS ---

class Viaje(Base):
    __tablename__ = "viajes"
    id = Column(Integer, primary_key=True, index=True)
    
    # Requerimiento: Carta de Porte (Identificador único de viaje)
    carta_de_porte = Column(String(50), unique=True, index=True, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    mercaderia = Column(String(100))
    kms = Column(Float, default=0.0)
    toneladas = Column(Float, default=0.0)
    
    # --- LÓGICA FINANCIERA (SNAPSHOTS) ---
    # Guardamos los valores calculados para auditoría
    importe_bruto = Column(Numeric(12, 2)) # kms * toneladas * tarifa
    
    comision_porcentaje = Column(Numeric(5, 2), default=8.00)
    comision_monto = Column(Numeric(12, 2)) # importe_bruto * 0.08
    
    valor_neto = Column(Numeric(12, 2)) # importe_bruto - comision_monto
    
    iva_porcentaje = Column(Numeric(5, 2), default=21.00)
    iva_monto = Column(Numeric(12, 2)) # valor_neto * 0.21
    
    varios = Column(Numeric(12, 2), default=0.00) # Imprevistos solicitados
    
    # Saldo Final se calcula como: (Valor Neto + IVA) - Adelantos - Varios
    # Este se calcula en tiempo real o se guarda al liquidar.
    
    comentarios = Column(Text)
    estado = Column(Enum(EstadoViaje), default=EstadoViaje.PENDIENTE)

    # Relaciones
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    transportista_id = Column(Integer, ForeignKey("transportistas.id"))
    
    cliente = relationship("Cliente", back_populates="viajes")
    transportista = relationship("Transportista", back_populates="viajes")
    adelantos = relationship("Adelanto", back_populates="viaje")

class Adelanto(Base):
    """
    Vales de Combustible o Efectivo.
    Se vinculan al transportista y opcionalmente a un viaje.
    """
    __tablename__ = "adelantos"
    id = Column(Integer, primary_key=True)
    tipo = Column(Enum(TipoAdelanto), nullable=False)
    monto = Column(Numeric(12, 2), nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    observaciones = Column(String(255))
    
    transportista_id = Column(Integer, ForeignKey("transportistas.id"))
    viaje_id = Column(Integer, ForeignKey("viajes.id"), nullable=True)

    transportista = relationship("Transportista", back_populates="adelantos")
    viaje = relationship("Viaje", back_populates="adelantos")

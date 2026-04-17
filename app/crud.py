from sqlalchemy.orm import Session
from . import models, schemas
from decimal import Decimal

def create_viaje(db: Session, viaje: schemas.ViajeCreate, cliente_id: int, transportista_id: int):
    # 1. Buscar tarifa vigente para el cliente y ruta
    tarifa_db = db.query(models.Tarifa).filter(
        models.Tarifa.cliente_id == cliente_id,
        models.Tarifa.origen == viaje.lugar_desde,
        models.Tarifa.destino == viaje.lugar_hasta
    ).first()
    
    precio = tarifa_db.precio_km_ton if tarifa_db else Decimal("0.00")

    db_viaje = models.Viaje(
        **viaje.model_dump(),
        cliente_id=cliente_id,
        transportista_id=transportista_id,
        tarifa_aplicada=precio
    )

    # 2. Cálculos GAVEM
    # Importe = Kms * Toneladas (kilos/1000) * Precio
    toneladas = Decimal(viaje.kilos) / Decimal("1000")
    db_viaje.importe = Decimal(viaje.kms) * toneladas * precio
    
    db_viaje.comision_8 = db_viaje.importe * Decimal("0.08")
    db_viaje.neto = db_viaje.importe - db_viaje.comision_8
    db_viaje.iva_21 = db_viaje.neto * Decimal("0.21")
    db_viaje.saldo = (db_viaje.importe + db_viaje.iva_21) - viaje.varios
    db_viaje.rentabilidad = db_viaje.comision_8

    db.add(db_viaje)
    db.commit()
    db.refresh(db_viaje)
    return db_viaje

# Otros métodos CRUD simplificados
def get_clientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    db_obj = models.Cliente(**cliente.model_dump())
    db.add(db_obj); db.commit(); db.refresh(db_obj)
    return db_obj

def create_transportista(db: Session, trans: schemas.TransportistaCreate):
    db_obj = models.Transportista(**trans.model_dump())
    db.add(db_obj); db.commit(); db.refresh(db_obj)
    return db_obj

def create_tarifa(db: Session, tarifa: schemas.TarifaCreate):
    db_obj = models.Tarifa(**tarifa.model_dump())
    db.add(db_obj); db.commit(); db.refresh(db_obj)
    return db_obj

def create_adelanto(db: Session, adelanto: schemas.AdelantoCreate):
    db_obj = models.Adelanto(**adelanto.model_dump())
    db.add(db_obj)
    if adelanto.viaje_id:
        v = db.query(models.Viaje).filter(models.Viaje.id == adelanto.viaje_id).first()
        if v:
            v.adelantos_consumidos += adelanto.monto_total
            v.saldo -= adelanto.monto_total
    db.commit(); db.refresh(db_obj)
    return db_obj
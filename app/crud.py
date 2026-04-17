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

def get_cliente_by_cuit(db: Session, cuit: str):
    return db.query(models.Cliente).filter(models.Cliente.cuit == cuit).first()

def get_transportistas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transportista).offset(skip).limit(limit).all()

def get_transportista_by_cuit(db: Session, cuitTrans: str):
    return db.query(models.Transportista).filter(models.Transportista.cuitTrans == cuitTrans).first()

def get_tarifas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tarifa).offset(skip).limit(limit).all()

def get_viajes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Viaje).offset(skip).limit(limit).all()

def get_adelantos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Adelanto).offset(skip).limit(limit).all()

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

# --- Métodos de Update ---

def update_cliente(db: Session, cliente_id: int, cliente_update: schemas.ClienteUpdate):
    db_obj = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not db_obj: return None
    update_data = cliente_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit(); db.refresh(db_obj)
    return db_obj

def update_transportista(db: Session, trans_id: int, trans_update: schemas.TransportistaUpdate):
    db_obj = db.query(models.Transportista).filter(models.Transportista.id == trans_id).first()
    if not db_obj: return None
    update_data = trans_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit(); db.refresh(db_obj)
    return db_obj

def update_tarifa(db: Session, tarifa_id: int, tarifa_update: schemas.TarifaUpdate):
    db_obj = db.query(models.Tarifa).filter(models.Tarifa.id == tarifa_id).first()
    if not db_obj: return None
    update_data = tarifa_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit(); db.refresh(db_obj)
    return db_obj

def update_adelanto(db: Session, adelanto_id: int, adelanto_update: schemas.AdelantoUpdate):
    db_obj = db.query(models.Adelanto).filter(models.Adelanto.id == adelanto_id).first()
    if not db_obj: return None
    
    # Manejo de impacto en Viaje si el monto o el viaje cambian
    # (Por simplicidad en este caso, actualizaremos los atributos directos. 
    # Logica compleja de recálculo re-asignando viajes se puede extender luego)
    update_data = adelanto_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit(); db.refresh(db_obj)
    return db_obj

def update_viaje(db: Session, viaje_id: int, viaje_update: schemas.ViajeUpdate):
    db_obj = db.query(models.Viaje).filter(models.Viaje.id == viaje_id).first()
    if not db_obj: return None

    # Actualizar los atributos provistos
    update_data = viaje_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    # Recalcular lógica financiera
    # 1. Buscar tarifa vigente
    tarifa_db = db.query(models.Tarifa).filter(
        models.Tarifa.cliente_id == db_obj.cliente_id,
        models.Tarifa.origen == db_obj.lugar_desde,
        models.Tarifa.destino == db_obj.lugar_hasta
    ).first()
    
    precio = tarifa_db.precio_km_ton if tarifa_db else db_obj.tarifa_aplicada

    db_obj.tarifa_aplicada = precio

    # 2. Recálculos
    toneladas = Decimal(db_obj.kilos) / Decimal("1000")
    db_obj.importe = Decimal(db_obj.kms) * toneladas * precio
    
    db_obj.comision_8 = db_obj.importe * Decimal("0.08")
    db_obj.neto = db_obj.importe - db_obj.comision_8
    db_obj.iva_21 = db_obj.neto * Decimal("0.21")
    
    varios = db_obj.varios or Decimal("0.00")
    adelantos = db_obj.adelantos_consumidos or Decimal("0.00")
    
    db_obj.saldo = (db_obj.importe + db_obj.iva_21) - varios - adelantos
    db_obj.rentabilidad = db_obj.comision_8

    db.commit(); db.refresh(db_obj)
    return db_obj
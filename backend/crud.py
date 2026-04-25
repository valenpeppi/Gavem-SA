from sqlalchemy.orm import Session
from . import models, schemas
from decimal import Decimal

def create_viaje(db: Session, viaje: schemas.ViajeCreate, cliente_id: int, transportista_id: int):
    # 1. Buscar tarifa vigente para el cliente
    tarifa_db = db.query(models.Tarifa).filter(
        models.Tarifa.cliente_id == cliente_id
    ).first()
    
    precio = viaje.tarifa_aplicada if viaje.tarifa_aplicada is not None else (tarifa_db.precio_km_ton if tarifa_db else Decimal("0.00"))

    viaje_data = viaje.model_dump()
    viaje_data['tarifa_aplicada'] = precio
    if hasattr(viaje_data.get('condicion'), 'name'):
        viaje_data['condicion'] = viaje_data['condicion'].name

    db_viaje = models.Viaje(
        **viaje_data,
        cliente_id=cliente_id,
        transportista_id=transportista_id
    )

    # 2. Cálculos GAVEM (si no vienen provistos desde el frontend)
    if db_viaje.importe is None:
        toneladas = Decimal(viaje.kilos) / Decimal("1000")
        db_viaje.importe = Decimal(viaje.kms) * toneladas * precio
    
    if db_viaje.comision_8 is None:
        db_viaje.comision_8 = db_viaje.importe * Decimal("0.08")
        
    if db_viaje.neto is None:
        db_viaje.neto = db_viaje.importe - db_viaje.comision_8
        
    if db_viaje.iva_21 is None:
        db_viaje.iva_21 = db_viaje.neto * Decimal("0.21")
        
    if db_viaje.saldo is None:
        varios = viaje.varios or Decimal("0.00")
        adelantos = viaje.adelantos_consumidos or Decimal("0.00")
        db_viaje.saldo = (db_viaje.importe + db_viaje.iva_21) - varios - adelantos
        
    if db_viaje.rentabilidad is None:
        db_viaje.rentabilidad = db_viaje.comision_8

    db.add(db_viaje)

    # Auto-calcular observaciones según estado
    _recalcular_observaciones(db_viaje)

    db.commit()
    db.refresh(db_viaje)
    return db_viaje


def _recalcular_observaciones(viaje: models.Viaje):
    """Determina el estado (observaciones) del viaje automáticamente.
    - Pagado: tiene orden_pago cargada
    - Liquidado: tiene nro_fc_transportista (Nro Factura Transporte)
    - Preliquidacion: fue marcado manualmente (no se sobreescribe)
    - Vacío: ningún estado
    Solo sobreescribe si el estado actual NO fue puesto manualmente como 'Preliquidacion'.
    """
    obs_actual = (viaje.observaciones or '').strip()
    # Si ya está marcado como Preliquidacion manualmente, no lo tocamos
    if obs_actual.lower() == 'preliquidacion':
        return
    if viaje.orden_pago and viaje.orden_pago.strip():
        viaje.observaciones = 'Pagado'
    elif viaje.nro_fc_transportista and viaje.nro_fc_transportista.strip():
        viaje.observaciones = 'Liquidado'
    else:
        # Solo limpiar si era un estado automático previo
        if obs_actual.lower() in ('pagado', 'liquidado', ''):
            viaje.observaciones = None

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
    # Solo actualiza el viaje si se asignó uno
    if adelanto.viaje_id:
        v = db.query(models.Viaje).filter(models.Viaje.id == adelanto.viaje_id).first()
        if v:
            v.adelantos_consumidos = (v.adelantos_consumidos or 0) + adelanto.monto_total
            varios = v.varios or 0
            v.saldo = (v.importe + v.iva_21) - varios - v.adelantos_consumidos
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
    if hasattr(update_data.get('condicion'), 'name'):
        update_data['condicion'] = update_data['condicion'].name

    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    # Recalcular lógica financiera
    # 1. Buscar tarifa vigente
    tarifa_db = db.query(models.Tarifa).filter(
        models.Tarifa.cliente_id == db_obj.cliente_id
    ).first()
    
    precio = tarifa_db.precio_km_ton if tarifa_db else db_obj.tarifa_aplicada

    db_obj.tarifa_aplicada = precio

    # 2. Recálculos (solo si no se proveyeron explícitamente en el update)
    if 'importe' not in update_data:
        toneladas = Decimal(db_obj.kilos) / Decimal("1000")
        db_obj.importe = Decimal(db_obj.kms) * toneladas * precio
    
    if 'comision_8' not in update_data:
        db_obj.comision_8 = db_obj.importe * Decimal("0.08")
        
    if 'neto' not in update_data:
        db_obj.neto = db_obj.importe - db_obj.comision_8
        
    if 'iva_21' not in update_data:
        db_obj.iva_21 = db_obj.neto * Decimal("0.21")
    
    varios = db_obj.varios or Decimal("0.00")
    adelantos = db_obj.adelantos_consumidos or Decimal("0.00")
    
    if 'saldo' not in update_data:
        db_obj.saldo = (db_obj.importe + db_obj.iva_21) - varios - adelantos
        
    if 'rentabilidad' not in update_data:
        db_obj.rentabilidad = db_obj.comision_8

    # Auto-calcular observaciones según estado
    _recalcular_observaciones(db_obj)

    db.commit(); db.refresh(db_obj)
    return db_obj
from fastapi import HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal
from .. import models, schemas
from .historial import registrar_cambio


def cargar_viaje(db: Session, viaje: schemas.ViajeCreate, cliente_id: int, transportista_id: int):
    tarifa_db = db.query(models.Tarifa).filter(models.Tarifa.cliente_id == cliente_id).first()
    precio = (
        viaje.tarifa_aplicada
        if viaje.tarifa_aplicada is not None
        else (tarifa_db.precio_km_ton if tarifa_db else Decimal("0.00"))
    )

    viaje_data = viaje.model_dump(exclude={'tarifa_aplicada'})

    # PostgreSQL almacena el NOMBRE del enum (UNO/DOS), no el valor ('1'/'2')
    condicion_raw = viaje_data.get('condicion')
    if condicion_raw is not None:
        if hasattr(condicion_raw, 'name'):
            # Es un objeto enum de Python → usar su nombre
            viaje_data['condicion'] = condicion_raw.name
        elif str(condicion_raw) == '1':
            viaje_data['condicion'] = 'UNO'
        elif str(condicion_raw) == '2':
            viaje_data['condicion'] = 'DOS'
        # Si ya viene como 'UNO'/'DOS', se deja igual

    db_viaje = models.Viaje(
        **viaje_data,
        cliente_id=cliente_id,
        transportista_id=transportista_id,
        tarifa_aplicada=precio,
    )

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
    db.commit()
    db.refresh(db_viaje)
    
    # Registrar historial
    registrar_cambio(db, entidad="Viaje", entidad_id=db_viaje.id, accion="CREACION", detalles_dict={"ordenante": db_viaje.ordenante})
    db.commit()
    
    return db_viaje


def leer_viajes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Viaje).order_by(models.Viaje.id.desc()).offset(skip).limit(limit).all()


def actualizar_viaje(db: Session, viaje_id: int, viaje_update: schemas.ViajeUpdate):
    db_obj = db.query(models.Viaje).filter(models.Viaje.id == viaje_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")

    update_data = viaje_update.model_dump(exclude_unset=True)

    # Corregir condicion si viene como enum o como '1'/'2'
    if 'condicion' in update_data:
        c = update_data['condicion']
        if hasattr(c, 'name'):
            update_data['condicion'] = c.name
        elif str(c) == '1':
            update_data['condicion'] = 'UNO'
        elif str(c) == '2':
            update_data['condicion'] = 'DOS'

    cambios = {}
    for key, value in update_data.items():
        old_val = getattr(db_obj, key, None)
        if old_val != value:
            cambios[key] = {"old": old_val, "new": value}
        setattr(db_obj, key, value)

    tarifa_db = db.query(models.Tarifa).filter(models.Tarifa.cliente_id == db_obj.cliente_id).first()
    precio = tarifa_db.precio_km_ton if tarifa_db else db_obj.tarifa_aplicada
    
    if db_obj.tarifa_aplicada != precio:
        cambios['tarifa_aplicada'] = {"old": db_obj.tarifa_aplicada, "new": precio}
    db_obj.tarifa_aplicada = precio

    if "importe" not in update_data:
        toneladas = Decimal(db_obj.kilos) / Decimal("1000")
        nuevo_importe = Decimal(db_obj.kms) * toneladas * precio
        if db_obj.importe != nuevo_importe:
            db_obj.importe = nuevo_importe

    if "comision_8" not in update_data:
        db_obj.comision_8 = db_obj.importe * Decimal("0.08")

    if "neto" not in update_data:
        db_obj.neto = db_obj.importe - db_obj.comision_8

    if "iva_21" not in update_data:
        db_obj.iva_21 = db_obj.neto * Decimal("0.21")

    varios = db_obj.varios or Decimal("0.00")
    adelantos = db_obj.adelantos_consumidos or Decimal("0.00")

    if "saldo" not in update_data:
        db_obj.saldo = (db_obj.importe + db_obj.iva_21) - varios - adelantos

    if "rentabilidad" not in update_data:
        db_obj.rentabilidad = db_obj.comision_8

    if cambios:
        registrar_cambio(db, entidad="Viaje", entidad_id=db_obj.id, accion="MODIFICACION", detalles_dict=cambios)

    db.commit()
    db.refresh(db_obj)
    return db_obj

def borrar_viaje(db: Session, viaje_id: int):
    db_obj = db.query(models.Viaje).filter(models.Viaje.id == viaje_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")
    
    # Delete associated adelantos
    db.query(models.Adelanto).filter(models.Adelanto.viaje_id == viaje_id).delete()
    
    registrar_cambio(db, entidad="Viaje", entidad_id=viaje_id, accion="ELIMINACION", detalles_dict={"ordenante": db_obj.ordenante})
    
    db.delete(db_obj)
    db.commit()
    return {"message": "Viaje eliminado exitosamente"}

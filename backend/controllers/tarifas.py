from fastapi import HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas


def _check_overlap(db: Session, cliente_id: int, fecha_desde, fecha_hasta, exclude_id: int = None):
    """Verifica si ya existe una tarifa que se superponga con el rango de fechas dado."""
    query = db.query(models.Tarifa).filter(
        models.Tarifa.cliente_id == cliente_id,
        models.Tarifa.fecha_desde <= fecha_hasta,
        models.Tarifa.fecha_hasta >= fecha_desde,
    )
    if exclude_id is not None:
        query = query.filter(models.Tarifa.id != exclude_id)
    existing = query.first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Ya existe una tarifa para este cliente que se superpone con las fechas indicadas "
                f"(vigente del {existing.fecha_desde.strftime('%d/%m/%Y')} al {existing.fecha_hasta.strftime('%d/%m/%Y')}). "
                f"Un cliente no puede tener dos tarifas activas el mismo día."
            )
        )


def crear_tarifa(db: Session, tarifa: schemas.TarifaCreate):
    _check_overlap(db, tarifa.cliente_id, tarifa.fecha_desde, tarifa.fecha_hasta)
    db_obj = models.Tarifa(**tarifa.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def leer_tarifas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tarifa).offset(skip).limit(limit).all()


def actualizar_tarifa(db: Session, tarifa_id: int, tarifa_update: schemas.TarifaUpdate):
    db_obj = db.query(models.Tarifa).filter(models.Tarifa.id == tarifa_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Tarifa no encontrada")
    
    update_data = tarifa_update.model_dump(exclude_unset=True)
    
    # Determine the effective dates after the update (for overlap check)
    nueva_fecha_desde = update_data.get('fecha_desde', db_obj.fecha_desde)
    nueva_fecha_hasta = update_data.get('fecha_hasta', db_obj.fecha_hasta)
    nueva_cliente_id = update_data.get('cliente_id', db_obj.cliente_id)
    _check_overlap(db, nueva_cliente_id, nueva_fecha_desde, nueva_fecha_hasta, exclude_id=tarifa_id)
    
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

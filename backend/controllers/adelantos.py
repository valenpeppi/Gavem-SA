from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas


def cargar_adelanto(db: Session, adelanto: schemas.AdelantoCreate):
    adelanto_data = adelanto.model_dump()
    if hasattr(adelanto_data.get('tipo'), 'name'):
        adelanto_data['tipo'] = adelanto_data['tipo'].name
    
    # Generate unique code
    max_id = db.query(func.max(models.Adelanto.id)).scalar() or 0
    adelanto_data['nro_vale'] = f"ADV-{max_id + 1:04d}"

    db_obj = models.Adelanto(**adelanto_data)
    db.add(db_obj)
    if adelanto.viaje_id:
        viaje = db.query(models.Viaje).filter(models.Viaje.id == adelanto.viaje_id).first()
        if viaje:
            viaje.adelantos_consumidos += adelanto.monto_total
            viaje.saldo -= adelanto.monto_total
    db.commit()
    db.refresh(db_obj)
    return db_obj


def leer_adelantos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Adelanto).offset(skip).limit(limit).all()


def actualizar_adelanto(db: Session, adelanto_id: int, adelanto_update: schemas.AdelantoUpdate):
    db_obj = db.query(models.Adelanto).filter(models.Adelanto.id == adelanto_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Adelanto no encontrado")

    update_data = adelanto_update.model_dump(exclude_unset=True)
    if hasattr(update_data.get('tipo'), 'name'):
        update_data['tipo'] = update_data['tipo'].name

    # Si se esta asignando un viaje nuevo a un adelanto que no tenia viaje
    nuevo_viaje_id = update_data.get('viaje_id')
    if nuevo_viaje_id and db_obj.viaje_id is None:
        viaje = db.query(models.Viaje).filter(models.Viaje.id == nuevo_viaje_id).first()
        if not viaje:
            raise HTTPException(status_code=404, detail="Viaje no encontrado")
        # Descontar el adelanto del saldo del viaje
        viaje.adelantos_consumidos = (viaje.adelantos_consumidos or 0) + db_obj.monto_total
        varios = viaje.varios or 0
        viaje.saldo = (viaje.importe + viaje.iva_21) - varios - viaje.adelantos_consumidos

    for key, value in update_data.items():
        setattr(db_obj, key, value)

    db.commit()
    db.refresh(db_obj)
    return db_obj

from fastapi import HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas


def cargar_adelanto(db: Session, adelanto: schemas.AdelantoCreate):
    db_obj = models.Adelanto(**adelanto.model_dump())
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
    for key, value in adelanto_update.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

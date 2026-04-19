from fastapi import HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas


def crear_tarifa(db: Session, tarifa: schemas.TarifaCreate):
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
    for key, value in tarifa_update.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

from fastapi import HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas


def crear_transportista(db: Session, trans: schemas.TransportistaCreate):
    if db.query(models.Transportista).filter(models.Transportista.cuitTrans == trans.cuitTrans).first():
        raise HTTPException(status_code=400, detail="El CUIT del transportista ya está registrado")
    db_obj = models.Transportista(**trans.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def leer_transportistas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transportista).offset(skip).limit(limit).all()


def actualizar_transportista(db: Session, trans_id: int, trans_update: schemas.TransportistaUpdate):
    db_obj = db.query(models.Transportista).filter(models.Transportista.id == trans_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Transportista no encontrado")
    for key, value in trans_update.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def eliminar_transportista(db: Session, trans_id: int):
    db_obj = db.query(models.Transportista).filter(models.Transportista.id == trans_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Transportista no encontrado")
    db.delete(db_obj)
    db.commit()

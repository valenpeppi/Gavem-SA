from fastapi import HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas


def crear_cliente(db: Session, cliente: schemas.ClienteCreate):
    if db.query(models.Cliente).filter(models.Cliente.cuit == cliente.cuit).first():
        raise HTTPException(status_code=400, detail="El CUIT ya está registrado")
    db_obj = models.Cliente(**cliente.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def leer_clientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cliente).offset(skip).limit(limit).all()


def actualizar_cliente(db: Session, cliente_id: int, cliente_update: schemas.ClienteUpdate):
    db_obj = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for key, value in cliente_update.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def eliminar_cliente(db: Session, cliente_id: int):
    db_obj = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(db_obj)
    db.commit()

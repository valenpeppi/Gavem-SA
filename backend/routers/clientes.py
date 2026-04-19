from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, database
from ..controllers import clientes as controller

router = APIRouter(prefix="/clientes", tags=["Maestros"])


@router.post("/", response_model=schemas.Cliente)
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(database.get_db)):
    return controller.crear_cliente(db, cliente)


@router.get("/", response_model=list[schemas.Cliente])
def leer_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return controller.leer_clientes(db, skip, limit)


@router.put("/{cliente_id}", response_model=schemas.Cliente)
def actualizar_cliente(cliente_id: int, cliente_update: schemas.ClienteUpdate, db: Session = Depends(database.get_db)):
    return controller.actualizar_cliente(db, cliente_id, cliente_update)


@router.delete("/{cliente_id}", status_code=204)
def eliminar_cliente(cliente_id: int, db: Session = Depends(database.get_db)):
    controller.eliminar_cliente(db, cliente_id)

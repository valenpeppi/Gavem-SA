from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database
from ..controllers import adelantos as controller

router = APIRouter(prefix="/adelantos", tags=["Operaciones"])


@router.post("/", response_model=schemas.Adelanto)
def cargar_adelanto(adelanto: schemas.AdelantoCreate, db: Session = Depends(database.get_db)):
    return controller.cargar_adelanto(db, adelanto)


@router.get("/", response_model=list[schemas.Adelanto])
def leer_adelantos(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return controller.leer_adelantos(db, skip, limit)


@router.put("/{adelanto_id}", response_model=schemas.Adelanto)
def actualizar_adelanto(adelanto_id: int, adelanto_update: schemas.AdelantoUpdate, db: Session = Depends(database.get_db)):
    return controller.actualizar_adelanto(db, adelanto_id, adelanto_update)

@router.delete("/{adelanto_id}")
def borrar_adelanto(adelanto_id: int, db: Session = Depends(database.get_db)):
    return controller.borrar_adelanto(db, adelanto_id)

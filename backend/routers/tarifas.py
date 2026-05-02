from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database, models, auth
from ..controllers import tarifas as controller

router = APIRouter(prefix="/tarifas", tags=["Maestros"])


@router.post("/", response_model=schemas.Tarifa)
def crear_tarifa(
    tarifa: schemas.TarifaCreate,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    return controller.crear_tarifa(db, tarifa)


@router.get("/", response_model=list[schemas.Tarifa])
def leer_tarifas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    return controller.leer_tarifas(db, skip, limit)


@router.put("/{tarifa_id}", response_model=schemas.Tarifa)
def actualizar_tarifa(
    tarifa_id: int,
    tarifa_update: schemas.TarifaUpdate,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    return controller.actualizar_tarifa(db, tarifa_id, tarifa_update)

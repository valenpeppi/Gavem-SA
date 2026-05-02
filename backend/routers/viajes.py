from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database, models, auth
from ..controllers import viajes as controller

router = APIRouter(prefix="/viajes", tags=["Operaciones"])


@router.post("/", response_model=schemas.Viaje)
def cargar_viaje(
    viaje: schemas.ViajeCreate,
    cli_id: int,
    trans_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.Usuario = Depends(auth.get_current_user),
):
    return controller.cargar_viaje(db, viaje, cli_id, trans_id, current_user)


@router.get("/", response_model=list[schemas.Viaje])
def leer_viajes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    return controller.leer_viajes(db, skip, limit)


@router.put("/{viaje_id}", response_model=schemas.Viaje)
def actualizar_viaje(
    viaje_id: int,
    viaje_update: schemas.ViajeUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.Usuario = Depends(auth.get_current_user),
):
    return controller.actualizar_viaje(db, viaje_id, viaje_update, current_user)


@router.delete("/{viaje_id}")
def borrar_viaje(
    viaje_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.Usuario = Depends(auth.get_current_user),
):
    return controller.borrar_viaje(db, viaje_id, current_user)

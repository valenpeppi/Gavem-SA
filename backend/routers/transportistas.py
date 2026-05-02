from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, database, models, auth
from ..controllers import transportistas as controller

router = APIRouter(prefix="/transportistas", tags=["Maestros"])


@router.post("/", response_model=schemas.Transportista)
def crear_transportista(
    trans: schemas.TransportistaCreate,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    return controller.crear_transportista(db, trans)


@router.get("/", response_model=list[schemas.Transportista])
def leer_transportistas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    return controller.leer_transportistas(db, skip, limit)


@router.put("/{trans_id}", response_model=schemas.Transportista)
def actualizar_transportista(
    trans_id: int,
    trans_update: schemas.TransportistaUpdate,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    return controller.actualizar_transportista(db, trans_id, trans_update)


@router.delete("/{trans_id}", status_code=204)
def eliminar_transportista(
    trans_id: int,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.get_current_user),
):
    controller.eliminar_transportista(db, trans_id)

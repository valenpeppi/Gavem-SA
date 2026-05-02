from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import cast

from .. import auth, database, models, schemas
from ..controllers import usuarios as controller

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/", response_model=list[schemas.Usuario])
def listar_usuarios(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.require_superadmin),
):
    return controller.listar_usuarios(db, skip, limit)


@router.post("/", response_model=schemas.Usuario)
def crear_usuario(
    payload: schemas.UsuarioCreate,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.require_superadmin),
):
    return controller.crear_usuario(db, payload)


@router.put("/me", response_model=schemas.Usuario)
def update_my_profile(
    payload: schemas.ProfileUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.Usuario = Depends(auth.get_current_user),
):
    return controller.update_my_profile(db, cast(int, current_user.id), payload)


@router.put("/me/password")
def change_my_password(
    payload: schemas.PasswordChange,
    db: Session = Depends(database.get_db),
    current_user: models.Usuario = Depends(auth.get_current_user),
):
    return controller.change_my_password(db, cast(int, current_user.id), payload)


@router.put("/{usuario_id}", response_model=schemas.Usuario)
def actualizar_usuario(
    usuario_id: int,
    payload: schemas.UsuarioUpdate,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.require_superadmin),
):
    return controller.actualizar_usuario(db, usuario_id, payload)


@router.put("/{usuario_id}/desactivar", response_model=schemas.Usuario)
def desactivar_usuario(
    usuario_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.Usuario = Depends(auth.require_superadmin),
):
    return controller.desactivar_usuario(db, usuario_id, cast(int, current_user.id))


@router.put("/{usuario_id}/reactivar", response_model=schemas.Usuario)
def reactivar_usuario(
    usuario_id: int,
    db: Session = Depends(database.get_db),
    _: models.Usuario = Depends(auth.require_superadmin),
):
    return controller.reactivar_usuario(db, usuario_id)

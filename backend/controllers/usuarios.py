from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import Any, cast

from .. import auth, models, schemas


def listar_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Usuario).order_by(models.Usuario.id.asc()).offset(skip).limit(limit).all()


def crear_usuario(db: Session, payload: schemas.UsuarioCreate):
    existente = db.query(models.Usuario).filter(models.Usuario.username == payload.username).first()
    if existente:
        raise HTTPException(status_code=400, detail="El username ya existe")

    usuario = models.Usuario(
        username=payload.username.strip(),
        password_hash=auth.hash_password(payload.password),
        nombre=payload.nombre.strip(),
        apellido=payload.apellido.strip(),
        telefono=(payload.telefono or "").strip(),
        rol=payload.rol.value,
        activo=True,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def actualizar_usuario(db: Session, usuario_id: int, payload: schemas.UsuarioUpdate):
    usuario = cast(Any, db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first())
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    data = payload.model_dump(exclude_unset=True)

    if "rol" in data and data["rol"] is not None:
        usuario.rol = data["rol"].value
    if "nombre" in data and data["nombre"] is not None:
        usuario.nombre = str(data["nombre"]).strip()
    if "apellido" in data and data["apellido"] is not None:
        usuario.apellido = str(data["apellido"]).strip()
    if "telefono" in data:
        usuario.telefono = str(data["telefono"] or "").strip()
    if "password" in data and data["password"]:
        usuario.password_hash = auth.hash_password(str(data["password"]))

    db.commit()
    db.refresh(usuario)
    return usuario


def desactivar_usuario(db: Session, usuario_id: int, current_user_id: int):
    usuario = cast(Any, db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first())
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if int(usuario.id) == int(current_user_id):
        raise HTTPException(status_code=400, detail="No podés desactivarte a vos mismo")

    usuario.activo = False
    db.query(models.SessionToken).filter(models.SessionToken.usuario_id == usuario.id).update({"activo": False})
    db.commit()
    db.refresh(usuario)
    return usuario


def reactivar_usuario(db: Session, usuario_id: int):
    usuario = cast(Any, db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first())
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.activo = True
    db.commit()
    db.refresh(usuario)
    return usuario


def update_my_profile(db: Session, current_user_id: int, payload: schemas.ProfileUpdate):
    usuario = cast(Any, db.query(models.Usuario).filter(models.Usuario.id == current_user_id).first())
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    data = payload.model_dump(exclude_unset=True)

    if "nombre" in data and data["nombre"] is not None:
        usuario.nombre = str(data["nombre"]).strip()
    if "apellido" in data and data["apellido"] is not None:
        usuario.apellido = str(data["apellido"]).strip()
    if "telefono" in data:
        usuario.telefono = str(data["telefono"] or "").strip()

    db.commit()
    db.refresh(usuario)
    return usuario


def change_my_password(db: Session, current_user_id: int, payload: schemas.PasswordChange):
    usuario = cast(Any, db.query(models.Usuario).filter(models.Usuario.id == current_user_id).first())
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # validate current password
    if not auth.verify_password(payload.current_password, usuario.password_hash):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")

    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="La nueva contraseña y la confirmación no coinciden")

    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="La nueva contraseña debe tener al menos 6 caracteres")

    # Update password
    usuario.password_hash = auth.hash_password(payload.new_password)
    db.flush()  # Flush to write to DB without committing
    
    # Invalidate all sessions
    db.query(models.SessionToken).filter(models.SessionToken.usuario_id == usuario.id).update({"activo": False})
    db.flush()  # Flush session changes
    
    # Commit everything at once
    db.commit()
    db.refresh(usuario)
    
    return usuario

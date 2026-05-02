from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import auth, database, models, schemas

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.username == payload.username).first()
    if not usuario or not auth.verify_password(payload.password, usuario.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    if not usuario.activo:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuario inactivo")

    token = auth.create_session_token(db, usuario)
    return schemas.LoginResponse(access_token=token, user=usuario)


@router.get("/me", response_model=schemas.Usuario)
def me(current_user: models.Usuario = Depends(auth.get_current_user)):
    return current_user


@router.post("/logout")
def logout(
    current_user: models.Usuario = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    db.query(models.SessionToken).filter(models.SessionToken.usuario_id == current_user.id).update({"activo": False})
    db.commit()
    return {"message": "Sesión cerrada"}

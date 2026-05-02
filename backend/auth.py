import base64
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import text
from sqlalchemy.orm import Session

from . import database, models

TOKEN_HOURS = 12
security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt_b64, digest_b64 = password_hash.split("$", 1)
        salt = base64.b64decode(salt_b64.encode())
        expected = base64.b64decode(digest_b64.encode())
        current = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
        return hmac.compare_digest(current, expected)
    except Exception:
        return False


def create_session_token(db: Session, usuario: models.Usuario) -> str:
    token = secrets.token_urlsafe(48)
    db_token = models.SessionToken(
        token=token,
        usuario_id=usuario.id,
        expiracion=datetime.utcnow() + timedelta(hours=TOKEN_HOURS),
        activo=True,
    )
    db.add(db_token)
    db.commit()
    return token


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(database.get_db),
) -> models.Usuario:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No autenticado")

    token = credentials.credentials
    now = datetime.utcnow()

    db_token = (
        db.query(models.SessionToken)
        .filter(models.SessionToken.token == token)
        .filter(models.SessionToken.activo == True)
        .filter(models.SessionToken.expiracion > now)
        .first()
    )

    if not db_token or not db_token.usuario or not db_token.usuario.activo:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesión inválida o expirada")

    return db_token.usuario


def require_superadmin(current_user: models.Usuario = Depends(get_current_user)) -> models.Usuario:
    rol_actual = str(current_user.rol).lower()
    if rol_actual not in {models.RolUsuario.SUPERADMINISTRADOR.value, models.RolUsuario.SUPERADMINISTRADOR.name.lower()}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo superadministrador")
    return current_user


def ensure_default_superadmin(db: Session) -> None:
    required_columns = {
        "id",
        "username",
        "hashed_password",
        "nombre",
        "apellido",
        "telefono",
        "rol",
        "activo",
        "creado_en",
        "actualizado_en",
    }

    try:
        rows = db.execute(
            text(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'usuarios'
                """
            )
        ).fetchall()
        current_columns = {row[0] for row in rows}
        if not required_columns.issubset(current_columns):
            print("WARN: La tabla usuarios no está migrada. Ejecutá: python migrate_db.py")
            return
    except Exception:
        print("WARN: No se pudo validar esquema de usuarios. Ejecutá: python migrate_db.py")
        return

    existe = db.query(models.Usuario.id).first() is not None
    if existe:
        return

    admin = models.Usuario(
        username="admin",
        password_hash=hash_password("admin123"),
        nombre="Super",
        apellido="Administrador",
        telefono="",
        rol=models.RolUsuario.SUPERADMINISTRADOR.value,
        activo=True,
    )
    db.add(admin)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"WARN: No se pudo crear superadmin por incompatibilidad de esquema: {e}")
        print("WARN: Ejecutá: python migrate_db.py")

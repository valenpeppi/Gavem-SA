import json
import enum
from decimal import Decimal
from datetime import datetime, date
from sqlalchemy.orm import Session
from .. import models

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, enum.Enum):
            return obj.name
        return super().default(obj)

def registrar_cambio(
    db: Session,
    entidad: str,
    entidad_id: int,
    accion: str,
    detalles_dict: dict = None,
    usuario: str = "Usuario del Sistema",
    empleado_id: int = None,
    empleado_nombre: str = None,
    empleado_apellido: str = None,
    empleado_telefono: str = None,
):
    detalles_str = None
    if detalles_dict:
        detalles_str = json.dumps(detalles_dict, cls=CustomJSONEncoder)
    
    historial = models.HistorialCambio(
        entidad=entidad,
        entidad_id=entidad_id,
        accion=accion,
        detalles=detalles_str,
        usuario=usuario,
        empleado_id=empleado_id,
        empleado_nombre=empleado_nombre,
        empleado_apellido=empleado_apellido,
        empleado_telefono=empleado_telefono,
    )
    db.add(historial)
    # No we don't commit here, we assume the caller commits

def leer_historial(db: Session, entidad: str = None, entidad_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(models.HistorialCambio)
    if entidad:
        query = query.filter(models.HistorialCambio.entidad == entidad)
    if entidad_id is not None:
        query = query.filter(models.HistorialCambio.entidad_id == entidad_id)
    return query.order_by(models.HistorialCambio.fecha.desc()).offset(skip).limit(limit).all()

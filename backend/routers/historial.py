from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, database
from ..controllers import historial as controller

router = APIRouter(prefix="/historial", tags=["Auditoria"])

@router.get("/", response_model=List[schemas.HistorialCambio])
def leer_historial(
    entidad: Optional[str] = None, 
    entidad_id: Optional[int] = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db)
):
    return controller.leer_historial(db, entidad, entidad_id, skip, limit)

import sys
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.schemas import ViajeCreate, TipoCondicion
from backend.controllers.viajes import cargar_viaje
from datetime import datetime

db = SessionLocal()
try:
    data = {
        "ordenante": "999",
        "fecha": datetime.now(),
        "propio_tercero": "Tercero",
        "chofer": "Test Chofer",
        "carta_porte": "123",
        "mercaderia": "Soja",
        "dominio_camion": "ABC1234",
        "lugar_desde": "A",
        "lugar_hasta": "B",
        "kms": 100,
        "kilos": 30000,
        "condicion": TipoCondicion.UNO,
        "cliente_id": 1,
        "transportista_id": 1
    }
    viaje = ViajeCreate(**data)
    result = cargar_viaje(db, viaje, 1, 1)
    print("Success:", result.id)
except Exception as e:
    import traceback
    with open('error.log', 'w') as f:
        traceback.print_exc(file=f)
finally:
    db.close()

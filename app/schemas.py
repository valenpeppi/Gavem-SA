from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
import enum

class TipoCondicion(str, enum.Enum):
    UNO = "1"
    DOS = "2"

class TipoAdelanto(str, enum.Enum):
    VALE_COMBUSTIBLE = "Vale Combustible"
    VALE_EFECTIVO = "Vale Efectivo"

class TarifaBase(BaseModel):
    origen: str
    destino: str
    precio_km_ton: Decimal
    fecha_desde: datetime
    fecha_hasta: datetime

class TarifaCreate(TarifaBase):
    cliente_id: int

class Tarifa(TarifaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ClienteCreate(BaseModel):
    nombre: str
    cuit: str

class Cliente(ClienteCreate):
    id: int
    activo: bool
    model_config = ConfigDict(from_attributes=True)

class TransportistaCreate(BaseModel):
    codTrans: int
    nomTrans: str
    cuitTrans: str
    telTrans: Optional[str] = None
    calleTrans: Optional[str] = None
    nroCalleTrans: Optional[str] = None
    cp: Optional[str] = None
    localidad: Optional[str] = None
    provincia: Optional[str] = None

class Transportista(TransportistaCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ViajeCreate(BaseModel):
    ordenante: str
    propio_tercero: Optional[str] = "Tercero"
    chofer: str
    carta_porte: str
    mercaderia: str
    lugar_desde: str
    lugar_hasta: str
    prov_origen: Optional[str] = None
    prov_destino: Optional[str] = None
    kms: float
    kilos: float
    cubicaje: Optional[float] = 0.0
    condicion: TipoCondicion
    varios: Optional[Decimal] = Decimal("0.00")
    comentario: Optional[str] = None
    observaciones: Optional[str] = None

class Viaje(ViajeCreate):
    id: int
    tarifa_aplicada: Decimal
    importe: Decimal
    comision_8: Decimal
    neto: Decimal
    iva_21: Decimal
    adelantos_consumidos: Decimal
    saldo: Decimal
    cliente_id: int
    transportista_id: int
    model_config = ConfigDict(from_attributes=True)

class AdelantoCreate(BaseModel):
    nro_vale: str
    tipo: TipoAdelanto
    monto_total: Decimal
    transportista_id: int
    viaje_id: Optional[int] = None

class Adelanto(AdelantoCreate):
    id: int
    fecha_emision: datetime
    model_config = ConfigDict(from_attributes=True)
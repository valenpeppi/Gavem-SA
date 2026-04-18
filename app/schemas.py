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
    precio_km_ton: Decimal
    fecha_desde: datetime
    fecha_hasta: datetime

class TarifaCreate(TarifaBase):
    cliente_id: int

class Tarifa(TarifaBase):
    id: int
    cliente_id: int
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
    fecha: datetime
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
    tarifa_aplicada: Optional[Decimal] = None
    importe: Optional[Decimal] = None
    comision_8: Optional[Decimal] = None
    neto: Optional[Decimal] = None
    iva_21: Optional[Decimal] = None
    adelantos_consumidos: Optional[Decimal] = Decimal("0.00")
    saldo: Optional[Decimal] = None
    rentabilidad: Optional[Decimal] = None
    orden_pago: Optional[str] = None
    factura_gavem: Optional[str] = None
    imp_fact_gavem: Optional[Decimal] = None
    nro_fc_transportista: Optional[str] = None
    imp_fact_transportista: Optional[Decimal] = None

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

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    cuit: Optional[str] = None
    activo: Optional[bool] = None

class TransportistaUpdate(BaseModel):
    codTrans: Optional[int] = None
    nomTrans: Optional[str] = None
    cuitTrans: Optional[str] = None
    telTrans: Optional[str] = None
    calleTrans: Optional[str] = None
    nroCalleTrans: Optional[str] = None
    cp: Optional[str] = None
    localidad: Optional[str] = None
    provincia: Optional[str] = None
    activo: Optional[bool] = None

class TarifaUpdate(BaseModel):
    precio_km_ton: Optional[Decimal] = None
    fecha_desde: Optional[datetime] = None
    fecha_hasta: Optional[datetime] = None
    cliente_id: Optional[int] = None

class ViajeUpdate(BaseModel):
    ordenante: Optional[str] = None
    propio_tercero: Optional[str] = None
    chofer: Optional[str] = None
    carta_porte: Optional[str] = None
    mercaderia: Optional[str] = None
    lugar_desde: Optional[str] = None
    lugar_hasta: Optional[str] = None
    prov_origen: Optional[str] = None
    prov_destino: Optional[str] = None
    kms: Optional[float] = None
    kilos: Optional[float] = None
    cubicaje: Optional[float] = None
    condicion: Optional[TipoCondicion] = None
    varios: Optional[Decimal] = None
    comentario: Optional[str] = None
    observaciones: Optional[str] = None
    tarifa_aplicada: Optional[Decimal] = None
    importe: Optional[Decimal] = None
    comision_8: Optional[Decimal] = None
    neto: Optional[Decimal] = None
    iva_21: Optional[Decimal] = None
    adelantos_consumidos: Optional[Decimal] = None
    saldo: Optional[Decimal] = None
    rentabilidad: Optional[Decimal] = None
    orden_pago: Optional[str] = None
    factura_gavem: Optional[str] = None
    imp_fact_gavem: Optional[Decimal] = None
    nro_fc_transportista: Optional[str] = None
    imp_fact_transportista: Optional[Decimal] = None
    cliente_id: Optional[int] = None
    transportista_id: Optional[int] = None

class AdelantoUpdate(BaseModel):
    nro_vale: Optional[str] = None
    tipo: Optional[TipoAdelanto] = None
    monto_total: Optional[Decimal] = None
    transportista_id: Optional[int] = None
    viaje_id: Optional[int] = None
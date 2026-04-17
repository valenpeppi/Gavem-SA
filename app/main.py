from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SISTEMA GAVEM SA")

@app.post("/clientes/", response_model=schemas.Cliente, tags=["Maestros"])
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(database.get_db)):
    return crud.create_cliente(db, cliente)

@app.get("/clientes/", response_model=list[schemas.Cliente], tags=["Maestros"])
def leer_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_clientes(db, skip=skip, limit=limit)

@app.post("/transportistas/", response_model=schemas.Transportista, tags=["Maestros"])
def crear_transportista(trans: schemas.TransportistaCreate, db: Session = Depends(database.get_db)):
    return crud.create_transportista(db, trans)

@app.post("/tarifas/", response_model=schemas.Tarifa, tags=["Maestros"])
def crear_tarifa(tarifa: schemas.TarifaCreate, db: Session = Depends(database.get_db)):
    return crud.create_tarifa(db, tarifa)

@app.post("/viajes/", response_model=schemas.Viaje, tags=["Operaciones"])
def cargar_viaje(viaje: schemas.ViajeCreate, cli_id: int, trans_id: int, db: Session = Depends(database.get_db)):
    return crud.create_viaje(db, viaje, cli_id, trans_id)

@app.post("/adelantos/", response_model=schemas.Adelanto, tags=["Operaciones"])
def cargar_adelanto(adelanto: schemas.AdelantoCreate, db: Session = Depends(database.get_db)):
    return crud.create_adelanto(db, adelanto)
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SISTEMA GAVEM SA")

@app.post("/clientes/", response_model=schemas.Cliente, tags=["Maestros"])
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(database.get_db)):
    db_cliente = crud.get_cliente_by_cuit(db, cuit=cliente.cuit)
    if db_cliente:
        raise HTTPException(status_code=400, detail="El CUIT ya está registrado")
    return crud.create_cliente(db, cliente)

@app.get("/clientes/", response_model=list[schemas.Cliente], tags=["Maestros"])
def leer_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_clientes(db, skip=skip, limit=limit)

@app.put("/clientes/{cliente_id}", response_model=schemas.Cliente, tags=["Maestros"])
def actualizar_cliente(cliente_id: int, cliente_update: schemas.ClienteUpdate, db: Session = Depends(database.get_db)):
    db_cliente = crud.update_cliente(db, cliente_id, cliente_update)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente

@app.post("/transportistas/", response_model=schemas.Transportista, tags=["Maestros"])
def crear_transportista(trans: schemas.TransportistaCreate, db: Session = Depends(database.get_db)):
    db_trans = crud.get_transportista_by_cuit(db, cuitTrans=trans.cuitTrans)
    if db_trans:
        raise HTTPException(status_code=400, detail="El CUIT del transportista ya está registrado")
    return crud.create_transportista(db, trans)

@app.get("/transportistas/", response_model=list[schemas.Transportista], tags=["Maestros"])
def leer_transportistas(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_transportistas(db, skip=skip, limit=limit)

@app.put("/transportistas/{trans_id}", response_model=schemas.Transportista, tags=["Maestros"])
def actualizar_transportista(trans_id: int, trans_update: schemas.TransportistaUpdate, db: Session = Depends(database.get_db)):
    db_trans = crud.update_transportista(db, trans_id, trans_update)
    if not db_trans:
        raise HTTPException(status_code=404, detail="Transportista no encontrado")
    return db_trans

@app.post("/tarifas/", response_model=schemas.Tarifa, tags=["Maestros"])
def crear_tarifa(tarifa: schemas.TarifaCreate, db: Session = Depends(database.get_db)):
    return crud.create_tarifa(db, tarifa)

@app.get("/tarifas/", response_model=list[schemas.Tarifa], tags=["Maestros"])
def leer_tarifas(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_tarifas(db, skip=skip, limit=limit)

@app.put("/tarifas/{tarifa_id}", response_model=schemas.Tarifa, tags=["Maestros"])
def actualizar_tarifa(tarifa_id: int, tarifa_update: schemas.TarifaUpdate, db: Session = Depends(database.get_db)):
    db_tarifa = crud.update_tarifa(db, tarifa_id, tarifa_update)
    if not db_tarifa:
        raise HTTPException(status_code=404, detail="Tarifa no encontrada")
    return db_tarifa

@app.post("/viajes/", response_model=schemas.Viaje, tags=["Operaciones"])
def cargar_viaje(viaje: schemas.ViajeCreate, cli_id: int, trans_id: int, db: Session = Depends(database.get_db)):
    return crud.create_viaje(db, viaje, cli_id, trans_id)

@app.get("/viajes/", response_model=list[schemas.Viaje], tags=["Operaciones"])
def leer_viajes(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_viajes(db, skip=skip, limit=limit)

@app.put("/viajes/{viaje_id}", response_model=schemas.Viaje, tags=["Operaciones"])
def actualizar_viaje(viaje_id: int, viaje_update: schemas.ViajeUpdate, db: Session = Depends(database.get_db)):
    db_viaje = crud.update_viaje(db, viaje_id, viaje_update)
    if not db_viaje:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")
    return db_viaje

@app.post("/adelantos/", response_model=schemas.Adelanto, tags=["Operaciones"])
def cargar_adelanto(adelanto: schemas.AdelantoCreate, db: Session = Depends(database.get_db)):
    return crud.create_adelanto(db, adelanto)

@app.get("/adelantos/", response_model=list[schemas.Adelanto], tags=["Operaciones"])
def leer_adelantos(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_adelantos(db, skip=skip, limit=limit)

@app.put("/adelantos/{adelanto_id}", response_model=schemas.Adelanto, tags=["Operaciones"])
def actualizar_adelanto(adelanto_id: int, adelanto_update: schemas.AdelantoUpdate, db: Session = Depends(database.get_db)):
    db_adelanto = crud.update_adelanto(db, adelanto_id, adelanto_update)
    if not db_adelanto:
        raise HTTPException(status_code=404, detail="Adelanto no encontrado")
    return db_adelanto
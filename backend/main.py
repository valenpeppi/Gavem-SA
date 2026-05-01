from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers import clientes, transportistas, tarifas, viajes, adelantos, historial

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SISTEMA GAVEM SA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router)
app.include_router(transportistas.router)
app.include_router(tarifas.router)
app.include_router(viajes.router)
app.include_router(adelantos.router)
app.include_router(historial.router)
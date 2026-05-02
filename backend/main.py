from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database, auth
from .routers import clientes, transportistas, tarifas, viajes, adelantos, historial, auth as auth_router, usuarios

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SISTEMA GAVEM SA")


@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    try:
        auth.ensure_default_superadmin(db)
    finally:
        db.close()

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
app.include_router(auth_router.router)
app.include_router(usuarios.router)
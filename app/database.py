from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Estructura: postgresql://usuario:password@localhost:puerto/nombre_db
# RECUERDA: Cambia 'admin' por la contraseña que elegiste en la instalación
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:admin@localhost:5432/gavem_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Cada instancia de SessionLocal será una sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la DB en los endpoints (la usaremos después)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
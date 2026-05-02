from backend.database import engine, Base
# Importamos los modelos para que SQLAlchemy registre las tablas en el Base
from backend.models import Cliente, Transportista, Viaje, Tarifa, Adelanto, Usuario, SessionToken, HistorialCambio

def create_tables():
    print("🚀 Iniciando la creación de tablas en PostgreSQL para GAVEM SA...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ ¡Éxito! Las tablas se crearon correctamente en la base de datos 'gavem_db'.")
    except Exception as e:
        print(f"❌ Error al intentar crear las tablas: {e}")

if __name__ == "__main__":
    create_tables()
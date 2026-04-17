from app.database import engine, Base
# Importante: Importamos los modelos para que SQLAlchemy sepa qué tablas crear
from app.models import Cliente, Transportista, Viaje, Tarifa, Adelanto

def create_tables():
    print("🚀 Iniciando la creación de tablas en PostgreSQL para GAVEM SA...")
    try:
        # Esta es la instrucción que crea las tablas físicamente
        Base.metadata.create_all(bind=engine)
        print("✅ ¡Éxito! Las tablas se crearon correctamente en la base de datos 'gavem_db'.")
    except Exception as e:
        print(f"❌ Error al intentar crear las tablas: {e}")
        print("💡 Consejo: Asegurate de que la base de datos 'gavem_db' ya esté creada en pgAdmin y que la contraseña en database.py sea correcta.")

if __name__ == "__main__":
    create_tables()
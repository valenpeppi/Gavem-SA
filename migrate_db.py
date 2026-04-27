"""
Script de migracion para agregar columnas nuevas a la base de datos GAVEM SA.
Ejecutar una sola vez para aplicar los cambios al esquema existente.
"""
import psycopg2

DATABASE_URL = "postgresql://postgres:admin@localhost:5432/gavem_db"

def migrate():
    print("Iniciando migracion de base de datos...")
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        migrations = [
            ("dominio_camion en viajes",
             "ALTER TABLE viajes ADD COLUMN IF NOT EXISTS dominio_camion VARCHAR(20)"),
            ("dominio_acoplado en viajes",
             "ALTER TABLE viajes ADD COLUMN IF NOT EXISTS dominio_acoplado VARCHAR(20)"),
        ]

        for desc, sql in migrations:
            try:
                cur.execute(sql)
                conn.commit()
                print(f"  OK: {desc}")
            except Exception as e:
                conn.rollback()
                print(f"  WARN: {desc} -- {e}")

        cur.close()
        conn.close()
        print("\nMigracion completada exitosamente.")

    except Exception as e:
        print(f"ERROR de conexion: {e}")

if __name__ == "__main__":
    migrate()

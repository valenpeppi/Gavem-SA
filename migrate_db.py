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
            (
                "tabla usuarios",
                """
                CREATE TABLE IF NOT EXISTS usuarios (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    hashed_password VARCHAR(255) NOT NULL,
                    nombre VARCHAR(100) NOT NULL,
                    apellido VARCHAR(100) NOT NULL,
                    telefono VARCHAR(50),
                    rol VARCHAR(30) NOT NULL DEFAULT 'operador',
                    activo BOOLEAN DEFAULT TRUE,
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
            ),
            ("usuarios.hashed_password", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS hashed_password VARCHAR(255)"),
            ("usuarios.password_hash", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)"),
            (
                "usuarios.copiar password_hash -> hashed_password",
                "UPDATE usuarios SET hashed_password = password_hash WHERE (hashed_password IS NULL OR hashed_password = '') AND password_hash IS NOT NULL",
            ),
            (
                "usuarios.hashed_password not null",
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='usuarios' AND column_name='hashed_password'
                    ) THEN
                        ALTER TABLE usuarios ALTER COLUMN hashed_password SET NOT NULL;
                    END IF;
                END
                $$
                """,
            ),
            ("usuarios.nombre", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nombre VARCHAR(100)"),
            ("usuarios.apellido", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS apellido VARCHAR(100)"),
            ("usuarios.telefono", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(50)"),
            ("usuarios.rol", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(30) DEFAULT 'operador'"),
            ("usuarios.activo", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE"),
            ("usuarios.creado_en", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
            ("usuarios.actualizado_en", "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
            (
                "usuarios.rol enum->varchar",
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='usuarios' AND column_name='rol' AND udt_name='rolusuario'
                    ) THEN
                        ALTER TABLE usuarios
                        ALTER COLUMN rol TYPE VARCHAR(30)
                        USING lower(rol::text);
                    END IF;
                END
                $$
                """,
            ),
            ("usuarios.rol normalizar lowercase", "UPDATE usuarios SET rol = lower(rol::text) WHERE rol IS NOT NULL"),
            ("usuarios.rol default operador", "ALTER TABLE usuarios ALTER COLUMN rol SET DEFAULT 'operador'"),
            ("indice usuarios.username", "CREATE INDEX IF NOT EXISTS ix_usuarios_username ON usuarios (username)"),
            (
                "tabla session_tokens",
                """
                CREATE TABLE IF NOT EXISTS session_tokens (
                    id SERIAL PRIMARY KEY,
                    token VARCHAR(255) UNIQUE NOT NULL,
                    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
                    expiracion TIMESTAMP NOT NULL,
                    activo BOOLEAN DEFAULT TRUE,
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """,
            ),
            ("session_tokens.token", "ALTER TABLE session_tokens ADD COLUMN IF NOT EXISTS token VARCHAR(255)"),
            ("session_tokens.usuario_id", "ALTER TABLE session_tokens ADD COLUMN IF NOT EXISTS usuario_id INTEGER"),
            ("session_tokens.expiracion", "ALTER TABLE session_tokens ADD COLUMN IF NOT EXISTS expiracion TIMESTAMP"),
            ("session_tokens.activo", "ALTER TABLE session_tokens ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE"),
            ("session_tokens.creado_en", "ALTER TABLE session_tokens ADD COLUMN IF NOT EXISTS creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
            ("indice session_tokens.token", "CREATE INDEX IF NOT EXISTS ix_session_tokens_token ON session_tokens (token)"),
            ("indice session_tokens.usuario_id", "CREATE INDEX IF NOT EXISTS ix_session_tokens_usuario_id ON session_tokens (usuario_id)"),
            (
                "fk session_tokens->usuarios",
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint WHERE conname = 'fk_session_tokens_usuario'
                    ) THEN
                        ALTER TABLE session_tokens
                        ADD CONSTRAINT fk_session_tokens_usuario
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
                    END IF;
                END
                $$
                """,
            ),
            ("historial.empleado_id", "ALTER TABLE historial_cambios ADD COLUMN IF NOT EXISTS empleado_id INTEGER"),
            ("historial.empleado_nombre", "ALTER TABLE historial_cambios ADD COLUMN IF NOT EXISTS empleado_nombre VARCHAR(100)"),
            ("historial.empleado_apellido", "ALTER TABLE historial_cambios ADD COLUMN IF NOT EXISTS empleado_apellido VARCHAR(100)"),
            ("historial.empleado_telefono", "ALTER TABLE historial_cambios ADD COLUMN IF NOT EXISTS empleado_telefono VARCHAR(50)"),
            (
                "fk historial->usuarios",
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint WHERE conname = 'fk_historial_empleado'
                    ) THEN
                        ALTER TABLE historial_cambios
                        ADD CONSTRAINT fk_historial_empleado
                        FOREIGN KEY (empleado_id) REFERENCES usuarios(id);
                    END IF;
                END
                $$
                """,
            ),
            ("indice historial empleado_id", "CREATE INDEX IF NOT EXISTS ix_historial_cambios_empleado_id ON historial_cambios (empleado_id)"),
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

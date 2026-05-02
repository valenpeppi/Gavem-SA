import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable/DataTable';
import {
  crearUsuario,
  desactivarUsuario,
  getCurrentUser,
  getUsuarios,
  reactivarUsuario,
} from '../services/api';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [form, setForm] = useState({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rol: 'operador' as 'operador' | 'superadministrador',
  });

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const [users, me] = await Promise.all([getUsuarios(), getCurrentUser()]);
      setUsuarios(users);
      setCurrentUserId(me.id);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'No se pudo cargar la gestión de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await crearUsuario(form);
      setForm({
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        telefono: '',
        rol: 'operador',
      });
      await fetchUsuarios();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Error al crear usuario');
    }
  };

  const toggleActivo = async (usuario: any) => {
    setError(null);
    try {
      if (usuario.activo) {
        await desactivarUsuario(usuario.id);
      } else {
        await reactivarUsuario(usuario.id);
      }
      await fetchUsuarios();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'No se pudo actualizar el estado');
    }
  };

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Usuario', accessorKey: 'username' },
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Apellido', accessorKey: 'apellido' },
    { header: 'Teléfono', accessorKey: 'telefono' },
    {
      header: 'Rol',
      accessorKey: 'rol',
      cell: (row: any) => (
        <span className={row.rol === 'superadministrador' ? 'badge-active' : 'badge-inactive'}>
          {row.rol === 'superadministrador' ? 'Superadministrador' : 'Operador'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'activo',
      cell: (row: any) => (
        <span className={row.activo ? 'badge-active' : 'badge-inactive'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'acciones',
      cell: (row: any) => (
        <button
          disabled={row.id === currentUserId}
          onClick={() => toggleActivo(row)}
          className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
            row.activo
              ? 'text-red-700 border-red-200 bg-red-50 hover:bg-red-100'
              : 'text-green-700 border-green-200 bg-green-50 hover:bg-green-100'
          } ${row.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {row.activo ? 'Dar de baja' : 'Reactivar'}
        </button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Usuarios del sistema</h2>
          <p className="page-subtitle">Solo tu puedes crear, dar de baja y reactivar usuarios.</p>
        </div>
      </div>

      <div className="page-content space-y-4">
        {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>}

        <form onSubmit={handleCreate} className="bg-white border border-gray-100 rounded-xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Usuario"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            required
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
            required
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm((prev) => ({ ...prev, apellido: e.target.value }))}
            required
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={form.rol}
            onChange={(e) => setForm((prev) => ({ ...prev, rol: e.target.value as 'operador' | 'superadministrador' }))}
          >
            <option value="operador">Operador</option>
            <option value="superadministrador">Superadministrador</option>
          </select>

          <div className="md:col-span-6 flex justify-end">
            <button type="submit" className="btn-add">+ Crear usuario</button>
          </div>
        </form>

        <DataTable data={usuarios} columns={columns} isLoading={loading} />
      </div>
    </div>
  );
};

export default UsuariosPage;

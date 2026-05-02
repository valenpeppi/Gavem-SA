import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getCurrentUser, updateMyProfile, changeMyPassword, logout } from '../services/api';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then((u) => {
        setForm({ nombre: u.nombre || '', apellido: u.apellido || '', telefono: u.telefono || '' });
      })
      .catch(() => setError('No se pudo cargar datos del usuario'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await updateMyProfile(form);
      setSuccess('✓ Perfil actualizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Error al actualizar perfil');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (pw.newPassword !== pw.confirmPassword) {
      setError('La nueva contraseña y la confirmación no coinciden');
      return;
    }
    if (pw.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      await changeMyPassword({ current_password: pw.currentPassword, new_password: pw.newPassword, confirm_password: pw.confirmPassword });
      setSuccess('✓ Contraseña cambiada. Serás desconectado...');
      setTimeout(() => {
        logout().then(() => window.location.href = '/');
      }, 2000);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Error al cambiar contraseña');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Mi perfil</h2>
          <p className="page-subtitle">Actualiza tu información personal y contraseña</p>
        </div>
      </div>

      <div className="page-content space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
            {success}
          </div>
        )}

        {/* Sección: Datos Personales */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.nombre}
                  onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.apellido}
                  onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.telefono}
                onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-add">
                💾 Guardar cambios
              </button>
            </div>
          </form>
        </div>

        {/* Sección: Cambiar Contraseña */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={pw.currentPassword}
                  onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => ({ ...p, current: !p.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={pw.newPassword}
                    onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={pw.confirmPassword}
                    onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
              >
                🔐 Cambiar contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

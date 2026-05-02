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

  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);

    try {
      // Update profile data
      await updateMyProfile(form);
      
      // If password fields are filled, also change password
      if (pw.currentPassword || pw.newPassword || pw.confirmPassword) {
        if (!pw.currentPassword) {
          setError('Debes ingresar tu contraseña actual para cambiarla');
          return;
        }
        if (pw.newPassword !== pw.confirmPassword) {
          setError('La nueva contraseña y la confirmación no coinciden');
          return;
        }
        if (pw.newPassword.length < 6) {
          setError('La nueva contraseña debe tener al menos 6 caracteres');
          return;
        }
        
        await changeMyPassword({ current_password: pw.currentPassword, new_password: pw.newPassword, confirm_password: pw.confirmPassword });
        setSuccess('✓ Contraseña actualizada. Serás desconectado...');
        
        // Clear auth session and redirect
        setTimeout(async () => {
          try {
            await logout();
          } catch (e) {
            console.log('Logout error (expected):', e);
          } finally {
            window.location.href = '/';
          }
        }, 1500);
      } else {
        setSuccess('✓ Perfil actualizado exitosamente');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Error al guardar cambios');
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

      <div className="page-content space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs md:text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs md:text-sm">
            {success}
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6">
            <section className="space-y-3">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Información Personal</h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Datos personales</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.nombre}
                      onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.apellido}
                      onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.telefono}
                    onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-3 xl:border-l xl:border-gray-100 xl:pl-6">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Cambiar Contraseña</h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Dejala en blanco si no querés cambiarla</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      value={pw.currentPassword}
                      onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        value={pw.newPassword}
                        onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
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
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        value={pw.confirmPassword}
                        onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
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
              </div>
            </section>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              💾 Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

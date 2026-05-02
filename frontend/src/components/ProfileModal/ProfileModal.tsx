import { useEffect, useState } from 'react';
import { getCurrentUser, updateMyProfile, changeMyPassword, logout } from '../../services/api';

type Props = {
  onClose: () => void;
  onUpdated?: (user: any) => void;
};

const ProfileModal = ({ onClose, onUpdated }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then((u) => {
        setForm({ nombre: u.nombre || '', apellido: u.apellido || '', telefono: u.telefono || '' });
      })
      .catch(() => setError('No se pudo cargar usuario'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateMyProfile(form);
      setSuccess('Perfil actualizado');
      if (onUpdated) onUpdated(updated);
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
    try {
      await changeMyPassword({ current_password: pw.currentPassword, new_password: pw.newPassword, confirm_password: pw.confirmPassword });
      setSuccess('Contraseña cambiada. Se cerrará la sesión, volvé a ingresar con la nueva contraseña.');
      // after changing password backend invalidates sessions; force logout
      await logout();
      window.location.reload();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Error al cambiar contraseña');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Mi perfil</h3>
          <button onClick={onClose} className="btn-close">X</button>
        </div>

        {error && <div className="p-2 rounded bg-red-50 text-red-700">{error}</div>}
        {success && <div className="p-2 rounded bg-green-50 text-green-700">{success}</div>}

        <div className="modal-body">
          <form onSubmit={handleSaveProfile} className="space-y-2">
            <label className="block">Nombre</label>
            <input className="input" value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} />

            <label className="block">Apellido</label>
            <input className="input" value={form.apellido} onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))} />

            <label className="block">Teléfono</label>
            <input className="input" value={form.telefono} onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))} />

            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Guardar datos</button>
            </div>
          </form>

          <hr className="my-3" />

          <form onSubmit={handleChangePassword} className="space-y-2">
            <label className="block">Contraseña actual</label>
            <input type="password" className="input" value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} />

            <label className="block">Nueva contraseña</label>
            <input type="password" className="input" value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} />

            <label className="block">Confirmar nueva contraseña</label>
            <input type="password" className="input" value={pw.confirmPassword} onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))} />

            <div className="flex justify-end">
              <button type="submit" className="btn-danger">Cambiar contraseña</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

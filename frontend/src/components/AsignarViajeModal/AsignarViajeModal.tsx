import React, { useState, useEffect } from 'react';
import { getViajes, actualizarAdelanto } from '../../services/api';

interface AsignarViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adelanto: any; // El adelanto a editar
}

const AsignarViajeModal: React.FC<AsignarViajeModalProps> = ({
  isOpen, onClose, onSuccess, adelanto
}) => {
  const [viajes, setViajes] = useState<any[]>([]);
  const [viajeId, setViajeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !adelanto) return;
    setViajeId('');
    setError(null);
    setIsLoading(true);

    getViajes()
      .then((data) => {
        // Solo viajes del mismo transportista
        const filtrados = data.filter(
          (v: any) => String(v.transportista_id) === String(adelanto.transportista_id)
        );
        setViajes(filtrados.sort((a: any, b: any) => b.id - a.id));
      })
      .catch(() => setError('Error al cargar los viajes.'))
      .finally(() => setIsLoading(false));
  }, [isOpen, adelanto]);

  if (!isOpen || !adelanto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viajeId) {
      setError('Debe seleccionar un viaje.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await actualizarAdelanto(adelanto.id, { viaje_id: parseInt(viajeId) });
      onSuccess();
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Error al asignar el viaje.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Asignar Viaje a Adelanto</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Vale <span className="font-mono font-semibold">{adelanto.nro_vale}</span>
              {' · '}
              <span className="font-semibold text-blue-600">
                ${parseFloat(adelanto.monto_total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-24 text-gray-500 text-sm">
              Cargando viajes del transportista...
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                  {error}
                </div>
              )}

              <form id="asignar-form" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Viaje a asignar <span className="text-red-500">*</span>
                </label>

                {viajes.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm text-center">
                    No hay viajes disponibles para este transportista.
                  </div>
                ) : (
                  <select
                    required
                    value={viajeId}
                    onChange={(e) => setViajeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">— Seleccione un viaje —</option>
                    {viajes.map((v) => (
                      <option key={v.id} value={v.id}>
                        Ord #{v.ordenante} · {new Date(v.fecha).toLocaleDateString('es-AR')} · {v.chofer} · {v.lugar_desde} → {v.lugar_hasta}
                      </option>
                    ))}
                  </select>
                )}

                {viajeId && (
                  <p className="text-xs text-blue-600 mt-2">
                    ✓ El importe del adelanto se descontará del saldo del viaje seleccionado.
                  </p>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="asignar-form"
            disabled={isSubmitting || isLoading || viajes.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Asignando...' : 'Asignar Viaje'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarViajeModal;

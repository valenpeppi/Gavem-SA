import React from 'react';
import { useAdelantoModal } from '../../hooks/useAdelantoModal';

interface AdelantoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdelantoModal: React.FC<AdelantoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    viajes,
    viajeId, setViajeId,
    tipo, setTipo,
    montoTotal, setMontoTotal,
    observaciones, setObservaciones,
    isLoading,
    isSubmitting,
    error,
    handleSubmit
  } = useAdelantoModal({ isOpen, onClose, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
          <h3 className="text-xl font-bold text-gray-800">
            Carga de Nuevo Adelanto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              Cargando datos...
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md shadow-sm">
                  {error}
                </div>
              )}

              <form id="adelanto-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Viaje Asociado *</label>
                    <select
                      required
                      value={viajeId}
                      onChange={(e) => setViajeId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Seleccione un viaje</option>
                      {viajes.map(v => (
                        <option key={v.id} value={v.id}>
                          Ord: {v.ordenante} | Fecha: {new Date(v.fecha).toLocaleDateString()} | Chofer: {v.chofer}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">El importe de este adelanto se descontará automáticamente del saldo de este viaje.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Adelanto *</label>
                    <select
                      required
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="Vale Combustible">Vale Combustible</option>
                      <option value="Vale Efectivo">Vale Efectivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Importe ($) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      value={montoTotal}
                      onChange={(e) => setMontoTotal(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-blue-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={3}
                      placeholder="Detalles adicionales del vale..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 shrink-0 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting || isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="adelanto-form"
            disabled={isSubmitting || isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center shadow-sm"
          >
            {isSubmitting ? 'Guardando...' : 'Registrar Adelanto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdelantoModal;

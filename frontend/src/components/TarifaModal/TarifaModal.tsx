import React from 'react';
import { useTarifaModal } from '../../hooks/useTarifaModal';

interface TarifaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TarifaModal: React.FC<TarifaModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    clientes,
    clienteId, setClienteId,
    precioKmTon, setPrecioKmTon,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    error, isSubmitting, isLoading,
    handleSubmit
  } = useTarifaModal({ isOpen, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Nueva Tarifa de Cliente</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Cargando clientes...</div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                  {error}
                </div>
              )}

              <form id="tarifa-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select
                    required
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} (CUIT: {c.cuit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio por KM-TON ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={precioKmTon}
                    onChange={(e) => setPrecioKmTon(e.target.value)}
                    placeholder="Ej. 1500.50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vigencia Desde *</label>
                    <input
                      type="date"
                      required
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vigencia Hasta *</label>
                    <input
                      type="date"
                      required
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting || isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="tarifa-form"
            disabled={isSubmitting || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Tarifa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarifaModal;

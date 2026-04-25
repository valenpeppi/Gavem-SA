import React from 'react';
import { useAdelantoModal } from '../../hooks/useAdelantoModal';

interface AdelantoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdelantoModal: React.FC<AdelantoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    transportistas,
    viajesFiltrados,
    transportistaId, setTransportistaId,
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Nuevo Adelanto</h3>
            <p className="text-xs text-gray-500 mt-0.5">El viaje puede asignarse en otro momento</p>
          </div>
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

                {/* Sección requerida */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 border-b pb-2">
                    Datos del Adelanto <span className="text-red-500">*</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Transportista */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transportista <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={transportistaId}
                        onChange={(e) => { setTransportistaId(e.target.value); setViajeId(''); }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="">Seleccione un transportista</option>
                        {transportistas.map(t => (
                          <option key={t.id} value={t.id}>{t.nomTrans} (Cód: {t.codTrans})</option>
                        ))}
                      </select>
                    </div>

                    {/* Tipo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Adelanto <span className="text-red-500">*</span>
                      </label>
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

                    {/* Importe */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Importe ($) <span className="text-red-500">*</span>
                      </label>
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
                  </div>
                </div>

                {/* Sección opcional: asignación de viaje */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-1 border-b border-blue-200 pb-2">
                    Asignación a Viaje <span className="text-xs font-normal normal-case text-blue-500">(Opcional)</span>
                  </h4>
                  <p className="text-xs text-blue-600 mb-3">
                    Si no se asigna ahora, el adelanto quedará pendiente y podrá vincularse a un viaje más adelante.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Viaje Asociado</label>
                    <select
                      value={viajeId}
                      onChange={(e) => setViajeId(e.target.value)}
                      disabled={!transportistaId}
                      className={`w-full px-3 py-2 border border-blue-200 rounded-lg outline-none transition-all ${
                        !transportistaId
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
                      }`}
                    >
                      <option value="">
                        {!transportistaId
                          ? 'Primero seleccione un transportista'
                          : viajesFiltrados.length === 0
                            ? 'Sin viajes disponibles para este transportista'
                            : 'Sin asignar (dejar en blanco)'
                        }
                      </option>
                      {viajesFiltrados.map(v => (
                        <option key={v.id} value={v.id}>
                          Ord #{v.ordenante} | {new Date(v.fecha).toLocaleDateString('es-AR')} | {v.chofer}
                        </option>
                      ))}
                    </select>
                    {viajeId && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✓ El importe se descontará automáticamente del saldo del viaje seleccionado.
                      </p>
                    )}
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={2}
                    placeholder="Detalles adicionales del vale..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  />
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

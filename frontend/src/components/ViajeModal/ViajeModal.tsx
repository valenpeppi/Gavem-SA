import React from 'react';
import { useViajeModal } from '../../hooks/useViajeModal';

interface ViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  viajeAEditar?: any;
}

const ViajeModal: React.FC<ViajeModalProps> = ({ isOpen, onClose, onSuccess, viajeAEditar }) => {
  const {
    clientes, transportistas, ordenante, clienteId, setClienteId,
    transportistaId, setTransportistaId, propioTercero, setPropioTercero,
    chofer, setChofer, cartaPorte, setCartaPorte, mercaderia, setMercaderia,
    lugarDesde, setLugarDesde, lugarHasta, setLugarHasta, provOrigen, setProvOrigen,
    provDestino, setProvDestino, kms, setKms, kilos, setKilos, cubicaje, setCubicaje,
    condicion, setCondicion, varios, setVarios, comentario, setComentario,
    observaciones, setObservaciones, fecha, setFecha, tarifaAplicada, setTarifaAplicada,
    importe, setImporte, comision8, setComision8, neto, setNeto, iva21, setIva21,
    adelantosConsumidos, setAdelantosConsumidos, saldo, setSaldo, ordenPago, setOrdenPago,
    facturaGavem, setFacturaGavem, impFactGavem, setImpFactGavem,
    nroFcTransportista, setNroFcTransportista, impFactTransportista, setImpFactTransportista,
    error, isSubmitting, isLoading, handleSubmit
  } = useViajeModal({ isOpen, onClose, onSuccess, viajeAEditar });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl my-8 relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-3">
              Ord #{ordenante}
            </span>
            {viajeAEditar ? 'Editar Viaje' : 'Carga de Nuevo Viaje'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body - Scrollable */}
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

              <form id="viaje-form" onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* COLUMNA IZQUIERDA - OPERATIVA */}
                  <div className="space-y-6">
                    {/* Sección 1: Actores */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Actores y Fechas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                          <select
                            required
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="">Seleccione cliente</option>
                            {clientes.map(c => (
                              <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transportista *</label>
                          <select
                            required
                            value={transportistaId}
                            onChange={(e) => setTransportistaId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="">Seleccione transportista</option>
                            {transportistas.map(t => (
                              <option key={t.id} value={t.id}>{t.nomTrans}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Propio / Tercero</label>
                          <select
                            value={propioTercero}
                            onChange={(e) => setPropioTercero(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="Propio">Propio</option>
                            <option value="Tercero">Tercero</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Viaje *</label>
                          <input
                            type="date"
                            required
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chofer *</label>
                          <input
                            type="text"
                            required
                            value={chofer}
                            onChange={(e) => setChofer(e.target.value)}
                            placeholder="Nombre del chofer"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sección 2: Carga y Ruta */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Información de Carga y Ruta</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mercadería *</label>
                          <input
                            type="text"
                            required
                            value={mercaderia}
                            onChange={(e) => setMercaderia(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Carta de Porte *</label>
                          <input
                            type="text"
                            required
                            value={cartaPorte}
                            onChange={(e) => setCartaPorte(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lugar Desde *</label>
                          <input
                            type="text"
                            required
                            value={lugarDesde}
                            onChange={(e) => setLugarDesde(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lugar Hasta *</label>
                          <input
                            type="text"
                            required
                            value={lugarHasta}
                            onChange={(e) => setLugarHasta(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={kms}
                            onChange={(e) => setKms(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kilos *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={kilos}
                            onChange={(e) => setKilos(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Condición *</label>
                          <select
                            required
                            value={condicion}
                            onChange={(e) => setCondicion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Provincia Destino</label>
                          <input
                            type="text"
                            value={provDestino}
                            onChange={(e) => setProvDestino(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA DERECHA - FINANZAS Y ADMIN */}
                  <div className="space-y-6">
                    {/* Sección 3: Finanzas */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Sección Financiera (Auto-calculada)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Tarifa Aplicada</label>
                          <input
                            type="number" step="0.01" value={tarifaAplicada} onChange={(e) => setTarifaAplicada(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Importe</label>
                          <input
                            type="number" step="0.01" value={importe} onChange={(e) => setImporte(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Comisión 8%</label>
                          <input
                            type="number" step="0.01" value={comision8} onChange={(e) => setComision8(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Neto</label>
                          <input
                            type="number" step="0.01" value={neto} onChange={(e) => setNeto(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white font-semibold text-blue-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">IVA 21%</label>
                          <input
                            type="number" step="0.01" value={iva21} onChange={(e) => setIva21(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Gastos Varios</label>
                          <input
                            type="number" step="0.01" value={varios} onChange={(e) => setVarios(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Adelantos</label>
                          <input
                            type="number" step="0.01" value={adelantosConsumidos} onChange={(e) => setAdelantosConsumidos(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Saldo a Pagar</label>
                          <input
                            type="number" step="0.01" value={saldo} onChange={(e) => setSaldo(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-green-50 font-bold text-green-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sección 4: Administrativa */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Facturación y Administración</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Orden de Pago</label>
                          <input
                            type="text" value={ordenPago} onChange={(e) => setOrdenPago(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Factura GAVEM</label>
                          <input
                            type="text" value={facturaGavem} onChange={(e) => setFacturaGavem(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nro Factura Transporte</label>
                          <input
                            type="text" value={nroFcTransportista} onChange={(e) => setNroFcTransportista(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Imp. Factura Transp. ($)</label>
                          <input
                            type="number" step="0.01" value={impFactTransportista} onChange={(e) => setImpFactTransportista(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones Administrativas</label>
                          <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>
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
            form="viaje-form"
            disabled={isSubmitting || isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center shadow-sm"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : viajeAEditar ? 'Guardar Cambios' : 'Registrar Viaje'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViajeModal;

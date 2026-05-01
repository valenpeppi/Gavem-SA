import React from 'react';
import { useViajeModal } from '../../hooks/useViajeModal';

interface ViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  viajeAEditar?: any;
}

const MERCADERIAS = [
  'Soja', 'Maíz', 'Arveja', 'Bolsones', 'Espiga',
  'Camelina', 'Girasol', 'Fertilizante', 'Maní', 'Trigo', 'Varios'
];

const ViajeModal: React.FC<ViajeModalProps> = ({ isOpen, onClose, onSuccess, viajeAEditar }) => {
  const {
    clientes, transportistas, ordenante, clienteId, setClienteId,
    transportistaId, setTransportistaId, propioTercero, setPropioTercero,
    chofer, setChofer, cartaPorte, setCartaPorte, mercaderia, setMercaderia,
    lugarDesde, setLugarDesde, lugarHasta, setLugarHasta, provOrigen, setProvOrigen,
    provDestino, setProvDestino, kms, setKms, kilos, setKilos,
    condicion, setCondicion, varios, setVarios,
    observaciones, setObservaciones, fecha, setFecha, tarifaAplicada, setTarifaAplicada,
    importe, setImporte, comision8, setComision8, neto, setNeto, iva21, setIva21,
    adelantosConsumidos, setAdelantosConsumidos, saldo, setSaldo, ordenPago, setOrdenPago,
    facturaGavem, setFacturaGavem,
    nroFcTransportista, setNroFcTransportista, impFactTransportista, setImpFactTransportista,
    dominioCamion, setDominioCamion, dominioAcoplado, setDominioAcoplado,
    error, isSubmitting, isLoading, handleSubmit
  } = useViajeModal({ isOpen, onClose, onSuccess, viajeAEditar });

  if (!isOpen) return null;

  const inputBase = 'w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all';
  const inputActive = 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const inputDisabled = 'bg-gray-100 text-gray-500 cursor-not-allowed';
  const fieldClass = (disabled: boolean) => `${inputBase} ${disabled ? inputDisabled : inputActive}`;

  // Estado de observaciones para badge visual
  const obsLabel = (observaciones || '').trim().toLowerCase();
  const obsBadge = {
    'pagado':         { color: 'bg-green-100 text-green-700 border-green-300', label: '✓ Pagado' },
    'liquidado':      { color: 'bg-blue-100 text-blue-700 border-blue-300',   label: '📄 Liquidado' },
    'preliquidacion': { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: '⏳ Preliquidación' },
  }[obsLabel] || { color: 'bg-gray-100 text-gray-500 border-gray-200', label: '— Sin estado' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl my-8 relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              Ord #{ordenante}
            </span>
            <h3 className="text-xl font-bold text-gray-800">
              {viajeAEditar ? 'Editar Viaje' : 'Carga de Nuevo Viaje'}
            </h3>
            {/* Badge de estado */}
            {viajeAEditar && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${obsBadge.color}`}>
                {obsBadge.label}
              </span>
            )}
          </div>
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

                    {/* Sección 1: Actores y Fechas — OBLIGATORIA */}
                    <div className={`p-4 rounded-lg border ${viajeAEditar ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          Actores y Fechas <span className="text-red-400">*</span>
                        </h4>
                        {viajeAEditar && (
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">🔒 No editable</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente <span className="text-red-500">*</span></label>
                          <select
                            required
                            disabled={!!viajeAEditar}
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            className={fieldClass(!!viajeAEditar)}
                          >
                            <option value="">Seleccione cliente</option>
                            {clientes.map(c => (
                              <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transportista <span className="text-red-500">*</span></label>
                          <select
                            required
                            disabled={!!viajeAEditar}
                            value={transportistaId}
                            onChange={(e) => setTransportistaId(e.target.value)}
                            className={fieldClass(!!viajeAEditar)}
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
                            disabled={!!viajeAEditar}
                            value={propioTercero}
                            onChange={(e) => setPropioTercero(e.target.value)}
                            className={fieldClass(!!viajeAEditar)}
                          >
                            <option value="Propio">Propio</option>
                            <option value="Tercero">Tercero</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Viaje <span className="text-red-500">*</span></label>
                          <input
                            type="date"
                            required
                            disabled={!!viajeAEditar}
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className={fieldClass(!!viajeAEditar)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chofer <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            disabled={!!viajeAEditar}
                            value={chofer}
                            onChange={(e) => setChofer(e.target.value)}
                            placeholder="Nombre del chofer"
                            className={fieldClass(!!viajeAEditar)}
                          />
                        </div>

                        {/* Dominios (patentes) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dominio Camión <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            disabled={!!viajeAEditar}
                            value={dominioCamion}
                            onChange={(e) => setDominioCamion(e.target.value.toUpperCase())}
                            placeholder="Ej: ABC123"
                            maxLength={10}
                            className={`${fieldClass(!!viajeAEditar)} uppercase tracking-widest font-mono`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dominio Acoplado <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                          </label>
                          <input
                            type="text"
                            disabled={!!viajeAEditar}
                            value={dominioAcoplado}
                            onChange={(e) => setDominioAcoplado(e.target.value.toUpperCase())}
                            placeholder="Ej: XY1234"
                            maxLength={10}
                            className={`${fieldClass(!!viajeAEditar)} uppercase tracking-widest font-mono`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sección 2: Carga y Ruta — OBLIGATORIA */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                        Información de Carga y Ruta <span className="text-red-400">*</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Mercadería como select */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mercadería <span className="text-red-500">*</span></label>
                          <select
                            required
                            value={mercaderia}
                            onChange={(e) => setMercaderia(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          >
                            <option value="">Seleccione mercadería</option>
                            {MERCADERIAS.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Carta de Porte <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={cartaPorte}
                            onChange={(e) => setCartaPorte(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lugar Desde <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={lugarDesde}
                            onChange={(e) => setLugarDesde(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lugar Hasta <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={lugarHasta}
                            onChange={(e) => setLugarHasta(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            min="0.01"
                            value={kms}
                            onChange={(e) => setKms(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kilos <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            min="0.01"
                            value={kilos}
                            onChange={(e) => setKilos(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Condición <span className="text-red-500">*</span></label>
                          <select
                            required
                            value={condicion}
                            onChange={(e) => setCondicion(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Provincia Origen</label>
                          <input
                            type="text"
                            value={provOrigen}
                            onChange={(e) => setProvOrigen(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Provincia Destino</label>
                          <input
                            type="text"
                            value={provDestino}
                            onChange={(e) => setProvDestino(e.target.value)}
                            className={`${inputBase} ${inputActive}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA DERECHA - FINANZAS Y ADMIN */}
                  <div className="space-y-6">

                    {/* Sección 3: Finanzas */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">
                        Sección Financiera (Auto-calculada)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Tarifa Aplicada</label>
                          <input type="number" step="0.01" value={tarifaAplicada} onChange={(e) => setTarifaAplicada(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Importe</label>
                          <input type="number" step="0.01" value={importe} onChange={(e) => setImporte(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Comisión 8%</label>
                          <input type="number" step="0.01" value={comision8} onChange={(e) => setComision8(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Neto</label>
                          <input type="number" step="0.01" value={neto} onChange={(e) => setNeto(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white font-semibold text-blue-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">IVA 21%</label>
                          <input type="number" step="0.01" value={iva21} onChange={(e) => setIva21(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Gastos Varios</label>
                          <input type="number" step="0.01" value={varios} onChange={(e) => setVarios(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Adelantos</label>
                          <input type="number" step="0.01" value={adelantosConsumidos} onChange={(e) => setAdelantosConsumidos(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Saldo a Pagar</label>
                          <input type="number" step="0.01" value={saldo} onChange={(e) => setSaldo(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-green-50 font-bold text-green-700" />
                        </div>
                      </div>
                    </div>

                    {/* Sección 4: Administrativa */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                        Facturación y Administración
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Orden de Pago</label>
                          <input type="text" value={ordenPago} onChange={(e) => setOrdenPago(e.target.value)}
                            className={`${inputBase} ${inputActive}`} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Factura GAVEM</label>
                          <input type="text" value={facturaGavem} onChange={(e) => setFacturaGavem(e.target.value)}
                            className={`${inputBase} ${inputActive}`} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nro Factura Transporte</label>
                          <input type="text" value={nroFcTransportista} onChange={(e) => setNroFcTransportista(e.target.value)}
                            className={`${inputBase} ${inputActive}`} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Imp. Factura Transp. ($)</label>
                          <input type="number" step="0.01" value={impFactTransportista} onChange={(e) => setImpFactTransportista(e.target.value)}
                            className={`${inputBase} ${inputActive}`} />
                        </div>

                        {/* Estado / Observaciones con opciones */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado (Observaciones)
                            <span className="ml-2 text-xs text-gray-400 font-normal">
                              — Se actualiza automáticamente según factura/pago
                            </span>
                          </label>
                          <div className="flex gap-2 flex-wrap mb-2">
                            {['', 'Preliquidacion', 'Liquidado', 'Pagado'].map(est => (
                              <button
                                key={est}
                                type="button"
                                onClick={() => setObservaciones(est)}
                                className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${
                                  observaciones === est
                                    ? est === '' ? 'bg-gray-200 text-gray-700 border-gray-400'
                                      : est === 'Preliquidacion' ? 'bg-yellow-200 text-yellow-800 border-yellow-400'
                                      : est === 'Liquidado' ? 'bg-blue-200 text-blue-800 border-blue-400'
                                      : 'bg-green-200 text-green-800 border-green-400'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                }`}
                              >
                                {est === '' ? '— Sin estado' : est}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Estado del viaje (se calcula automáticamente)"
                            className={`${inputBase} ${inputActive} text-sm`}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            💡 Al guardar con Orden de Pago → "Pagado" | Con Nro Factura Transporte → "Liquidado"
                          </p>
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

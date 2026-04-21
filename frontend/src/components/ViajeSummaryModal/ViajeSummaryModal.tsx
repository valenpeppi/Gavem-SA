import React from 'react';

interface ViajeSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  viaje: any;
  transportistas: any[];
  clientes: any[];
}

const fmt = (val: any) => {
  const num = parseFloat(val);
  if (isNaN(num)) return '—';
  return '$' + num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const ViajeSummaryModal: React.FC<ViajeSummaryModalProps> = ({ isOpen, onClose, viaje, transportistas, clientes }) => {
  if (!isOpen || !viaje) return null;

  const transportista = transportistas.find((t: any) => t.id === viaje.transportista_id);
  const cliente = clientes.find((c: any) => c.id === viaje.cliente_id);
  const condicionLabel = viaje.condicion === 'UNO' || viaje.condicion === '1' ? 'Condición 1' : 'Condición 2';
  const fechaStr = new Date(viaje.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">

        {/* Header strip */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 text-white flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Resumen de Viaje</p>
            <h2 className="text-2xl font-bold">Orden #{viaje.ordenante}</h2>
            <p className="text-blue-200 text-sm mt-1">{fechaStr}</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors text-2xl leading-none font-bold mt-1">
            &times;
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Actors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">Cliente</p>
              <p className="text-gray-800 font-bold text-lg">{cliente?.nombre || `ID ${viaje.cliente_id}`}</p>
              {cliente?.cuit && <p className="text-gray-500 text-sm">CUIT: {cliente.cuit}</p>}
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-green-500 font-semibold uppercase tracking-wider mb-1">Transportista</p>
              <p className="text-gray-800 font-bold text-lg">{transportista?.nomTrans || `ID ${viaje.transportista_id}`}</p>
              {transportista?.cuitTrans && <p className="text-gray-500 text-sm">CUIT: {transportista.cuitTrans}</p>}
            </div>
          </div>

          {/* Route */}
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Ruta y Carga</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-center">
                <p className="text-xs text-gray-400">Desde</p>
                <p className="font-semibold text-gray-700">{viaje.lugar_desde}{viaje.prov_origen ? ` (${viaje.prov_origen})` : ''}</p>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-gray-400 text-sm">→</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Hasta</p>
                <p className="font-semibold text-gray-700">{viaje.lugar_hasta}{viaje.prov_destino ? ` (${viaje.prov_destino})` : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div><p className="text-gray-400">Chofer</p><p className="font-medium text-gray-700">{viaje.chofer}</p></div>
              <div><p className="text-gray-400">Mercadería</p><p className="font-medium text-gray-700">{viaje.mercaderia}</p></div>
              <div><p className="text-gray-400">Carta de Porte</p><p className="font-medium text-gray-700">{viaje.carta_porte}</p></div>
              <div><p className="text-gray-400">Kilómetros</p><p className="font-medium text-gray-700">{viaje.kms} km</p></div>
              <div><p className="text-gray-400">Kilos</p><p className="font-medium text-gray-700">{Number(viaje.kilos).toLocaleString('es-AR')} kg</p></div>
              <div><p className="text-gray-400">Condición</p><p className="font-medium text-gray-700">{condicionLabel}</p></div>
            </div>
          </div>

          {/* Financials */}
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Liquidación</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tarifa aplicada</span>
                <span className="font-medium">{fmt(viaje.tarifa_aplicada)} / km·ton</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Importe bruto</span>
                <span className="font-medium">{fmt(viaje.importe)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Comisión GAVEM (8%)</span>
                <span className="font-medium text-red-500">- {fmt(viaje.comision_8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Neto</span>
                <span className="font-medium">{fmt(viaje.neto)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IVA 21%</span>
                <span className="font-medium">{fmt(viaje.iva_21)}</span>
              </div>
              {parseFloat(viaje.varios) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Gastos varios</span>
                  <span className="font-medium text-red-500">- {fmt(viaje.varios)}</span>
                </div>
              )}
              {viaje.adelantos && viaje.adelantos.length > 0 && (
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Adelantos</span>
                    <span className="font-medium text-red-500">- {fmt(viaje.adelantos_consumidos)}</span>
                  </div>
                  <div className="ml-4 mt-1 space-y-1">
                    {viaje.adelantos.map((a: any) => (
                      <div key={a.id} className="flex justify-between text-xs text-gray-400">
                        <span>{a.nro_vale} — {a.tipo}</span>
                        <span>{fmt(a.monto_total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-700">Saldo a pagar</span>
                <span className="text-xl font-bold text-green-600">{fmt(viaje.saldo)}</span>
              </div>
            </div>
          </div>

          {/* Admin */}
          {(viaje.factura_gavem || viaje.nro_fc_transportista || viaje.orden_pago) && (
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Datos Administrativos</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {viaje.orden_pago && <div><p className="text-gray-400">Orden de Pago</p><p className="font-medium">{viaje.orden_pago}</p></div>}
                {viaje.factura_gavem && <div><p className="text-gray-400">Factura GAVEM</p><p className="font-medium">{viaje.factura_gavem}</p></div>}
                {viaje.nro_fc_transportista && <div><p className="text-gray-400">Fact. Transportista</p><p className="font-medium">{viaje.nro_fc_transportista}</p></div>}
                {viaje.imp_fact_transportista && <div><p className="text-gray-400">Imp. Fact. Transp.</p><p className="font-medium">{fmt(viaje.imp_fact_transportista)}</p></div>}
              </div>
            </div>
          )}

          {viaje.observaciones && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wider mb-1">Observaciones</p>
              <p className="text-gray-700 text-sm">{viaje.observaciones}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViajeSummaryModal;

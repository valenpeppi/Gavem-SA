import React, { useState, useEffect } from 'react';
import { cargarViaje, getClientes, getTransportistas, getViajes, getTarifas } from '../services/api';

interface ViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ViajeModal: React.FC<ViajeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // Select options
  const [clientes, setClientes] = useState<any[]>([]);
  const [transportistas, setTransportistas] = useState<any[]>([]);
  const [tarifas, setTarifas] = useState<any[]>([]);

  // Form fields - Basicos
  const [ordenante, setOrdenante] = useState('1');
  const [clienteId, setClienteId] = useState('');
  const [transportistaId, setTransportistaId] = useState('');
  const [propioTercero, setPropioTercero] = useState('Tercero');
  const [chofer, setChofer] = useState('');
  const [cartaPorte, setCartaPorte] = useState('');
  const [mercaderia, setMercaderia] = useState('');
  const [lugarDesde, setLugarDesde] = useState('');
  const [lugarHasta, setLugarHasta] = useState('');
  const [provOrigen, setProvOrigen] = useState('');
  const [provDestino, setProvDestino] = useState('');
  const [kms, setKms] = useState('');
  const [kilos, setKilos] = useState('');
  const [cubicaje, setCubicaje] = useState('');
  const [condicion, setCondicion] = useState('1');
  const [varios, setVarios] = useState('');
  const [comentario, setComentario] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  
  // Form fields - Financieros
  const [tarifaAplicada, setTarifaAplicada] = useState('');
  const [importe, setImporte] = useState('');
  const [comision8, setComision8] = useState('');
  const [neto, setNeto] = useState('');
  const [iva21, setIva21] = useState('');
  const [adelantosConsumidos, setAdelantosConsumidos] = useState('');
  const [saldo, setSaldo] = useState('');
  const [rentabilidad, setRentabilidad] = useState('');

  // Form fields - Administrativos
  const [ordenPago, setOrdenPago] = useState('');
  const [facturaGavem, setFacturaGavem] = useState('');
  const [impFactGavem, setImpFactGavem] = useState('');
  const [nroFcTransportista, setNroFcTransportista] = useState('');
  const [impFactTransportista, setImpFactTransportista] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarDatosIniciales();
    }
  }, [isOpen]);

  const cargarDatosIniciales = async () => {
    setIsLoading(true);
    try {
      const [resClientes, resTransportistas, resViajes, resTarifas] = await Promise.all([
        getClientes(),
        getTransportistas(),
        getViajes(),
        getTarifas()
      ]);
      setClientes(resClientes);
      setTransportistas(resTransportistas);
      setTarifas(resTarifas);
      
      // Auto-calculate ordenante
      const nextOrdenante = resViajes.length + 1;
      setOrdenante(nextOrdenante.toString());
      
      // Reset form (except ordenante which is auto-calculated)
      setClienteId(''); setTransportistaId(''); setPropioTercero('Tercero'); setChofer('');
      setCartaPorte(''); setMercaderia(''); setLugarDesde(''); setLugarHasta('');
      setProvOrigen(''); setProvDestino(''); setKms(''); setKilos(''); setCubicaje('');
      setCondicion('1'); setVarios(''); setComentario(''); setObservaciones('');
      setFecha(new Date().toISOString().split('T')[0]);
      
      setTarifaAplicada(''); setImporte(''); setComision8(''); setNeto(''); setIva21('');
      setAdelantosConsumidos(''); setSaldo(''); setRentabilidad('');
      
      setOrdenPago(''); setFacturaGavem(''); setImpFactGavem(''); setNroFcTransportista(''); setImpFactTransportista('');
      
      setError(null);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos necesarios para el formulario.");
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para Cálculos Automáticos
  useEffect(() => {
    if (!isOpen) return;

    let tarifaNum = 0;
    
    // Buscar si el cliente tiene tarifa
    if (clienteId) {
      const tarifaObj = tarifas.find(t => String(t.cliente_id) === String(clienteId));
      if (tarifaObj) {
        tarifaNum = parseFloat(tarifaObj.precio_km_ton) || 0;
      }
    }
    
    const kmsNum = parseFloat(kms) || 0;
    const kilosNum = parseFloat(kilos) || 0;
    
    // Si no hay tarifa automatica, quizas el usuario tippió una? 
    // Usamos la manual si la tarifaNum automatica es 0
    const tarifaFinal = tarifaNum > 0 ? tarifaNum : (parseFloat(tarifaAplicada) || 0);
    
    if (tarifaNum > 0 && String(tarifaNum) !== tarifaAplicada) {
       setTarifaAplicada(String(tarifaNum));
    }

    const toneladas = kilosNum / 1000;
    const imp = kmsNum * toneladas * tarifaFinal;
    const com = imp * 0.08;
    const net = imp - com;
    const iva = net * 0.21;
    
    const varNum = parseFloat(varios) || 0;
    const adelantosNum = parseFloat(adelantosConsumidos) || 0;
    const sal = (imp + iva) - varNum - adelantosNum;

    if (imp > 0) {
      setImporte(imp.toFixed(2));
      setComision8(com.toFixed(2));
      setNeto(net.toFixed(2));
      setIva21(iva.toFixed(2));
      setRentabilidad(com.toFixed(2));
      setSaldo(sal.toFixed(2));
    } else if (!kilos && !kms) {
      // Limpiar si están vacíos
      setImporte(''); setComision8(''); setNeto(''); setIva21(''); setRentabilidad(''); setSaldo('');
    }
    
  }, [clienteId, kms, kilos, varios, adelantosConsumidos, tarifas, isOpen]);


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clienteId || !transportistaId) {
      setError("Debe seleccionar un cliente y un transportista.");
      return;
    }

    setIsSubmitting(true);

    try {
      await cargarViaje(
        {
          ordenante,
          fecha: new Date(fecha).toISOString(),
          propio_tercero: propioTercero,
          chofer,
          carta_porte: cartaPorte,
          mercaderia,
          lugar_desde: lugarDesde,
          lugar_hasta: lugarHasta,
          prov_origen: provOrigen || undefined,
          prov_destino: provDestino || undefined,
          kms: parseFloat(kms) || 0,
          kilos: parseFloat(kilos) || 0,
          cubicaje: parseFloat(cubicaje) || 0,
          condicion,
          varios: parseFloat(varios) || 0,
          comentario: comentario || undefined,
          observaciones: observaciones || undefined,
          // Nuevos campos
          tarifa_aplicada: parseFloat(tarifaAplicada) || undefined,
          importe: parseFloat(importe) || undefined,
          comision_8: parseFloat(comision8) || undefined,
          neto: parseFloat(neto) || undefined,
          iva_21: parseFloat(iva21) || undefined,
          adelantos_consumidos: parseFloat(adelantosConsumidos) || undefined,
          saldo: parseFloat(saldo) || undefined,
          rentabilidad: parseFloat(rentabilidad) || undefined,
          orden_pago: ordenPago || undefined,
          factura_gavem: facturaGavem || undefined,
          imp_fact_gavem: parseFloat(impFactGavem) || undefined,
          nro_fc_transportista: nroFcTransportista || undefined,
          imp_fact_transportista: parseFloat(impFactTransportista) || undefined,
        },
        parseInt(clienteId),
        parseInt(transportistaId)
      );
      
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          const msgs = detail.map((d: any) => `${d.loc.join(' > ')}: ${d.msg}`).join(', ');
          setError(`Validación falló: ${msgs}`);
        } else {
          setError(detail);
        }
      } else {
        setError('Ocurrió un error inesperado al guardar el viaje.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl my-8 relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-3">
              Ord #{ordenante}
            </span>
            Carga de Nuevo Viaje
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
            ) : 'Registrar Viaje'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViajeModal;

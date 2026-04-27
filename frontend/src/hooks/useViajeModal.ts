import { useState, useEffect } from 'react';
import { cargarViaje, actualizarViaje, getClientes, getTransportistas, getViajes, getTarifas } from '../services/api';

interface UseViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  viajeAEditar?: any;
}

export const useViajeModal = ({ isOpen, onClose, onSuccess, viajeAEditar }: UseViajeModalProps) => {
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
  const [dominioCamion, setDominioCamion] = useState('');
  const [dominioAcoplado, setDominioAcoplado] = useState('');

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

  // Efecto principal: carga datos de referencia y resetea/rellena el formulario
  useEffect(() => {
    if (!isOpen) return;
    cargarDatosIniciales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Efecto secundario: cuando cambia viajeAEditar mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    if (viajeAEditar) {
      poblarFormulario(viajeAEditar);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viajeAEditar]);

  const cargarDatosIniciales = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargamos clientes, transportistas y tarifas de forma independiente
      // para que un fallo en uno no bloquee los demás
      const [resClientes, resTransportistas, resTarifas] = await Promise.allSettled([
        getClientes(),
        getTransportistas(),
        getTarifas(),
      ]);

      if (resClientes.status === 'fulfilled') setClientes(resClientes.value);
      else console.error('Error cargando clientes:', resClientes.reason);

      if (resTransportistas.status === 'fulfilled') setTransportistas(resTransportistas.value);
      else console.error('Error cargando transportistas:', resTransportistas.reason);

      if (resTarifas.status === 'fulfilled') setTarifas(resTarifas.value);
      else console.error('Error cargando tarifas:', resTarifas.reason);

      if (viajeAEditar) {
        poblarFormulario(viajeAEditar);
      } else {
        // Calcular el próximo ordenante
        try {
          const resViajes = await getViajes();
          const nextOrdenante = resViajes.length > 0
            ? Math.max(...resViajes.map((v: any) => parseInt(v.ordenante) || 0)) + 1
            : 1;
          setOrdenante(nextOrdenante.toString());
        } catch {
          setOrdenante('1');
        }
        resetFormulario();
      }
    } catch (err) {
      console.error('Error general cargando datos:', err);
      setError('Error al conectar con el servidor. Verifique que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  const poblarFormulario = (viaje: any) => {
    setOrdenante(viaje.ordenante);
    setClienteId(String(viaje.cliente_id));
    setTransportistaId(String(viaje.transportista_id));
    setPropioTercero(viaje.propio_tercero || 'Tercero');
    setChofer(viaje.chofer || '');
    setCartaPorte(viaje.carta_porte || '');
    setMercaderia(viaje.mercaderia || '');
    setLugarDesde(viaje.lugar_desde || '');
    setLugarHasta(viaje.lugar_hasta || '');
    setProvOrigen(viaje.prov_origen || '');
    setProvDestino(viaje.prov_destino || '');
    setKms(String(viaje.kms || ''));
    setKilos(String(viaje.kilos || ''));
    setCubicaje(String(viaje.cubicaje || ''));
    setCondicion(viaje.condicion === 'UNO' ? '1' : (viaje.condicion === 'DOS' ? '2' : String(viaje.condicion)));
    setVarios(String(viaje.varios || ''));
    setComentario(viaje.comentario || '');
    setObservaciones(viaje.observaciones || '');
    setFecha(new Date(viaje.fecha).toISOString().split('T')[0]);
    setDominioCamion(viaje.dominio_camion || '');
    setDominioAcoplado(viaje.dominio_acoplado || '');
    setTarifaAplicada(String(viaje.tarifa_aplicada || ''));
    setImporte(String(viaje.importe || ''));
    setComision8(String(viaje.comision_8 || ''));
    setNeto(String(viaje.neto || ''));
    setIva21(String(viaje.iva_21 || ''));
    setAdelantosConsumidos(String(viaje.adelantos_consumidos || ''));
    setSaldo(String(viaje.saldo || ''));
    setRentabilidad(String(viaje.rentabilidad || ''));
    setOrdenPago(viaje.orden_pago || '');
    setFacturaGavem(viaje.factura_gavem || '');
    setImpFactGavem(String(viaje.imp_fact_gavem || ''));
    setNroFcTransportista(viaje.nro_fc_transportista || '');
    setImpFactTransportista(String(viaje.imp_fact_transportista || ''));
  };

  const resetFormulario = () => {
    setClienteId(''); setTransportistaId(''); setPropioTercero('Tercero'); setChofer('');
    setCartaPorte(''); setMercaderia(''); setLugarDesde(''); setLugarHasta('');
    setProvOrigen(''); setProvDestino(''); setKms(''); setKilos(''); setCubicaje('');
    setCondicion('1'); setVarios(''); setComentario(''); setObservaciones('');
    setFecha(new Date().toISOString().split('T')[0]);
    setDominioCamion(''); setDominioAcoplado('');
    setTarifaAplicada(''); setImporte(''); setComision8(''); setNeto(''); setIva21('');
    setAdelantosConsumidos(''); setSaldo(''); setRentabilidad('');
    setOrdenPago(''); setFacturaGavem(''); setImpFactGavem(''); setNroFcTransportista(''); setImpFactTransportista('');
  };

  useEffect(() => {
    if (!isOpen || !clienteId) return;

    const tarifaObj = tarifas.find(t => String(t.cliente_id) === String(clienteId));
    if (tarifaObj) {
      setTarifaAplicada(String(tarifaObj.precio_km_ton));
    }
  }, [clienteId, tarifas, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const kmsNum = parseFloat(kms) || 0;
    const kilosNum = parseFloat(kilos) || 0;
    const tarifaFinal = parseFloat(tarifaAplicada) || 0;

    const toneladas = kilosNum / 1000;
    const imp = kmsNum * toneladas * tarifaFinal;
    const com = imp * 0.08;
    const net = imp - com;
    const iva = net * 0.21;

    const varNum = parseFloat(varios) || 0;
    const adelantosNum = parseFloat(adelantosConsumidos) || 0;
    const sal = (imp + iva) - varNum - adelantosNum;

    if (kmsNum > 0 || kilosNum > 0 || tarifaFinal > 0) {
      setImporte(imp.toFixed(2));
      setComision8(com.toFixed(2));
      setNeto(net.toFixed(2));
      setIva21(iva.toFixed(2));
      setRentabilidad(com.toFixed(2));
      setSaldo(sal.toFixed(2));
    } else if (!kilos && !kms && !tarifaAplicada) {
      setImporte(''); setComision8(''); setNeto(''); setIva21(''); setRentabilidad(''); setSaldo('');
    }

  }, [kms, kilos, tarifaAplicada, varios, adelantosConsumidos, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clienteId || !transportistaId) {
      setError("Debe seleccionar un cliente y un transportista.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payloadData = {
          ordenante, fecha: new Date(fecha).toISOString(), propio_tercero: propioTercero,
          chofer, carta_porte: cartaPorte, mercaderia,
          dominio_camion: dominioCamion || undefined,
          dominio_acoplado: dominioAcoplado || undefined,
          lugar_desde: lugarDesde, lugar_hasta: lugarHasta,
          prov_origen: provOrigen || undefined, prov_destino: provDestino || undefined,
          kms: parseFloat(kms) || 0, kilos: parseFloat(kilos) || 0,
          cubicaje: parseFloat(cubicaje) || 0, condicion,
          varios: parseFloat(varios) || 0, comentario: comentario || undefined,
          observaciones: observaciones || undefined,
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
          cliente_id: parseInt(clienteId),
          transportista_id: parseInt(transportistaId)
      };

      if (viajeAEditar) {
        await actualizarViaje(viajeAEditar.id, payloadData);
      } else {
        await cargarViaje(payloadData, parseInt(clienteId), parseInt(transportistaId));
      }

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

  return {
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
    dominioCamion, setDominioCamion, dominioAcoplado, setDominioAcoplado,
    error, isSubmitting, isLoading, handleSubmit
  };
};

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
  }, [isOpen, viajeAEditar]);

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

      if (viajeAEditar) {
        setOrdenante(viajeAEditar.ordenante);
        setClienteId(String(viajeAEditar.cliente_id));
        setTransportistaId(String(viajeAEditar.transportista_id));
        setPropioTercero(viajeAEditar.propio_tercero || 'Tercero');
        setChofer(viajeAEditar.chofer || '');
        setCartaPorte(viajeAEditar.carta_porte || '');
        setMercaderia(viajeAEditar.mercaderia || '');
        setLugarDesde(viajeAEditar.lugar_desde || '');
        setLugarHasta(viajeAEditar.lugar_hasta || '');
        setProvOrigen(viajeAEditar.prov_origen || '');
        setProvDestino(viajeAEditar.prov_destino || '');
        setKms(String(viajeAEditar.kms || ''));
        setKilos(String(viajeAEditar.kilos || ''));
        setCubicaje(String(viajeAEditar.cubicaje || ''));
        setCondicion(viajeAEditar.condicion === 'UNO' ? '1' : (viajeAEditar.condicion === 'DOS' ? '2' : String(viajeAEditar.condicion)));
        setVarios(String(viajeAEditar.varios || ''));
        setComentario(viajeAEditar.comentario || '');
        setObservaciones(viajeAEditar.observaciones || '');
        setFecha(new Date(viajeAEditar.fecha).toISOString().split('T')[0]);

        setTarifaAplicada(String(viajeAEditar.tarifa_aplicada || ''));
        setImporte(String(viajeAEditar.importe || ''));
        setComision8(String(viajeAEditar.comision_8 || ''));
        setNeto(String(viajeAEditar.neto || ''));
        setIva21(String(viajeAEditar.iva_21 || ''));
        setAdelantosConsumidos(String(viajeAEditar.adelantos_consumidos || ''));
        setSaldo(String(viajeAEditar.saldo || ''));
        setRentabilidad(String(viajeAEditar.rentabilidad || ''));

        setOrdenPago(viajeAEditar.orden_pago || '');
        setFacturaGavem(viajeAEditar.factura_gavem || '');
        setImpFactGavem(String(viajeAEditar.imp_fact_gavem || ''));
        setNroFcTransportista(viajeAEditar.nro_fc_transportista || '');
        setImpFactTransportista(String(viajeAEditar.imp_fact_transportista || ''));
      } else {
        // Auto-calculate ordenante
        const nextOrdenante = resViajes.length > 0 ? Math.max(...resViajes.map((v: any) => parseInt(v.ordenante) || 0)) + 1 : 1;
        setOrdenante(nextOrdenante.toString());

        // Reset form
        setClienteId(''); setTransportistaId(''); setPropioTercero('Tercero'); setChofer('');
        setCartaPorte(''); setMercaderia(''); setLugarDesde(''); setLugarHasta('');
        setProvOrigen(''); setProvDestino(''); setKms(''); setKilos(''); setCubicaje('');
        setCondicion('1'); setVarios(''); setComentario(''); setObservaciones('');
        setFecha(new Date().toISOString().split('T')[0]);

        setTarifaAplicada(''); setImporte(''); setComision8(''); setNeto(''); setIva21('');
        setAdelantosConsumidos(''); setSaldo(''); setRentabilidad('');

        setOrdenPago(''); setFacturaGavem(''); setImpFactGavem(''); setNroFcTransportista(''); setImpFactTransportista('');
      }

      setError(null);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos necesarios para el formulario.");
    } finally {
      setIsLoading(false);
    }
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
    error, isSubmitting, isLoading, handleSubmit
  };
};

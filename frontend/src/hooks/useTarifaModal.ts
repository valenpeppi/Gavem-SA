import { useState, useEffect } from 'react';
import { crearTarifa, getClientes } from '../services/api';

interface UseTarifaModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const useTarifaModal = ({ isOpen, onSuccess, onClose }: UseTarifaModalProps) => {
  const [clientes, setClientes] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState('');
  const [precioKmTon, setPrecioKmTon] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarClientes();
      setClienteId('');
      setPrecioKmTon('');
      setFechaDesde('');
      setFechaHasta('');
      setError(null);
    }
  }, [isOpen]);

  const cargarClientes = async () => {
    setIsLoading(true);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError("Error al cargar la lista de clientes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await crearTarifa({
        cliente_id: parseInt(clienteId),
        precio_km_ton: parseFloat(precioKmTon),
        fecha_desde: new Date(fechaDesde).toISOString(),
        fecha_hasta: new Date(fechaHasta).toISOString()
      });

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
        setError('Ocurrió un error inesperado al guardar la tarifa.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clientes,
    clienteId, setClienteId,
    precioKmTon, setPrecioKmTon,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    error,
    isSubmitting,
    isLoading,
    handleSubmit
  };
};

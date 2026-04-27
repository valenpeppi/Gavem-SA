import { useState, useEffect } from 'react';
import { getTransportistas, getViajes, crearAdelanto } from '../services/api';

interface UseAdelantoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const useAdelantoModal = ({ isOpen, onClose, onSuccess }: UseAdelantoModalProps) => {
  const [transportistas, setTransportistas] = useState<any[]>([]);
  const [viajes, setViajes] = useState<any[]>([]);

  // Campos requeridos
  const [transportistaId, setTransportistaId] = useState('');
  const [tipo, setTipo] = useState('Vale Combustible');
  const [montoTotal, setMontoTotal] = useState('');

  // Campos opcionales
  const [viajeId, setViajeId] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [resTransportistas, resViajes] = await Promise.allSettled([
            getTransportistas(),
            getViajes(),
          ]);

          if (resTransportistas.status === 'fulfilled') setTransportistas(resTransportistas.value);
          else console.error('Error cargando transportistas:', resTransportistas.reason);

          if (resViajes.status === 'fulfilled')
            setViajes(resViajes.value.sort((a: any, b: any) => b.id - a.id));
          else console.error('Error cargando viajes:', resViajes.reason);

        } catch (err) {
          setError('Error al conectar con el servidor.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      // Reset al cerrar
      setTransportistaId('');
      setTipo('Vale Combustible');
      setMontoTotal('');
      setViajeId('');
      setObservaciones('');
      setError(null);
    }
  }, [isOpen]);

  // Viajes filtrados según el transportista seleccionado
  const viajesFiltrados = transportistaId
    ? viajes.filter((v: any) => String(v.transportista_id) === String(transportistaId))
    : viajes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!transportistaId) {
      setError('Debe seleccionar un transportista.');
      setIsSubmitting(false);
      return;
    }
    if (!montoTotal || parseFloat(montoTotal) <= 0) {
      setError('Debe ingresar un importe válido.');
      setIsSubmitting(false);
      return;
    }

    // Validar que el viaje seleccionado pertenezca al transportista
    if (viajeId) {
      const viajeSeleccionado = viajes.find((v: any) => String(v.id) === String(viajeId));
      if (viajeSeleccionado && String(viajeSeleccionado.transportista_id) !== String(transportistaId)) {
        setError('El viaje seleccionado no corresponde al transportista elegido.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await crearAdelanto({
        tipo,
        monto_total: parseFloat(montoTotal),
        observaciones: observaciones || null,
        transportista_id: parseInt(transportistaId),
        viaje_id: viajeId ? parseInt(viajeId) : null,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    transportistas,
    viajes,
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
  };
};

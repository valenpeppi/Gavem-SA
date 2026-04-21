import { useState, useEffect } from 'react';

interface UseAdelantoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const useAdelantoModal = ({ isOpen, onClose, onSuccess }: UseAdelantoModalProps) => {
  const [viajes, setViajes] = useState<any[]>([]);
  const [viajeId, setViajeId] = useState('');
  const [tipo, setTipo] = useState('Vale Combustible');
  const [montoTotal, setMontoTotal] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('http://localhost:8000/viajes/');
          const data = await res.json();
          setViajes(data.sort((a: any, b: any) => b.id - a.id));
        } catch (err) {
          setError('Error al cargar los viajes.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setViajeId('');
      setTipo('Vale Combustible');
      setMontoTotal('');
      setObservaciones('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedViaje = viajes.find(v => v.id.toString() === viajeId);
      if (!selectedViaje) {
        throw new Error('Debe seleccionar un viaje válido');
      }

      const payload = {
        tipo,
        monto_total: parseFloat(montoTotal),
        observaciones: observaciones || null,
        viaje_id: parseInt(viajeId),
        transportista_id: selectedViaje.transportista_id
      };

      const res = await fetch('http://localhost:8000/adelantos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Error al registrar el adelanto');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    viajes,
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

import { useState } from 'react';
import { crearCliente } from '../services/api';

interface UseClienteModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const useClienteModal = ({ onSuccess, onClose }: UseClienteModalProps) => {
  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;
    if (!cuitRegex.test(cuit)) {
      setError('El CUIT debe tener 11 dígitos numéricos (ej. 30-12345678-9 o 30123456789).');
      return;
    }

    setIsSubmitting(true);

    try {
      await crearCliente({ nombre, cuit });
      setNombre('');
      setCuit('');
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ocurrió un error inesperado al guardar el cliente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    nombre, setNombre,
    cuit, setCuit,
    error,
    isSubmitting,
    handleSubmit
  };
};

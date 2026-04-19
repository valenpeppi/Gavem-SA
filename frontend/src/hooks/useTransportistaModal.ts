import { useState } from 'react';
import { crearTransportista } from '../services/api';

interface UseTransportistaModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const useTransportistaModal = ({ onSuccess, onClose }: UseTransportistaModalProps) => {
  const [codTrans, setCodTrans] = useState('');
  const [nomTrans, setNomTrans] = useState('');
  const [cuitTrans, setCuitTrans] = useState('');
  const [telTrans, setTelTrans] = useState('');
  const [calleTrans, setCalleTrans] = useState('');
  const [nroCalleTrans, setNroCalleTrans] = useState('');
  const [cp, setCp] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [provincia, setProvincia] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await crearTransportista({
        codTrans: parseInt(codTrans),
        nomTrans,
        cuitTrans,
        telTrans,
        calleTrans,
        nroCalleTrans,
        cp,
        localidad,
        provincia
      });
      
      setCodTrans('');
      setNomTrans('');
      setCuitTrans('');
      setTelTrans('');
      setCalleTrans('');
      setNroCalleTrans('');
      setCp('');
      setLocalidad('');
      setProvincia('');

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ocurrió un error inesperado al guardar el transportista.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    codTrans, setCodTrans,
    nomTrans, setNomTrans,
    cuitTrans, setCuitTrans,
    telTrans, setTelTrans,
    calleTrans, setCalleTrans,
    nroCalleTrans, setNroCalleTrans,
    cp, setCp,
    localidad, setLocalidad,
    provincia, setProvincia,
    error,
    isSubmitting,
    handleSubmit
  };
};

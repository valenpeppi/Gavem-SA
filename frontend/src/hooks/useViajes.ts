import { useState, useCallback, useEffect } from 'react';
import { getViajes } from '../services/api';

export const useViajes = () => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchViajes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getViajes();
      setViajes(data);
    } catch (error) {
      console.error("Error al obtener viajes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  return {
    viajes,
    loading,
    fetchViajes
  };
};

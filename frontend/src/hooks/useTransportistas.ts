import { useState, useCallback, useEffect } from 'react';
import { getTransportistas } from '../services/api';

export const useTransportistas = () => {
  const [transportistas, setTransportistas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransportistas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransportistas();
      setTransportistas(data);
    } catch (error) {
      console.error("Error al obtener transportistas", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransportistas();
  }, [fetchTransportistas]);

  return {
    transportistas,
    loading,
    fetchTransportistas
  };
};

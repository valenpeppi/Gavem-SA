import { useState, useCallback, useEffect } from 'react';
import { getAdelantos } from '../services/api';

export const useAdelantos = () => {
  const [adelantos, setAdelantos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdelantos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdelantos();
      setAdelantos(data);
    } catch (error) {
      console.error('Error al obtener adelantos', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdelantos();
  }, [fetchAdelantos]);

  return {
    adelantos,
    loading,
    fetchAdelantos
  };
};

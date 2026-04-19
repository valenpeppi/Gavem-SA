import { useState, useCallback, useEffect } from 'react';

export const useAdelantos = () => {
  const [adelantos, setAdelantos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdelantos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/adelantos/');
      const data = await res.json();
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

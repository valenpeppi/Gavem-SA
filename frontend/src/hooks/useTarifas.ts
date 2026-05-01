import { useState, useCallback, useEffect } from 'react';
import { getTarifas, getClientes } from '../services/api';

export const useTarifas = () => {
  const [tarifas, setTarifas] = useState<any[]>([]);
  const [clientesMap, setClientesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [resTarifas, resClientes] = await Promise.all([
        getTarifas(),
        getClientes()
      ]);
      
      const map: Record<string, string> = {};
      resClientes.forEach((c: any) => {
        map[String(c.id)] = c.nombre;
      });
      setClientesMap(map);
      setTarifas(resTarifas);
    } catch (error) {
      console.error("Error al obtener datos", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  return {
    tarifas,
    clientesMap,
    loading,
    fetchDatos
  };
};

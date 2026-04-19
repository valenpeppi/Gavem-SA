import { useEffect, useState, useCallback } from 'react';
import { getTarifas, getClientes } from '../services/api';
import DataTable from '../components/DataTable/DataTable';
import TarifaModal from '../components/TarifaModal/TarifaModal';

const TarifasPage = () => {
  const [tarifas, setTarifas] = useState<any[]>([]);
  const [clientesMap, setClientesMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { 
      header: 'Cliente', 
      accessorKey: 'cliente_id',
      cell: (row: any) => <span className="font-medium text-gray-800">{clientesMap[String(row.cliente_id)] || 'Desconocido'}</span>
    },
    { 
      header: 'Precio KM-TON', 
      accessorKey: 'precio_km_ton',
      cell: (row: any) => <span className="font-bold text-blue-600">${row.precio_km_ton}</span>
    },
    { 
      header: 'Vigencia Desde', 
      accessorKey: 'fecha_desde',
      cell: (row: any) => new Date(row.fecha_desde).toLocaleDateString()
    },
    { 
      header: 'Vigencia Hasta', 
      accessorKey: 'fecha_hasta',
      cell: (row: any) => new Date(row.fecha_hasta).toLocaleDateString()
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tarifas de Clientes</h2>
          <p className="text-gray-500 text-sm mt-1">Gestión de precios vigentes por trayecto para cada cliente.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
          + Nueva Tarifa
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable data={tarifas} columns={columns} isLoading={loading} />
      </div>

      <TarifaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDatos} 
      />
    </div>
  );
};

export default TarifasPage;

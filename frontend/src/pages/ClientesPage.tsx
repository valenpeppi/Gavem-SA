import { useEffect, useState, useCallback } from 'react';
import { getClientes } from '../services/api';
import DataTable from '../components/DataTable';
import ClienteModal from '../components/ClienteModal';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'CUIT', accessorKey: 'cuit' },
    { 
      header: 'Estado', 
      accessorKey: 'activo',
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Listado de Clientes</h2>
          <p className="text-gray-500 text-sm mt-1">Gestioná los clientes que ordenan los viajes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Nuevo Cliente
        </button>
      </div>

      <DataTable data={clientes} columns={columns} isLoading={loading} />

      <ClienteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchClientes} 
      />
    </div>
  );
};

export default ClientesPage;

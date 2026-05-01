import { useState, useMemo } from 'react';
import { useClientes } from '../hooks/useClientes';
import DataTable from '../components/DataTable/DataTable';
import ClienteModal from '../components/ClienteModal/ClienteModal';

const ClientesPage = () => {
  const { clientes, loading, fetchClientes } = useClientes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const clientesFiltrados = useMemo(() => {
    if (!clientes) return [];
    if (!busqueda) return clientes;
    const b = busqueda.toLowerCase();
    return clientes.filter((c: any) => 
      c.id.toString().includes(b) || 
      c.nombre.toLowerCase().includes(b) ||
      c.cuit.includes(b)
    );
  }, [clientes, busqueda]);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'CUIT', accessorKey: 'cuit' },
    { 
      header: 'Estado', 
      accessorKey: 'activo',
      cell: (row: any) => (
        <span className={row.activo ? 'badge-active' : 'badge-inactive'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Listado de Clientes</h2>
          <p className="page-subtitle">Gestioná los clientes que ordenan los viajes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-add"
        >
          + Nuevo Cliente
        </button>
      </div>

      <div className="page-content">
        <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar por ID, nombre o CUIT..." 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="ml-4 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>

        <DataTable data={clientesFiltrados} columns={columns} isLoading={loading} />
        
        {!loading && clientesFiltrados.length === 0 && clientes.length > 0 && (
          <div className="text-center py-10 bg-white border border-gray-100 rounded-xl mt-4">
            <p className="text-gray-500">No se encontraron clientes que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      <ClienteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchClientes} 
      />
    </div>
  );
};

export default ClientesPage;

import { useState, useMemo } from 'react';
import { useTransportistas } from '../hooks/useTransportistas';
import DataTable from '../components/DataTable/DataTable';
import TransportistaModal from '../components/TransportistaModal/TransportistaModal';

const TransportistasPage = () => {
  const { transportistas, loading, fetchTransportistas } = useTransportistas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const transportistasFiltrados = useMemo(() => {
    if (!transportistas) return [];
    if (!busqueda) return transportistas;
    const b = busqueda.toLowerCase();
    return transportistas.filter((t: any) => 
      t.id.toString().includes(b) || 
      t.nomTrans.toLowerCase().includes(b) ||
      t.cuitTrans.includes(b) ||
      (t.codTrans && t.codTrans.toString().includes(b))
    );
  }, [transportistas, busqueda]);

  const columns = [
    { header: 'Cod. Int.', accessorKey: 'codTrans' },
    { header: 'Nombre', accessorKey: 'nomTrans' },
    { header: 'CUIT', accessorKey: 'cuitTrans' },
    { header: 'Teléfono', accessorKey: 'telTrans' },
    { header: 'Calle', accessorKey: 'calleTrans' },
    { header: 'Número', accessorKey: 'nroCalleTrans' },
    { header: 'CP', accessorKey: 'cp' },
    { header: 'Localidad', accessorKey: 'localidad' },
    { header: 'Provincia', accessorKey: 'provincia' },
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
          <h2 className="page-title">Listado de Transportistas</h2>
          <p className="page-subtitle">Choferes y dueños de camiones registrados.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-add"
        >
          + Nuevo Transportista
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
              placeholder="Buscar por ID, Código, nombre o CUIT..." 
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

        <DataTable data={transportistasFiltrados} columns={columns} isLoading={loading} />
        
        {!loading && transportistasFiltrados.length === 0 && transportistas.length > 0 && (
          <div className="text-center py-10 bg-white border border-gray-100 rounded-xl mt-4">
            <p className="text-gray-500">No se encontraron transportistas que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      <TransportistaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTransportistas} 
      />
    </div>
  );
};

export default TransportistasPage;

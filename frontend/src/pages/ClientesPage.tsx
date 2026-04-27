import { useState } from 'react';
import { useClientes } from '../hooks/useClientes';
import DataTable from '../components/DataTable/DataTable';
import ClienteModal from '../components/ClienteModal/ClienteModal';

const ClientesPage = () => {
  const { clientes, loading, fetchClientes } = useClientes();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <DataTable data={clientes} columns={columns} isLoading={loading} />
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

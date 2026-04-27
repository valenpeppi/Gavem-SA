import { useState } from 'react';
import { useTransportistas } from '../hooks/useTransportistas';
import DataTable from '../components/DataTable/DataTable';
import TransportistaModal from '../components/TransportistaModal/TransportistaModal';

const TransportistasPage = () => {
  const { transportistas, loading, fetchTransportistas } = useTransportistas();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <DataTable data={transportistas} columns={columns} isLoading={loading} />
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

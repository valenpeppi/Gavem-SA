import { useState } from 'react';
import { useTarifas } from '../hooks/useTarifas';
import DataTable from '../components/DataTable/DataTable';
import TarifaModal from '../components/TarifaModal/TarifaModal';

const TarifasPage = () => {
  const { tarifas, clientesMap, loading, fetchDatos } = useTarifas();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Tarifas de Clientes</h2>
          <p className="page-subtitle">Gestión de precios vigentes por trayecto para cada cliente.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-add"
        >
          + Nueva Tarifa
        </button>
      </div>

      <div className="page-content">
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

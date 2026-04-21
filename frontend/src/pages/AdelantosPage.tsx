import { useState } from 'react';
import { useAdelantos } from '../hooks/useAdelantos';
import DataTable from '../components/DataTable/DataTable';
import AdelantoModal from '../components/AdelantoModal/AdelantoModal';

const AdelantosPage = () => {
  const { adelantos, loading, fetchAdelantos } = useAdelantos();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nro. Vale', accessorKey: 'nro_vale', cell: (row: any) => <span className="font-bold text-gray-700">{row.nro_vale}</span> },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.tipo === 'Vale Combustible' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
          {row.tipo}
        </span>
      ),
    },
    {
      header: 'Monto',
      accessorKey: 'monto_total',
      cell: (row: any) => <span className="font-bold text-blue-600">${row.monto_total}</span>,
    },
    {
      header: 'Fecha Emisión',
      accessorKey: 'fecha_emision',
      cell: (row: any) => new Date(row.fecha_emision).toLocaleDateString(),
    },
    { header: 'Viaje ID', accessorKey: 'viaje_id' },
    { header: 'Observaciones', accessorKey: 'observaciones' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Adelantos</h2>
          <p className="text-gray-500 text-sm mt-1">Vales de combustible y efectivo emitidos a transportistas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
          + Nuevo Adelanto
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable data={adelantos} columns={columns} isLoading={loading} />
      </div>

      <AdelantoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAdelantos} 
      />
    </div>
  );
};

export default AdelantosPage;

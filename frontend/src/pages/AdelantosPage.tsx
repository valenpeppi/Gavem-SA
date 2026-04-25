import { useState } from 'react';
import { useAdelantos } from '../hooks/useAdelantos';
import DataTable from '../components/DataTable/DataTable';
import AdelantoModal from '../components/AdelantoModal/AdelantoModal';
import AsignarViajeModal from '../components/AsignarViajeModal/AsignarViajeModal';

const AdelantosPage = () => {
  const { adelantos, loading, fetchAdelantos } = useAdelantos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adelantoAAsignar, setAdelantoAAsignar] = useState<any>(null);

  const columns = [
    {
      header: 'Nro. Vale',
      accessorKey: 'nro_vale',
      cell: (row: any) => <span className="font-bold font-mono text-gray-700">{row.nro_vale}</span>,
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.tipo === 'Vale Combustible' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
        }`}>
          {row.tipo}
        </span>
      ),
    },
    {
      header: 'Monto',
      accessorKey: 'monto_total',
      cell: (row: any) => (
        <span className="font-bold text-blue-600">
          ${parseFloat(row.monto_total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Fecha Emisión',
      accessorKey: 'fecha_emision',
      cell: (row: any) => new Date(row.fecha_emision).toLocaleDateString('es-AR'),
    },
    {
      header: 'Viaje Asignado',
      accessorKey: 'viaje_id',
      cell: (row: any) =>
        row.viaje_id ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-mono text-xs">
            Viaje #{row.viaje_id}
          </span>
        ) : (
          <span className="text-gray-400 text-xs italic">Sin asignar</span>
        ),
    },
    { header: 'Observaciones', accessorKey: 'observaciones' },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell: (row: any) =>
        !row.viaje_id ? (
          <button
            title="Asignar a un viaje"
            onClick={() => setAdelantoAAsignar(row)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Asignar viaje
          </button>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
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

      <AsignarViajeModal
        isOpen={!!adelantoAAsignar}
        onClose={() => setAdelantoAAsignar(null)}
        onSuccess={fetchAdelantos}
        adelanto={adelantoAAsignar}
      />
    </div>
  );
};

export default AdelantosPage;

import { useState } from 'react';
import { useViajes } from '../hooks/useViajes';
import DataTable from '../components/DataTable/DataTable';
import ViajeModal from '../components/ViajeModal/ViajeModal';

const ViajesPage = () => {
  const { viajes, loading, fetchViajes } = useViajes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Ord.', accessorKey: 'ordenante' },
    { header: 'Fecha', accessorKey: 'fecha', cell: (row: any) => new Date(row.fecha).toLocaleDateString() },
    { header: 'Propio/Tercero', accessorKey: 'propio_tercero' },
    { header: 'Chofer', accessorKey: 'chofer' },
    { header: 'Carta Porte', accessorKey: 'carta_porte' },
    { header: 'Mercadería', accessorKey: 'mercaderia' },
    { header: 'Origen', accessorKey: 'lugar_desde' },
    { header: 'Destino', accessorKey: 'lugar_hasta' },
    { header: 'Prov. Origen', accessorKey: 'prov_origen' },
    { header: 'Prov. Destino', accessorKey: 'prov_destino' },
    { header: 'Kms', accessorKey: 'kms' },
    { header: 'Kilos', accessorKey: 'kilos' },
    { header: 'Cubicaje', accessorKey: 'cubicaje' },
    { header: 'Condición', accessorKey: 'condicion' },
    { header: 'Tarifa', accessorKey: 'tarifa_aplicada', cell: (row: any) => `$${row.tarifa_aplicada}` },
    { header: 'Importe', accessorKey: 'importe', cell: (row: any) => `$${row.importe}` },
    { header: 'Comisión 8%', accessorKey: 'comision_8', cell: (row: any) => `$${row.comision_8}` },
    { header: 'Neto', accessorKey: 'neto', cell: (row: any) => `$${row.neto}` },
    { header: 'IVA 21%', accessorKey: 'iva_21', cell: (row: any) => `$${row.iva_21}` },
    { header: 'Varios', accessorKey: 'varios', cell: (row: any) => `$${row.varios}` },
    { header: 'Adelantos', accessorKey: 'adelantos_consumidos', cell: (row: any) => `$${row.adelantos_consumidos}` },
    { header: 'Saldo', accessorKey: 'saldo', cell: (row: any) => <span className="font-bold text-blue-600">${row.saldo}</span> },
    { header: 'Comentario', accessorKey: 'comentario' },
    { header: 'Observaciones', accessorKey: 'observaciones' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Listado de Viajes</h2>
          <p className="text-gray-500 text-sm mt-1">Gestión operativa y financiera de todos los viajes cargados.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
          + Nuevo Viaje
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable data={viajes} columns={columns} isLoading={loading} />
      </div>

      <ViajeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchViajes} 
      />
    </div>
  );
};

export default ViajesPage;

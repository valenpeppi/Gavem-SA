import { useEffect, useState } from 'react';
import { getTransportistas } from '../services/api';
import DataTable from '../components/DataTable';

const TransportistasPage = () => {
  const [transportistas, setTransportistas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransportistas = async () => {
      try {
        const data = await getTransportistas();
        setTransportistas(data);
      } catch (error) {
        console.error("Error al obtener transportistas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransportistas();
  }, []);

  const columns = [
    { header: 'Cod. Int.', accessorKey: 'codTrans' },
    { header: 'Nombre', accessorKey: 'nomTrans' },
    { header: 'CUIT', accessorKey: 'cuitTrans' },
    { header: 'Teléfono', accessorKey: 'telTrans' },
    { header: 'Localidad', accessorKey: 'localidad' },
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
          <h2 className="text-2xl font-bold text-gray-800">Listado de Transportistas</h2>
          <p className="text-gray-500 text-sm mt-1">Choferes y dueños de camiones registrados.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          + Nuevo Transportista
        </button>
      </div>

      <DataTable data={transportistas} columns={columns} isLoading={loading} />
    </div>
  );
};

export default TransportistasPage;

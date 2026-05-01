import { useState, useEffect, useMemo } from 'react';
import { useViajes } from '../hooks/useViajes';
import { getClientes, getTransportistas } from '../services/api';
import DataTable from '../components/DataTable/DataTable';
import ViajeModal from '../components/ViajeModal/ViajeModal';
import ViajeSummaryModal from '../components/ViajeSummaryModal/ViajeSummaryModal';
import HistorialModal from '../components/HistorialModal/HistorialModal';

const ViajesPage = () => {
  const { viajes, loading, fetchViajes, removeViaje } = useViajes();
  const [clientes, setClientes] = useState<any[]>([]);
  const [transportistas, setTransportistas] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viajeAEditar, setViajeAEditar] = useState<any>(null);
  const [viajeResumen, setViajeResumen] = useState<any>(null);
  const [viajeABorrar, setViajeABorrar] = useState<any>(null);
  const [viajeHistorial, setViajeHistorial] = useState<any>(null);
  const [isBorrando, setIsBorrando] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroTransportista, setFiltroTransportista] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    Promise.all([getClientes(), getTransportistas()])
      .then(([c, t]) => { setClientes(c); setTransportistas(t); })
      .catch(console.error);
  }, []);

  const handleEditar = (viaje: any) => {
    setViajeAEditar(viaje);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViajeAEditar(null);
  };

  const handleConfirmBorrar = async () => {
    if (!viajeABorrar) return;
    setIsBorrando(true);
    try {
      await removeViaje(viajeABorrar.id);
    } catch {
      alert('Error al borrar el viaje. Intente nuevamente.');
    } finally {
      setIsBorrando(false);
      setViajeABorrar(null);
    }
  };

  // Filtrado de viajes
  const viajesFiltrados = useMemo(() => {
    if (!viajes) return [];
    return viajes.filter((v: any) => {
      let coincide = true;
      
      // Filtro por Estado
      if (filtroEstado) {
        const obs = (v.observaciones || '').trim().toLowerCase();
        if (filtroEstado === 'sin_estado') {
           if (obs === 'pagado' || obs === 'liquidado' || obs === 'preliquidacion') coincide = false;
        } else {
           if (obs !== filtroEstado) coincide = false;
        }
      }

      // Filtro por Transportista
      if (coincide && filtroTransportista && v.transportista_id?.toString() !== filtroTransportista) {
        coincide = false;
      }

      // Filtro por Búsqueda Libre
      if (coincide && busqueda) {
        const b = busqueda.toLowerCase();
        const chofer = (v.chofer || '').toLowerCase();
        const cartaPorte = (v.carta_porte || '').toLowerCase();
        const lugarDesde = (v.lugar_desde || '').toLowerCase();
        const lugarHasta = (v.lugar_hasta || '').toLowerCase();
        const kms = (v.kms || '').toString();
        const kilos = (v.kilos || '').toString();
        const importe = (v.importe || '').toString();

        if (
          !chofer.includes(b) && 
          !cartaPorte.includes(b) && 
          !lugarDesde.includes(b) && 
          !lugarHasta.includes(b) &&
          !kms.includes(b) &&
          !kilos.includes(b) &&
          !importe.includes(b)
        ) {
          coincide = false;
        }
      }

      return coincide;
    });
  }, [viajes, filtroEstado, filtroTransportista, busqueda]);

  const columns = [
    { header: 'Ord.', accessorKey: 'ordenante' },
    { header: 'Fecha', accessorKey: 'fecha', cell: (row: any) => new Date(row.fecha).toLocaleDateString() },
    {
      header: 'Transportista',
      accessorKey: 'transportista_id',
      cell: (row: any) => {
        const t = transportistas.find((tr: any) => tr.id === row.transportista_id);
        return t ? t.nomTrans : `ID ${row.transportista_id}`;
      }
    },
    { header: 'Chofer', accessorKey: 'chofer' },
    { header: 'Carta Porte', accessorKey: 'carta_porte' },
    { header: 'Origen', accessorKey: 'lugar_desde' },
    { header: 'Destino', accessorKey: 'lugar_hasta' },
    { header: 'Kms', accessorKey: 'kms' },
    { header: 'Kilos', accessorKey: 'kilos', cell: (row: any) => Number(row.kilos).toLocaleString('es-AR') },
    { header: 'Importe', accessorKey: 'importe', cell: (row: any) => `$${parseFloat(row.importe).toLocaleString('es-AR')}` },
    { header: 'IVA 21%', accessorKey: 'iva_21', cell: (row: any) => `$${parseFloat(row.iva_21).toLocaleString('es-AR')}` },
    {
      header: 'Adelantos',
      accessorKey: 'adelantos_consumidos',
      cell: (row: any) => (
        <div>
          <span className="font-medium text-red-500">${parseFloat(row.adelantos_consumidos || 0).toLocaleString('es-AR')}</span>
          {row.adelantos && row.adelantos.length > 0 && (
            <div className="text-xs text-gray-400 mt-0.5">
              {row.adelantos.map((a: any) => a.nro_vale).join(', ')}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Saldo',
      accessorKey: 'saldo',
      cell: (row: any) => <span className="font-bold text-green-600">${parseFloat(row.saldo).toLocaleString('es-AR')}</span>
    },
    {
      header: 'Estado',
      accessorKey: 'observaciones',
      cell: (row: any) => {
        const obs = (row.observaciones || '').trim().toLowerCase();
        const badges: Record<string, string> = {
          'pagado': 'bg-green-100 text-green-700',
          'liquidado': 'bg-blue-100 text-blue-700',
          'preliquidacion': 'bg-yellow-100 text-yellow-700',
        };
        const labels: Record<string, string> = {
          'pagado': 'Pagado',
          'liquidado': 'Liquidado',
          'preliquidacion': 'Preliquidación',
        };
        return obs && badges[obs]
          ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badges[obs]}`}>{labels[obs]}</span>
          : <span className="text-gray-300 text-xs">—</span>;
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            title="Ver resumen"
            onClick={() => setViajeResumen(row)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            title="Ver historial de cambios"
            onClick={() => setViajeHistorial(row)}
            className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            title="Editar viaje"
            onClick={() => handleEditar(row)}
            className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            title="Borrar viaje"
            onClick={() => setViajeABorrar(row)}
            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Listado de Viajes</h2>
          <p className="page-subtitle">Gestión operativa y financiera de todos los viajes cargados.</p>
        </div>
        <button
          onClick={() => { setViajeAEditar(null); setIsModalOpen(true); }}
          className="btn-add"
        >
          + Nuevo Viaje
        </button>
      </div>

      <div className="page-content">
        <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          {/* Búsqueda */}
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar por chofer, carta porte, origen, destino, importe..." 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro Transportista */}
          <div className="w-full md:w-64">
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-shadow"
              value={filtroTransportista}
              onChange={(e) => setFiltroTransportista(e.target.value)}
            >
              <option value="">Todos los transportistas</option>
              {transportistas.map(t => (
                <option key={t.id} value={t.id}>{t.nomTrans}</option>
              ))}
            </select>
          </div>

          {/* Filtro Estado */}
          <div className="w-full md:w-48">
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-shadow"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pagado">Pagado</option>
              <option value="liquidado">Liquidado</option>
              <option value="preliquidacion">Preliquidación</option>
              <option value="sin_estado">Sin estado</option>
            </select>
          </div>
          
          {/* Botón limpiar */}
          {(busqueda || filtroTransportista || filtroEstado) && (
            <button
              onClick={() => { setBusqueda(''); setFiltroTransportista(''); setFiltroEstado(''); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <DataTable data={viajesFiltrados} columns={columns} isLoading={loading} />
        
        {!loading && viajesFiltrados.length === 0 && viajes.length > 0 && (
          <div className="text-center py-10 bg-white border border-gray-100 rounded-xl mt-4">
            <p className="text-gray-500">No se encontraron viajes que coincidan con los filtros aplicados.</p>
            <button 
              onClick={() => { setBusqueda(''); setFiltroTransportista(''); setFiltroEstado(''); }}
              className="mt-2 text-blue-600 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <ViajeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchViajes}
        viajeAEditar={viajeAEditar}
      />

      <ViajeSummaryModal
        isOpen={!!viajeResumen}
        onClose={() => setViajeResumen(null)}
        viaje={viajeResumen}
        transportistas={transportistas}
        clientes={clientes}
      />

      <HistorialModal
        isOpen={!!viajeHistorial}
        onClose={() => setViajeHistorial(null)}
        entidad="Viaje"
        entidadId={viajeHistorial?.id}
        entidadNombre={`Orden ${viajeHistorial?.ordenante}`}
      />

      {viajeABorrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">¿Borrar Viaje #{viajeABorrar.ordenante}?</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Esta acción es irreversible. Se eliminará el viaje y{' '}
                  <strong className="text-red-600">todos los adelantos asociados</strong> al mismo.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setViajeABorrar(null)}
                disabled={isBorrando}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmBorrar}
                disabled={isBorrando}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isBorrando ? 'Borrando...' : 'Sí, borrar viaje'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViajesPage;


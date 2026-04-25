import { useState, useEffect } from 'react';
import { getViajes, getClientes, getTransportistas } from '../services/api';
import { Map, DollarSign, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';

const DashboardPage = () => {
  const [viajes, setViajes] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [transportistas, setTransportistas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getViajes(), getClientes(), getTransportistas()])
      .then(([v, c, t]) => {
        setViajes(v);
        setClientes(c);
        setTransportistas(t);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 flex-col gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        Cargando estadísticas...
      </div>
    );
  }

  // Cálculos Básicos
  const totalViajes = viajes.length;
  const facturacionTotal = viajes.reduce((acc, v) => acc + (parseFloat(v.importe) || 0), 0);
  const rentabilidadTotal = viajes.reduce((acc, v) => acc + (parseFloat(v.rentabilidad) || 0), 0);
  const totalKilos = viajes.reduce((acc, v) => acc + (parseFloat(v.kilos) || 0), 0);
  const toneladasTotal = totalKilos / 1000;

  // Viajes por estado (usando el campo observaciones)
  const getEstado = (obs: string) => (obs || '').trim().toLowerCase();
  const viajesPagados = viajes.filter(v => getEstado(v.observaciones) === 'pagado').length;
  const viajesLiquidados = viajes.filter(v => getEstado(v.observaciones) === 'liquidado').length;
  const viajesPreliquidacion = viajes.filter(v => getEstado(v.observaciones) === 'preliquidacion').length;
  const viajesPendientes = totalViajes - (viajesPagados + viajesLiquidados + viajesPreliquidacion);

  // Top Clientes
  const clientesStats = clientes.map(c => {
    const viajesCliente = viajes.filter(v => v.cliente_id === c.id);
    const facturado = viajesCliente.reduce((acc, v) => acc + (parseFloat(v.importe) || 0), 0);
    return { ...c, facturado, totalViajes: viajesCliente.length };
  }).sort((a, b) => b.facturado - a.facturado).slice(0, 5);

  // Últimos Viajes
  const ultimosViajes = [...viajes].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-2 pb-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
        <p className="text-gray-500 text-sm mt-1">Resumen general y estadísticas de la operación de GAVEM SA.</p>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Viajes" 
          value={totalViajes} 
          icon={<Map className="w-6 h-6 text-blue-600" />} 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Facturación Bruta" 
          value={`$${facturacionTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`} 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
          bg="bg-emerald-50" 
        />
        <StatCard 
          title="Rentabilidad" 
          value={`$${rentabilidadTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`} 
          icon={<TrendingUp className="w-6 h-6 text-indigo-600" />} 
          bg="bg-indigo-50" 
        />
        <StatCard 
          title="Volumen Transportado" 
          value={`${toneladasTotal.toLocaleString('es-AR', { maximumFractionDigits: 1 })} Ton`} 
          icon={<Package className="w-6 h-6 text-orange-600" />} 
          bg="bg-orange-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Gráfico de Estados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-gray-400" />
            Estado de Operaciones
          </h3>
          <div className="space-y-5">
            <StatusRow label="Pagados" count={viajesPagados} total={totalViajes} color="bg-green-500" />
            <StatusRow label="Liquidados" count={viajesLiquidados} total={totalViajes} color="bg-blue-500" />
            <StatusRow label="Preliquidación" count={viajesPreliquidacion} total={totalViajes} color="bg-yellow-500" />
            <StatusRow label="Pendientes/En Curso" count={viajesPendientes} total={totalViajes} color="bg-gray-300" />
          </div>
        </div>

        {/* Tabla Top Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
            Top Clientes (Facturación)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase text-xs">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium text-center">Viajes</th>
                  <th className="pb-3 font-medium text-right">Facturación Bruta</th>
                </tr>
              </thead>
              <tbody>
                {clientesStats.map((c, i) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-medium text-gray-800 flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      {c.nombre}
                    </td>
                    <td className="py-3 text-center text-gray-600 font-medium">{c.totalViajes}</td>
                    <td className="py-3 text-right font-bold text-emerald-600">
                      ${c.facturado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
                {clientesStats.length === 0 && (
                  <tr><td colSpan={3} className="py-4 text-center text-gray-500">No hay datos suficientes</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-400" />
          Actividad Reciente (Últimos Viajes)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 uppercase text-xs">
                <th className="pb-3 font-medium">Orden</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Transportista</th>
                <th className="pb-3 font-medium">Ruta</th>
                <th className="pb-3 font-medium text-right">Neto</th>
                <th className="pb-3 font-medium text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimosViajes.map(v => {
                const transName = transportistas.find(t => t.id === v.transportista_id)?.nomTrans || `ID ${v.transportista_id}`;
                return (
                  <tr key={v.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">#{v.ordenante}</td>
                    <td className="py-3 text-gray-600">{new Date(v.fecha).toLocaleDateString('es-AR')}</td>
                    <td className="py-3 text-gray-600 truncate max-w-[150px]" title={transName}>{transName}</td>
                    <td className="py-3 text-gray-600">{v.lugar_desde} <span className="text-gray-300 mx-1">→</span> {v.lugar_hasta}</td>
                    <td className="py-3 text-right font-bold text-gray-700">
                      ${parseFloat(v.neto || v.importe).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 text-right">
                      {v.observaciones ? (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gray-100 text-gray-600">
                          {v.observaciones}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {ultimosViajes.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-gray-500">No hay viajes cargados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponentes UI ---

const StatCard = ({ title, value, icon, bg }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
    <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div className="ml-4">
      <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

const StatusRow = ({ label, count, total, color }: any) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{count} <span className="text-gray-400 text-xs ml-1">({percentage}%)</span></span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default DashboardPage;

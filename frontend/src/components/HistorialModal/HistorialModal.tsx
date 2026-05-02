import React, { useEffect, useState } from 'react';
import { getHistorial } from '../../services/api';

interface HistorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  entidad: string;
  entidadId: number;
  entidadNombre?: string;
}

const formatDetalles = (detalles: string | null) => {
  if (!detalles) return null;
  try {
    const parsed = JSON.parse(detalles);
    return (
      <ul className="text-sm text-gray-600 mt-2 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
        {Object.entries(parsed).map(([key, value]: [string, any]) => {
          if (value && typeof value === 'object' && 'old' in value && 'new' in value) {
            return (
              <li key={key}>
                <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                <span className="text-red-500 line-through">{value.old === null ? 'vacío' : String(value.old)}</span>{' '}
                <span className="text-gray-400">→</span>{' '}
                <span className="text-green-600 font-medium">{value.new === null ? 'vacío' : String(value.new)}</span>
              </li>
            );
          }
          return (
            <li key={key}>
              <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
            </li>
          );
        })}
      </ul>
    );
  } catch (e) {
    return <p className="text-sm text-gray-500 mt-2">{detalles}</p>;
  }
};

const HistorialModal: React.FC<HistorialModalProps> = ({ isOpen, onClose, entidad, entidadId, entidadNombre }) => {
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getHistorial({ entidad, entidad_id: entidadId })
        .then(data => setHistorial(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setHistorial([]);
    }
  }, [isOpen, entidad, entidadId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 relative flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Historial de Cambios</h3>
            <p className="text-sm text-gray-500">
              {entidad} {entidadNombre ? `- ${entidadNombre}` : `#${entidadId}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando historial...
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
              No hay registros en el historial para esta entidad.
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {historial.map((h) => (
                <div key={h.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex flex-col mb-1">
                      <span className="font-bold text-gray-800 text-sm">
                        {h.accion === 'CREACION' ? 'Creación' : h.accion === 'MODIFICACION' ? 'Modificación' : 'Eliminación'}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(h.fecha).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mb-2">Por: {h.usuario}</p>
                    {(h.empleado_id || h.empleado_nombre || h.empleado_apellido || h.empleado_telefono) && (
                      <p className="text-xs text-gray-500 mb-2">
                        Empleado #{h.empleado_id ?? '-'} · {h.empleado_nombre ?? ''} {h.empleado_apellido ?? ''}
                        {h.empleado_telefono ? ` · Tel: ${h.empleado_telefono}` : ''}
                      </p>
                    )}
                    {formatDetalles(h.detalles)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialModal;

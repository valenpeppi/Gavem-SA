import React, { useState } from 'react';
import { crearTransportista } from '../services/api';

interface TransportistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransportistaModal: React.FC<TransportistaModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [codTrans, setCodTrans] = useState('');
  const [nomTrans, setNomTrans] = useState('');
  const [cuitTrans, setCuitTrans] = useState('');
  const [telTrans, setTelTrans] = useState('');
  const [calleTrans, setCalleTrans] = useState('');
  const [nroCalleTrans, setNroCalleTrans] = useState('');
  const [cp, setCp] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [provincia, setProvincia] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await crearTransportista({ 
        codTrans: parseInt(codTrans), 
        nomTrans, 
        cuitTrans,
        telTrans,
        calleTrans,
        nroCalleTrans,
        cp,
        localidad,
        provincia
      });
      // Limpiar formulario
      setCodTrans('');
      setNomTrans('');
      setCuitTrans('');
      setTelTrans('');
      setCalleTrans('');
      setNroCalleTrans('');
      setCp('');
      setLocalidad('');
      setProvincia('');
      
      onSuccess(); // Avisarle a la página que tiene que refrescar la tabla
      onClose();   // Cerrar el modal
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ocurrió un error inesperado al guardar el transportista.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Nuevo Transportista</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Interno *
                </label>
                <input 
                  type="number" 
                  required
                  value={codTrans}
                  onChange={(e) => setCodTrans(e.target.value)}
                  placeholder="Ej. 101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CUIT *
                </label>
                <input 
                  type="text" 
                  required
                  value={cuitTrans}
                  onChange={(e) => setCuitTrans(e.target.value)}
                  placeholder="Ej. 20-12345678-9"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre o Razón Social *
              </label>
              <input 
                type="text" 
                required
                value={nomTrans}
                onChange={(e) => setNomTrans(e.target.value)}
                placeholder="Ej. Transporte Los Pinos"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input 
                  type="text" 
                  value={telTrans}
                  onChange={(e) => setTelTrans(e.target.value)}
                  placeholder="Ej. 011 4455-6677"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localidad
                </label>
                <input 
                  type="text" 
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  placeholder="Ej. Rosario"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <input 
                  type="text" 
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  placeholder="Ej. Santa Fe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal (CP)
                </label>
                <input 
                  type="text" 
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  placeholder="Ej. S2000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calle
                </label>
                <input 
                  type="text" 
                  value={calleTrans}
                  onChange={(e) => setCalleTrans(e.target.value)}
                  placeholder="Ej. San Martín"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input 
                  type="text" 
                  value={nroCalleTrans}
                  onChange={(e) => setNroCalleTrans(e.target.value)}
                  placeholder="Ej. 1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Transportista'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransportistaModal;

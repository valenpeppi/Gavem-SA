import React from 'react';
import { useTransportistaModal } from '../../hooks/useTransportistaModal';

interface TransportistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransportistaModal: React.FC<TransportistaModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    codTrans, setCodTrans,
    nomTrans, setNomTrans,
    cuitTrans, setCuitTrans,
    telTrans, setTelTrans,
    calleTrans, setCalleTrans,
    nroCalleTrans, setNroCalleTrans,
    cp, setCp,
    localidad, setLocalidad,
    provincia, setProvincia,
    error, isSubmitting, handleSubmit
  } = useTransportistaModal({ onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--md">

        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">Nuevo Transportista</h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {error && (
            <div className="modal-error--inline">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-grid-2">
              <div>
                <label className="modal-label">
                  Código Interno *
                </label>
                <input
                  type="number"
                  required
                  value={codTrans}
                  onChange={(e) => setCodTrans(e.target.value)}
                  placeholder="Ej. 101"
                  className="modal-input"
                />
              </div>

              <div>
                <label className="modal-label">
                  CUIT *
                </label>
                <input
                  type="text"
                  required
                  value={cuitTrans}
                  onChange={(e) => setCuitTrans(e.target.value)}
                  placeholder="Ej. 20-12345678-9"
                  className="modal-input"
                />
              </div>
            </div>

            <div>
              <label className="modal-label">
                Nombre o Razón Social *
              </label>
              <input
                type="text"
                required
                value={nomTrans}
                onChange={(e) => setNomTrans(e.target.value)}
                placeholder="Ej. Transporte Los Pinos"
                className="modal-input"
              />
            </div>

            <div className="modal-grid-2">
              <div>
                <label className="modal-label">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={telTrans}
                  onChange={(e) => setTelTrans(e.target.value)}
                  placeholder="Ej. 011 4455-6677"
                  className="modal-input"
                />
              </div>

              <div>
                <label className="modal-label">
                  Localidad
                </label>
                <input
                  type="text"
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  placeholder="Ej. Rosario"
                  className="modal-input"
                />
              </div>
            </div>

            <div className="modal-grid-2">
              <div>
                <label className="modal-label">
                  Provincia
                </label>
                <input
                  type="text"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  placeholder="Ej. Santa Fe"
                  className="modal-input"
                />
              </div>

              <div>
                <label className="modal-label">
                  Código Postal (CP)
                </label>
                <input
                  type="text"
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  placeholder="Ej. S2000"
                  className="modal-input"
                />
              </div>
            </div>

            <div className="modal-grid-2">
              <div>
                <label className="modal-label">
                  Calle
                </label>
                <input
                  type="text"
                  value={calleTrans}
                  onChange={(e) => setCalleTrans(e.target.value)}
                  placeholder="Ej. San Martín"
                  className="modal-input"
                />
              </div>

              <div>
                <label className="modal-label">
                  Número
                </label>
                <input
                  type="text"
                  value={nroCalleTrans}
                  onChange={(e) => setNroCalleTrans(e.target.value)}
                  placeholder="Ej. 1234"
                  className="modal-input"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer--inline mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
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

import React from 'react';
import { useClienteModal } from '../../hooks/useClienteModal';

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ClienteModal: React.FC<ClienteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    nombre, setNombre,
    cuit, setCuit,
    error, isSubmitting,
    handleSubmit
  } = useClienteModal({ onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--sm">

        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">Nuevo Cliente</h3>
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
            <div>
              <label className="modal-label">
                Nombre o Razón Social *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Agropecuaria El Sol"
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
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                placeholder="Ej. 30-12345678-9"
                className="modal-input"
              />
            </div>

            {/* Footer */}
            <div className="modal-footer--inline">
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
                {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteModal;

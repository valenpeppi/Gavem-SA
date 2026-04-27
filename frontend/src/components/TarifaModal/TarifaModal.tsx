import React from 'react';
import { useTarifaModal } from '../../hooks/useTarifaModal';

interface TarifaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TarifaModal: React.FC<TarifaModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    clientes,
    clienteId, setClienteId,
    precioKmTon, setPrecioKmTon,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    error, isSubmitting, isLoading,
    handleSubmit
  } = useTarifaModal({ isOpen, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--md">

        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">Nueva Tarifa de Cliente</h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {isLoading ? (
            <div className="modal-loading">Cargando clientes...</div>
          ) : (
            <>
              {error && (
                <div className="modal-error--inline">
                  {error}
                </div>
              )}

              <form id="tarifa-form" onSubmit={handleSubmit} className="modal-form">
                <div>
                  <label className="modal-label">Cliente *</label>
                  <select
                    required
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="modal-input"
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} (CUIT: {c.cuit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="modal-label">Precio por KM-TON ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={precioKmTon}
                    onChange={(e) => setPrecioKmTon(e.target.value)}
                    placeholder="Ej. 1500.50"
                    className="modal-input"
                  />
                </div>

                <div className="modal-grid-2">
                  <div>
                    <label className="modal-label">Vigencia Desde *</label>
                    <input
                      type="date"
                      required
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="modal-input"
                    />
                  </div>
                  <div>
                    <label className="modal-label">Vigencia Hasta *</label>
                    <input
                      type="date"
                      required
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="modal-input"
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel"
            disabled={isSubmitting || isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="tarifa-form"
            disabled={isSubmitting || isLoading}
            className="btn-primary"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Tarifa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarifaModal;

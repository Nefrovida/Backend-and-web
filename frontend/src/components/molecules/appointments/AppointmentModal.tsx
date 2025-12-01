import React from "react";
import "../../../styles/Calendar.css"; 

interface AppointmentModalProps {
  event: {
    title: string;
    description: string;
    start: Date | null;
    end: Date | null;
  };
  onClose: () => void;
  onReschedule: () => void;
  onCancel: () => void; 
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  event,
  onClose,
  onReschedule,
  onCancel,
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles de la Cita</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <strong>Paciente:</strong> {event.title}
          </div>
          <div className="modal-field">
            <strong>Cita:</strong> {event.description}
          </div>
          {event.start && (
            <div className="modal-field">
              <strong>Fecha y hora:</strong> {formatDate(event.start)}
            </div>
          )}
        </div>
        
        <div className="modal-footer flex gap-2 justify-end">
          
          <button className="modal-button-primary" onClick={onReschedule}>
            Reagendar
          </button>

          <button 
            className="modal-button-primary" 
            onClick={() => {
                if(window.confirm("¿Estás seguro de eliminar esta cita?")) {
                    onCancel();
                }
            }}
            style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }} 
          >
            Cancelar Cita
          </button>

          <button className="modal-button-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
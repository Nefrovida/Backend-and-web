import React from "react";
import "../../styles/Calendar.css";

interface AppointmentModalProps {
  event: {
    title: string;
    description: string;
    start: Date | null;
    end: Date | null;
  };
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  event,
  onClose,
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
      </div>
    </div>
  );
};
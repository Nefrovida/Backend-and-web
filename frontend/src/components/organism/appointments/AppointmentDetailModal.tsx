import React from "react";
import { DoctorAppointment } from "../../../types/doctorAppointment.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: DoctorAppointment | null;
}

const AppointmentDetailModal: React.FC<Props> = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fullName = [
    appointment.patient_name,
    appointment.patient_parent_last_name,
    appointment.patient_maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const formatGender = (gender: string | null) => {
    if (!gender) return "No especificado";
    const genderMap: { [key: string]: string } = {
      MALE: "Masculino",
      FEMALE: "Femenino",
      OTHER: "Otro",
    };
    return genderMap[gender] || gender;
  };

  const calculateAge = (birthday: string | null) => {
    if (!birthday) return "No especificado";
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#CFE6ED] rounded-3xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Detalles de la Cita</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Appointment Info Section */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Información de la Cita</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Tipo de Cita</label>
                <p className="text-gray-800">{appointment.appointment_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Estado</label>
                <p className="text-gray-800">{appointment.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Fecha</label>
                <p className="text-gray-800 capitalize">{formatDate(appointment.date_hour)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Hora</label>
                <p className="text-gray-800">{formatTime(appointment.date_hour)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Costo</label>
                <p className="text-gray-800">${appointment.cost}</p>
              </div>
            </div>
          </div>

          {/* Patient Info Section */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Información del Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">Nombre Completo</label>
                <p className="text-gray-800 font-medium">{fullName || "No especificado"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                <p className="text-gray-800">
                  {appointment.patient_phone ? (
                    <a href={`tel:${appointment.patient_phone}`} className="text-blue-600 hover:underline">
                      {appointment.patient_phone}
                    </a>
                  ) : (
                    "No especificado"
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Género</label>
                <p className="text-gray-800">{formatGender(appointment.patient_gender)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                <p className="text-gray-800">
                  {appointment.patient_birthday
                    ? formatDate(appointment.patient_birthday)
                    : "No especificado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Edad</label>
                <p className="text-gray-800">{calculateAge(appointment.patient_birthday)}</p>
              </div>
            </div>
          </div>

          {/* Costs Section */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Costos de Referencia</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Costo General</label>
                <p className="text-gray-800">${appointment.appointment_general_cost}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Costo Comunitario</label>
                <p className="text-gray-800">${appointment.appointment_community_cost}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-8 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;

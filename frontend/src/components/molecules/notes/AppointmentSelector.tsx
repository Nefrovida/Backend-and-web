import { FC } from "react";

interface PatientAppointment {
  patient_appointment_id: number;
  appointment_name: string;
  date_hour: string;
  appointment_status: string;
}

interface Props {
  appointments: PatientAppointment[];
  selectedAppointmentId: number | null;
  onAppointmentChange: (appointmentId: number | null) => void;
  isLoading: boolean;
}

const AppointmentSelector: FC<Props> = ({
  appointments,
  selectedAppointmentId,
  onAppointmentChange,
  isLoading,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Asociar con consulta <span className="text-red-500">*</span>
      </label>
      <select
        value={selectedAppointmentId || ""}
        onChange={(e) => {
          const value = e.target.value;
          onAppointmentChange(value ? Number(value) : null);
        }}
        disabled={isLoading || appointments.length === 0}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Selecciona una consulta</option>
        {appointments.map((apt) => (
          <option key={apt.patient_appointment_id} value={apt.patient_appointment_id}>
            {apt.appointment_name} - {formatDate(apt.date_hour)} 
            {apt.appointment_status === "FINISHED" ? " ✓" : ""}
          </option>
        ))}
      </select>
      {appointments.length === 0 && !isLoading && (
        <p className="mt-1 text-sm text-gray-500">
          No hay consultas disponibles para este paciente
        </p>
      )}
    </div>
  );
};

export default AppointmentSelector;

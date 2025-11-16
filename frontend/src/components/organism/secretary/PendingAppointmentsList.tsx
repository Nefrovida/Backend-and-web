// src/components/organism/secretary/PendingAppointmentsList.tsx
import { FC, useMemo, useState } from "react";
import Title from "../../atoms/Title";
import Search from "../../atoms/Search";
import PatientAppointmentCard from "../../atoms/secretary/PatientAppointmentCard";

interface Appointment {
  patient_appointment_id: number;
  appointment_id: number;
  patient_name: string;
  patient_parent_last_name: string;
  patient_maternal_last_name: string;
  appointment_type: string;
  created_at: string;
}

interface PendingAppointmentsListProps {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  onSelectAppointment: (appointment: Appointment) => void;
  loading: boolean;
}

const PendingAppointmentsList: FC<PendingAppointmentsListProps> = ({
  appointments,
  selectedAppointment,
  onSelectAppointment,
  loading,
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      appointments.filter((a) =>
        `${a.patient_name} ${a.patient_parent_last_name} ${a.patient_maternal_last_name}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [appointments, query]
  );

  return (
    <div className="w-[480px] p-6 h-screen overflow-hidden border-r border-slate-200 bg-slate-50">
      <Title>Citas Solicitadas</Title>

      <div className="w-full flex items-end justify-end gap-3 pb-3">
        <Search onChange={setQuery} />
      </div>

      {loading && (
        <p className="text-sm text-slate-500 text-center py-4">Cargando citas…</p>
      )}

      {!loading && (
        <ul className="flex flex-col gap-3 h-[calc(100vh-180px)] overflow-y-auto pr-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No hay citas pendientes que coincidan con la búsqueda.
            </p>
          ) : (
            filtered.map((appt) => (
              <li key={appt.patient_appointment_id}>
                <PatientAppointmentCard
                  patientName={appt.patient_name}
                  patientParentLastName={appt.patient_parent_last_name}
                  patientMaternalLastName={appt.patient_maternal_last_name}
                  appointmentType={appt.appointment_type}
                  appointmentId={appt.patient_appointment_id}
                  isSelected={
                    selectedAppointment?.patient_appointment_id ===
                    appt.patient_appointment_id
                  }
                  onClick={() => onSelectAppointment(appt)}
                />
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default PendingAppointmentsList;

import { useEffect, useState } from "react";

interface PatientAppointment {
  patient_appointment_id: number;
  appointment_name: string;
  date_hour: string;
  appointment_status: string;
}

function useGetPatientAppointments(patientId: string) {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      setAppointments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/appointments/patient/${patientId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al cargar consultas");
        }
        return res.json();
      })
      .then((data) => {
        // Filtrar solo consultas finalizadas o programadas
        const validAppointments = data
          .filter((apt: any) => 
            apt.appointment_status === "FINISHED" || 
            apt.appointment_status === "PROGRAMMED"
          )
          .map((apt: any) => ({
            patient_appointment_id: apt.patient_appointment_id,
            appointment_name: apt.appointment?.name || "Consulta",
            date_hour: apt.date_hour,
            appointment_status: apt.appointment_status,
          }));
        
        setAppointments(validAppointments);
      })
      .catch((err) => {
        setError(err.message || "Error al cargar consultas");
        setAppointments([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [patientId]);

  return { appointments, isLoading, error };
}

export default useGetPatientAppointments;

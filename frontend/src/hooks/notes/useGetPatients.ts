import patient from "@/types/patient";
import { useEffect, useState } from "react";

function useGetPatients() {
  const [patients, setPatients] = useState<patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/patients/doctorPatients", {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error desconocido");
        }

        return data;
      })
      .then((data) => {
        const patientsInfo: patient[] = data.map((d) => {
          const name = d.user.name;
          const parentalLastName = d.user.parent_last_name;
          const maternalLastName = d.user.maternal_last_name;
          const userId = d.patient_id;

          return { name, parentalLastName, maternalLastName, userId };
        });

        setPatients(patientsInfo);
      })
      .catch((error) => {
        setError(error.message || "Error al cargar pacientes");
      });
  }, []);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  return { patients, selectedPatientId, error, handlePatientChange };
}

export default useGetPatients;

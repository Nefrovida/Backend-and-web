import { CreateNotePayload } from "@/types/note";
import patient from "@/types/patient";
import { useEffect, useState } from "react";

function usePostNotes() {
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState<patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [noteData, setNoteData] = useState({
    general_notes: "",
    ailments: "",
    prescription: ""
  });

  useEffect(() => {
    fetch("/api/patients/doctorPatients", {
      credentials: "include"
    })
      .then(async res => {
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Error desconocido");
        }

        return data;
      })
      .then(data => {
        const patientsInfo: patient[] = data.map(d => {
          const name = d.user.name;
          const parentalLastName = d.user.parent_last_name;
          const maternalLastName = d.user.maternal_last_name;
          const userId = d.patient_id;
          
          return { name, parentalLastName, maternalLastName, userId };
        });

        setPatients(patientsInfo);
      })
      .catch(error => {
        setError(error.message || "Error al cargar pacientes");
      });
  }, []);

  async function postNote(payload: CreateNotePayload) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la nota");
      }

      const data = await response.json();
      setRefreshTrigger(prev => prev + 1);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function save() {
    if (!selectedPatient) {
      setError("Selecciona un paciente");
      return;
    }

    const payload: CreateNotePayload = {
      patientId: selectedPatient,
      title: "Nota de consulta",
      content: "",
      general_notes: noteData.general_notes || undefined,
      ailments: noteData.ailments || undefined,
      prescription: noteData.prescription || undefined,
      visibility: true
    };

    try {
      await postNote(payload);
      setShowModal(false);
      setNoteData({
        general_notes: "",
        ailments: "",
        prescription: ""
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al guardar nota");
    }
  }

  return {
    showModal,
    patients,
    noteData,
    setNoteData,
    setShowModal,
    setSelectedPatient,
    save,
    postNote,
    isLoading,
    error,
    refreshTrigger
  };
}

export default usePostNotes;
import { CreateNotePayload, NoteContent } from "@/types/note";
import { useCallback, useState } from "react";

const MAX_GENERAL_NOTES_LENGTH = 1000;
const MAX_AILMENTS_LENGTH = 1000;
const MAX_PRESCRIPTION_LENGTH = 2000;

function usePostNotes(
  selectedPatientId: string,
  selectedAppointmentId: number | null,
  setValidationError: (string) => void,
  setShowModal: (boolean) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteData, setNoteData] = useState<NoteContent>({
    general_notes: "",
    ailments: "",
    prescription: "",
    visibility: true,
  });

  async function postNote(payload: CreateNotePayload) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la nota");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const save = useCallback(async () => {
    const payload: CreateNotePayload = {
      patientId: selectedPatientId,
      patient_appointment_id: selectedAppointmentId!,
      title: "Nota de consulta",
      content: "",
      general_notes: noteData.general_notes || undefined,
      ailments: noteData.ailments || undefined,
      prescription: noteData.prescription || undefined,
      visibility: noteData.visibility,
    };

    try {
      await postNote(payload);
      setShowModal(false);
      setNoteData({
        general_notes: "",
        ailments: "",
        prescription: "",
        visibility: true,
      });
    } catch (error) {
      // El error de red ya se maneja en postNote con setError
    }
  }, [selectedPatientId, selectedAppointmentId, noteData]);

  const handleSave = async () => {
    setValidationError(null);

    if (!selectedAppointmentId) {
      setValidationError("Debes asociar la nota con una consulta");
      return;
    }

    if (noteData.general_notes.length > MAX_GENERAL_NOTES_LENGTH) {
      setValidationError(
        `Las notas generales no pueden exceder ${MAX_GENERAL_NOTES_LENGTH} caracteres`
      );
      return;
    }

    if (noteData.ailments.length > MAX_AILMENTS_LENGTH) {
      setValidationError(
        `Los padecimientos no pueden exceder ${MAX_AILMENTS_LENGTH} caracteres`
      );
      return;
    }

    if (noteData.prescription.length > MAX_PRESCRIPTION_LENGTH) {
      setValidationError(
        `La receta no puede exceder ${MAX_PRESCRIPTION_LENGTH} caracteres`
      );
      return;
    }

    await save();
  };

  return {
    isLoading,
    error,
    handleSave,
    setNoteData,
    postNote,
  };
}

export default usePostNotes;

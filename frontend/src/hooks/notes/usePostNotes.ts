import { CreateNotePayload, NoteContent } from "@/types/note";
import { useState } from "react";

const MAX_GENERAL_NOTES_LENGTH = 1000;
const MAX_AILMENTS_LENGTH = 1000;
const MAX_PRESCRIPTION_LENGTH = 2000;

function usePostNotes(
  selectedPatient: string,
  setValidationError: (string) => void
) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [noteData, setNoteData] = useState<NoteContent>({
    general_notes: "",
    ailments: "",
    prescription: "",
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
      setRefreshTrigger((prev) => prev + 1);
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
      visibility: true,
    };

    try {
      await postNote(payload);
      setShowModal(false);
      setNoteData({
        general_notes: "",
        ailments: "",
        prescription: "",
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al guardar nota"
      );
    }
  }

  const handleSave = async () => {
    setValidationError(null);

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
    showModal,
    isLoading,
    error,
    refreshTrigger,
    handleSave,
    setNoteData,
    setShowModal,
    postNote,
  };
}

export default usePostNotes;

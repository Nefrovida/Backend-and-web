import { useState, useEffect } from "react";
import { Note } from "@/types/note";

interface UseGetNotesParams {
  patientId?: string;
  refreshKey?: number;
}

function useGetNotes({ patientId, refreshKey }: UseGetNotesParams) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      setNotes([]);
      setError(null);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("patientId", patientId);

        const response = await fetch(`/api/notes?${params.toString()}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al obtener las notas");
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [patientId, refreshKey]);

  return {
    notes,
    loading,
    error,
  };
}

export default useGetNotes;

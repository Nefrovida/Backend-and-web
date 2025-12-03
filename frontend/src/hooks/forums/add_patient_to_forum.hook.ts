import { useState, useCallback } from "react";
import { addPatientToForumService } from "../../services/forums/add_patient_to_forum.service";
import { AddPatientToForumRequest } from "../../types/forums/add_patient_to_forum.types";

export default function useAddPatientToForum() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addPatient = useCallback(
    async (forumId: number, data: AddPatientToForumRequest) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await addPatientToForumService.addPatientToForum(forumId, data);
        setSuccess(true);
        
        // Reset success after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        
        return response;
      } catch (err: any) {
        const errorMessage = getErrorMessage(err.message);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    addPatient,
    loading,
    error,
    success,
    reset,
  };
}

/**
 * Converts backend error messages to user-friendly Spanish messages
 */
function getErrorMessage(message: string): string {
  if (message.includes("Forum not found")) {
    return "El foro no existe";
  }
  if (message.includes("Only private forums")) {
    return "Solo se pueden agregar usuarios manualmente a foros privados";
  }
  if (message.includes("Forum is not active")) {
    return "El foro no está activo";
  }
  if (message.includes("User is not a patient")) {
    return "El usuario seleccionado no es un paciente";
  }
  if (message.includes("already a member")) {
    return "Este paciente ya está en el foro";
  }
  if (message.includes("Insufficient privileges")) {
    return "No tienes permisos para realizar esta acción";
  }
  if (message.includes("Unauthorized")) {
    return "Tu sesión ha expirado, inicia sesión nuevamente";
  }
  if (message.includes("Invalid request")) {
    return "Los datos ingresados no son válidos";
  }
  if (message.includes("userId must be a valid UUID")) {
    return "El formato del ID de usuario no es válido";
  }
  if (message.includes("forumRole must be one of")) {
    return "El rol seleccionado no es válido";
  }
  return message || "Error al agregar paciente al foro";
}
import React, { useState } from "react";
import useAddPatientToForum from "../../../hooks/forums/add_patient_to_forum.hook";
import { FORUM_ROLES } from "../../../types/forums/add_patient_to_forum.types";

interface AddPatientToForumProps {
  forumId: number;
  forumName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function AddPatientToForum({
  forumId,
  forumName,
  onSuccess,
  onCancel,
}: AddPatientToForumProps) {
  const { addPatient, loading, error, success } = useAddPatientToForum();
  
  const [userId, setUserId] = useState("");
  const [forumRole, setForumRole] = useState<string>(FORUM_ROLES.MEMBER);
  const [localError, setLocalError] = useState("");

  const validateUUID = (uuid: string): boolean => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validaciones del cliente
    if (!userId.trim()) {
      setLocalError("El ID del usuario es requerido");
      return;
    }

    if (!validateUUID(userId)) {
      setLocalError("El formato del ID de usuario no es válido (debe ser UUID)");
      return;
    }

    if (!forumRole.trim()) {
      setLocalError("El rol en el foro es requerido");
      return;
    }

    try {
      await addPatient(forumId, {
        userId: userId.trim(),
        forumRole: forumRole.trim(),
      });
      
      // Limpiar formulario después del éxito
      setUserId("");
      setForumRole(FORUM_ROLES.MEMBER);
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error adding patient to forum:", err);
    }
  };

  const handleCancel = () => {
    setUserId("");
    setForumRole(FORUM_ROLES.MEMBER);
    setLocalError("");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Añadir Paciente a Foro
        </h2>
        {forumName && (
          <p className="text-center text-gray-600 mt-2">
            Foro: <span className="font-semibold">{forumName}</span>
          </p>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Paciente agregado exitosamente</span>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {(error || localError) && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error || localError}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* User ID Field */}
        <div>
          <label className="block text-sm text-gray-600 mb-2 ml-1">
            ID del Paciente (UUID) *
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1 ml-1">
            Formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          </p>
        </div>

        {/* Forum Role Field */}
        <div>
          <label className="block text-sm text-gray-600 mb-2 ml-1">
            Rol en el Foro *
          </label>
          <select
            value={forumRole}
            onChange={(e) => setForumRole(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
            disabled={loading}
            required
          >
            <option value={FORUM_ROLES.MEMBER}>Miembro</option>
            <option value={FORUM_ROLES.PARTICIPANT}>Participante</option>
            <option value={FORUM_ROLES.MODERATOR}>Moderador</option>
          </select>
          <p className="text-xs text-gray-500 mt-1 ml-1">
            Miembro: Usuario del foro | Participante: Responde mensajes | Moderador: Administra el foro
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> Solo puedes agregar usuarios que sean pacientes
            registrados en el sistema a foros privados.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Agregando...
              </span>
            ) : (
              "Agregar Paciente"
            )}
          </button>
        </div>
      </form>

      {/* Helper Text */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ¿Necesitas ayuda? Contacta al administrador del sistema
        </p>
      </div>
    </div>
  );
}

export default AddPatientToForum;
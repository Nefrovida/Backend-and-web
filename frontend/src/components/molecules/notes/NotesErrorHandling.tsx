import { Note } from "@/types/note";
import React, { FC } from "react";

interface Props {
  loading: boolean;
  fetchError: string;
  selectedPatientId: string;
  notes: Note[];
}

const NotesErrorHandling: FC<Props> = ({
  loading,
  fetchError,
  selectedPatientId,
  notes,
}) => {
  return (
    <>
      {loading && notes.length <= 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Cargando notas...</p>
        </div>
      )}

      {fetchError && (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <p className="text-red-600">{fetchError}</p>
        </div>
      )}

      {!loading && !fetchError && selectedPatientId && notes.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No hay notas para este paciente</p>
        </div>
      )}

      {!loading && !fetchError && !selectedPatientId && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">
            Selecciona un paciente para ver sus notas
          </p>
        </div>
      )}
    </>
  );
};

export default NotesErrorHandling;

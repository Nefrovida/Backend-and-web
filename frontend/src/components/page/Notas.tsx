import React, { useState, useEffect } from "react";
import Title from "../atoms/Title";
import NewNoteModal from "../molecules/notes/NewNoteModal";
import CancelNoteButton from "../atoms/notes/CancelNoteButton";
import SaveNoteButton from "../atoms/notes/SaveNoteButton";
import usePostNotes from "@/hooks/notes/usePostNotes";
import useGetNotes from "@/hooks/notes/useGetNotes";
import NoteHistory from "../atoms/notes/NoteHistory";

const MAX_GENERAL_NOTES_LENGTH = 1000;
const MAX_AILMENTS_LENGTH = 1000;
const MAX_PRESCRIPTION_LENGTH = 2000;

const Notas = ({ className }: { className: string }) => {
  const {
    showModal,
    patients,
    noteData,
    setNoteData,
    setSelectedPatient,
    setShowModal,
    save,
    refreshTrigger,
    error,
  } = usePostNotes();

  const [selectedPatientId, setSelectedPatientIdState] = useState<string>("");
  const [notesKey, setNotesKey] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  const {
    notes,
    loading,
    error: fetchError,
  } = useGetNotes({
    patientId: selectedPatientId || undefined,
    refreshKey: notesKey,
    title,
  });

  useEffect(() => {
    if (refreshTrigger > 0) {
      setNotesKey((prev) => prev + 1);
    }
  }, [refreshTrigger]);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientIdState(patientId);
    setSelectedPatient(patientId);
    setNotesKey((prev) => prev + 1);
  };

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

  return (
    <div
      className={`absolute top-0 left-14 bg-gray-200 w-[45vw] h-screen flex flex-col p-4 overflow-hidden ${className}`}
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
        <div className="mb-4 flex-shrink-0">
          <Title>Notas</Title>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <label
                htmlFor="patient"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Seleccionar paciente
              </label>
              <select
                name="patient"
                id="patient"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handlePatientChange(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Elige un paciente...
                </option>
                {patients.map((patient, idx) => {
                  const patientName =
                    patient.name +
                    " " +
                    patient.parentalLastName +
                    " " +
                    patient.maternalLastName;
                  return (
                    <option value={patient.userId} key={idx}>
                      {patientName}
                    </option>
                  );
                })}
              </select>
            </div>

            {!showModal && (
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-sm"
                >
                  <span className="text-xl">+</span>
                  Nueva nota
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {showModal ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  Nueva Nota
                </h3>
                <div className="flex gap-2">
                  <CancelNoteButton closeModal={() => setShowModal(false)} />
                  <SaveNoteButton save={handleSave} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <NewNoteModal modalState={setNoteData} />

                {(validationError || error) && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {validationError || error}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">Cargando notas...</p>
                </div>
              )}

              {fetchError && (
                <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
                  <p className="text-red-600">{fetchError}</p>
                </div>
              )}

              {!loading &&
                !fetchError &&
                selectedPatientId &&
                notes.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-600">
                      No hay notas para este paciente
                    </p>
                  </div>
                )}

              {!loading && !fetchError && !selectedPatientId && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">
                    Selecciona un paciente para ver sus notas
                  </p>
                </div>
              )}

              {notes.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                  <NoteHistory ammount={notes.length} />
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.note_id}
                        className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-200">
                          <h4 className="text-base font-semibold text-gray-900">
                            {note.title}
                          </h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {new Date(note.creation_date).toLocaleDateString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {note.general_notes && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-700 mb-1">
                                Notas Generales
                              </h5>
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {note.general_notes}
                              </p>
                            </div>
                          )}

                          {note.ailments && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-700 mb-1">
                                Padecimientos
                              </h5>
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {note.ailments}
                              </p>
                            </div>
                          )}

                          {note.prescription && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-700 mb-1">
                                Receta
                              </h5>
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {note.prescription}
                              </p>
                            </div>
                          )}
                        </div>

                        {!note.visibility && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="inline-flex items-center text-xs text-gray-500 italic">
                              🔒 No visible para el paciente
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notas;

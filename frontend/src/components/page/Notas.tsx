import React, { useState } from "react";
import usePostNotes from "@/hooks/notes/usePostNotes";
import useGetPatients from "@/hooks/notes/useGetPatients";
import NotesTopController from "../organism/notes/NotesTopController";
import NewNoteComponent from "../organism/notes/NewNoteComponent";
import ViewNotesComponent from "../organism/notes/ViewNotesComponent";

const Notas = ({ className }: { className?: string }) => {
  const { patients, selectedPatientId, handlePatientChange } = useGetPatients();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { refreshTrigger, error, setNoteData, handleSave } = usePostNotes(
    selectedPatientId,
    setValidationError,
    setShowModal
  );

  return (
    <div
      className={` bg-gray-200 w-[45vw] h-screen flex flex-col z-50 p-4 overflow-hidden ${className}`}
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
        <div className="mb-4 flex-shrink-0"></div>

        <NotesTopController
          patients={patients}
          handlePatientChange={handlePatientChange}
          showModal={showModal}
          setShowModal={setShowModal}
        />

        <div className="flex-1 flex flex-col min-h-0">
          {showModal ? (
            <NewNoteComponent
              validationError={validationError}
              error={error}
              setShowModal={setShowModal}
              handleSave={handleSave}
              setNoteData={setNoteData}
            />
          ) : (
            <ViewNotesComponent
              selectedPatientId={selectedPatientId}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notas;

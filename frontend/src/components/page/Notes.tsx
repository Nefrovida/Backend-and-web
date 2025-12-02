import React, { useState } from "react";
import usePostNotes from "@/hooks/notes/usePostNotes";
import useGetPatients from "@/hooks/notes/useGetPatients";
import useGetPatientAppointments from "@/hooks/notes/useGetPatientAppointments";
import NotesTopController from "../organism/notes/NotesTopController";
import NewNoteComponent from "../organism/notes/NewNoteComponent";
import ViewNotesComponent from "../organism/notes/ViewNotesComponent";

const Notes = ({ className }: { className?: string }) => {
  const { patients, selectedPatientId, handlePatientChange } = useGetPatients();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const { appointments, isLoading: appointmentsLoading } = useGetPatientAppointments(selectedPatientId);

  const { isLoading, error, noteData, setNoteData, handleSave } = usePostNotes(
    selectedPatientId,
    selectedAppointmentId,
    setValidationError,
    setShowModal
  );

  return (
    <div
      className={` bg-gray-200 w-[45vw] h-screen flex flex-col z-50 p-4 pt-2 overflow-hidden ${className}`}
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
              isLoading={isLoading}
              appointments={appointments}
              appointmentsLoading={appointmentsLoading}
              selectedAppointmentId={selectedAppointmentId}
              onAppointmentChange={setSelectedAppointmentId}
              title={noteData.title}
              setShowModal={setShowModal}
              handleSave={handleSave}
              setNoteData={setNoteData}
            />
          ) : (
            <ViewNotesComponent selectedPatientId={selectedPatientId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;

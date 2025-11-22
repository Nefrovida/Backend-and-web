import NotesErrorHandling from "@/components/molecules/notes/NotesErrorHandling";
import NotesList from "@/components/molecules/notes/NotesList";
import useGetNotes from "@/hooks/notes/useGetNotes";
import React, { FC, useEffect, useState } from "react";

interface Props {
  selectedPatientId: string;
  refreshTrigger: number;
}

const ViewNotesComponent: FC<Props> = ({
  selectedPatientId,
  refreshTrigger,
}) => {
  const [notesKey, setNotesKey] = useState(0);

  const {
    notes,
    loading,
    error: fetchError,
  } = useGetNotes({
    patientId: selectedPatientId || undefined,
    refreshKey: notesKey,
  });

  useEffect(() => {
    if (refreshTrigger > 0) {
      setNotesKey((prev) => prev + 1);
    }
  }, [refreshTrigger]);

  return (
    <>
      <NotesErrorHandling
        loading={loading}
        fetchError={fetchError}
        selectedPatientId={selectedPatientId}
        notes={notes}
      />

      <NotesList notes={notes} />
    </>
  );
};

export default ViewNotesComponent;

import NotesErrorHandling from "@/components/molecules/notes/NotesErrorHandling";
import NotesList from "@/components/molecules/notes/NotesList";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Note } from "@/types/note";
import React, { FC, useCallback } from "react";

interface Props {
  selectedPatientId: string;
  refreshTrigger: number;
}

const ViewNotesComponent: FC<Props> = ({ selectedPatientId }) => {
  const buildQueryParams = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("patientId", selectedPatientId);
      return params.toString();
    },
    [selectedPatientId]
  );

  const {
    results: notes,
    loading,
    error: fetchError,
    scrollRef,
  } = useInfiniteScroll<Note>(
    "/api/notes",
    [selectedPatientId],
    buildQueryParams
  );

  return (
    <>
      <NotesErrorHandling
        loading={loading}
        fetchError={fetchError}
        selectedPatientId={selectedPatientId}
        notes={notes}
      />

      <NotesList notes={notes} scrollRef={scrollRef} />
    </>
  );
};

export default ViewNotesComponent;

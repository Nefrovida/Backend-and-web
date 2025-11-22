import NoteHistory from "@/components/atoms/notes/NoteHistory";
import { Note } from "@/types/note";
import React, { FC } from "react";
import NoteCard from "./NoteCard";

interface Props {
  notes: Note[];
}

const NotesList: FC<Props> = ({ notes }) => {
  return (
    <>
      {notes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
          <NoteHistory ammount={notes.length} />
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notes.map((note, idx) => (
              <NoteCard note={note} key={idx} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NotesList;

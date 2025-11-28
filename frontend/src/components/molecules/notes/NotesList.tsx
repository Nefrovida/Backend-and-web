import NoteHistory from "@/components/atoms/notes/NoteHistory";
import { Note } from "@/types/note";
import React, { FC } from "react";
import NoteCard from "./NoteCard";

interface Props {
  notes: Note[];
  scrollRef: React.RefObject<HTMLUListElement | null>;
}

const NotesList: FC<Props> = ({ notes, scrollRef }) => {
  return (
    <>
      {notes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
          <NoteHistory ammount={notes.length} />
          <ul className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
            {notes.map((note, idx) => (
              <NoteCard note={note} key={idx} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default NotesList;

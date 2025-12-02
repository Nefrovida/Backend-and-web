import NoteDate from "@/components/atoms/notes/NoteDate";
import { Note } from "@/types/note";
import React, { FC } from "react";
import NoteSection from "@/components/atoms/notes/NoteSection";
import NoteVisibility from "@/components/atoms/notes/NoteVisibility";

interface Props {
  note: Note;
}

const NoteCard: FC<Props> = ({ note }) => {
  return (
    <li
      key={note.note_id}
      className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors"
    >
      <NoteDate title={note.title} creationDate={note.creation_date} />
      
      {note.patient_appointment_id ? (
        <div className="mb-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
          Asociada a consulta: {note.patient_appointment?.appointment?.name || `#${note.patient_appointment_id}`}
        </div>
      ) : (
        <div className="mb-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">
          ⚠ Nota sin consulta asociada
        </div>
      )}

      <div className="space-y-2">
        <NoteSection noteContent={note.general_notes} title="Notas Generales" />
        <NoteSection noteContent={note.ailments} title="Padecimientos" />
        <NoteSection noteContent={note.prescription} title="Receta" />
      </div>

      <NoteVisibility visibility={note.visibility} />
    </li>
  );
};

export default NoteCard;

import React, { FC } from "react";

interface Props {
  visibility: boolean;
}

const NoteVisibility: FC<Props> = ({ visibility }) => {
  return (
    <>
      {!visibility && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <span className="inline-flex items-center text-xs text-gray-500 italic">
            🔒 No visible para el paciente
          </span>
        </div>
      )}
    </>
  );
};

export default NoteVisibility;

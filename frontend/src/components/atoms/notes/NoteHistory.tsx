import React, { FC } from "react";
interface Props {
  ammount: number;
}

const NoteHistory: FC<Props> = ({ ammount }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex justify-between">
      <h3 className="text-base font-semibold text-gray-900">
        Historial de notas ({ammount})
      </h3>
    </div>
  );
};

export default NoteHistory;

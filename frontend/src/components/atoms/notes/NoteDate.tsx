import React, { FC } from "react";

interface Props {
  title: string;
  creationDate: string | Date;
}

const NoteDate: FC<Props> = ({ title, creationDate }) => {
  return (
    <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-200">
      <h4 className="text-base font-semibold text-gray-900">{title}</h4>
      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
        {new Date(creationDate).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    </div>
  );
};

export default NoteDate;

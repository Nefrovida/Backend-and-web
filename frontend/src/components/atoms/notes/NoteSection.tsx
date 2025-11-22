import React, { FC } from "react";

interface Props {
  noteContent: string;
  title: string;
}

const NoteSection: FC<Props> = ({ noteContent, title }) => {
  return (
    <>
      {noteContent && (
        <div>
          <h5 className="text-xs font-semibold text-gray-700 mb-1">{title}</h5>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {noteContent}
          </p>
        </div>
      )}
    </>
  );
};

export default NoteSection;

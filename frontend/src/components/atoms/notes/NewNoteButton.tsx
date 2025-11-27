import React, { FC } from "react";

interface Props {
  setShowModal: (x: boolean) => void;
}

const NewNoteButton: FC<Props> = ({ setShowModal }) => {
  return (
    <div className="mt-4 sm:mt-6">
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-sm"
      >
        <span className="text-xl">+</span>
        Nueva nota
      </button>
    </div>
  );
};

export default NewNoteButton;

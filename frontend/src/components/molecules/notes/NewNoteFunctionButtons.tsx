import CancelNoteButton from "@/components/atoms/notes/CancelNoteButton";
import SaveNoteButton from "@/components/atoms/notes/SaveNoteButton";
import React, { FC } from "react";

interface Props {
  isLoading: boolean;
  setShowModal: (boolean) => void;
  handleSave: () => void;
}

const NewNoteFunctionButtons: FC<Props> = ({
  isLoading,
  setShowModal,
  handleSave,
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
      <h3 className="text-lg font-semibold text-gray-800">Nueva Nota</h3>
      <div className="flex gap-2">
        <CancelNoteButton closeModal={() => setShowModal(false)} />
        <SaveNoteButton save={handleSave} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default NewNoteFunctionButtons;

import NewNoteFunctionButtons from "@/components/molecules/notes/NewNoteFunctionButtons";
import NewNoteModal from "@/components/molecules/notes/NewNoteModal";
import { NoteContent } from "@/types/note";
import { FC } from "react";

interface Props {
  validationError: string | null;
  error: string | null;
  isLoading: boolean;
  setShowModal: (b: boolean) => void;
  handleSave: () => void;
  setNoteData: (x: NoteContent) => void;
}

const NewNoteComponent: FC<Props> = ({
  validationError,
  error,
  isLoading,
  setShowModal,
  handleSave,
  setNoteData,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <NewNoteFunctionButtons
        isLoading={isLoading}
        setShowModal={setShowModal}
        handleSave={handleSave}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <NewNoteModal modalState={setNoteData} />

        {(validationError || error) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {validationError || error}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewNoteComponent;

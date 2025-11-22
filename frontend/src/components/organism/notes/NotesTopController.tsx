import NewNoteButton from "@/components/atoms/notes/NewNoteButton";
import PatientSelector from "@/components/molecules/notes/PatientSelector";
import patient from "@/types/patient";
import { FC } from "react";

interface Props {
  showModal: boolean;
  patients: patient[];
  setShowModal: (boolean) => void;
  handlePatientChange: (string) => void;
}

const NotesTopController: FC<Props> = ({
  patients,
  showModal,
  handlePatientChange,
  setShowModal,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex-shrink-0">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <PatientSelector
          patients={patients}
          handlePatientChange={handlePatientChange}
        />

        {!showModal && <NewNoteButton setShowModal={setShowModal} />}
      </div>
    </div>
  );
};

export default NotesTopController;

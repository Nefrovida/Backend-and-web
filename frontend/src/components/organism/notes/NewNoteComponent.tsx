import NewNoteFunctionButtons from "@/components/molecules/notes/NewNoteFunctionButtons";
import NewNoteModal from "@/components/molecules/notes/NewNoteModal";
import AppointmentSelector from "@/components/molecules/notes/AppointmentSelector";
import { NoteContent } from "@/types/note";
import { FC } from "react";

interface PatientAppointment {
  patient_appointment_id: number;
  appointment_name: string;
  date_hour: string;
  appointment_status: string;
}

interface Props {
  validationError: string | null;
  error: string | null;
  isLoading: boolean;
  appointments: PatientAppointment[];
  appointmentsLoading: boolean;
  selectedAppointmentId: number | null;
  onAppointmentChange: (id: number | null) => void;
  title: string;
  setShowModal: (b: boolean) => void;
  handleSave: () => void;
  setNoteData: React.Dispatch<React.SetStateAction<NoteContent>>;
}

const NewNoteComponent: FC<Props> = ({
  validationError,
  error,
  isLoading,
  appointments,
  appointmentsLoading,
  selectedAppointmentId,
  onAppointmentChange,
  title,
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


        {(validationError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {validationError || error}
          </div>
        )}

        <AppointmentSelector
          appointments={appointments}
          selectedAppointmentId={selectedAppointmentId}
          onAppointmentChange={onAppointmentChange}
          isLoading={appointmentsLoading}
        />

        <div className="flex items-center space-x-2 p-4 mb-4 bg-blue-50 rounded-lg border border-blue-200">
          <input
            type="checkbox"
            id="visibility"
            defaultChecked={true}
            onChange={(e) => {
              setNoteData((prev) => ({
                ...prev,
                visibility: e.target.checked,
              }));
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="visibility"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Permitir que el paciente vea esta nota
          </label>
        </div>
        
        <NewNoteModal modalState={setNoteData} />
      </div>
    </div>
  );
};

export default NewNoteComponent;

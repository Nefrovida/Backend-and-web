// src/components/atoms/secretary/PatientAppointmentCard.tsx
import type { FC } from "react";
import { BsPerson } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";

interface PatientAppointmentCardProps {
  patientName: string;
  patientParentLastName: string;
  patientMaternalLastName: string;
  appointmentType: string;
  appointmentId: number;
  isSelected: boolean;
  onClick: () => void;
}

const PatientAppointmentCard: FC<PatientAppointmentCardProps> = ({
  patientName,
  patientParentLastName,
  patientMaternalLastName,
  appointmentType,
  appointmentId,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={[
        "rounded-lg drop-shadow-md shadow-md border-2 bg-white transition-colors w-full flex items-center justify-between py-3 px-4",
        isSelected ? "bg-slate-100 border-[#9AE5FB]" : "border-slate-200 hover:shadow-xl",
      ].join(" ")}
    >
      <button
        onClick={onClick}
        className="flex items-center flex-1 text-left"
      >
        <BsPerson className="text-3xl mr-4 text-slate-700" />
        <div>
          <p className="text-base font-medium text-slate-900">
            {patientName} {patientParentLastName} {patientMaternalLastName}
          </p>
          <p className="text-sm text-slate-600">{appointmentType}</p>
          <p className="text-xs text-slate-500">ID: {appointmentId}</p>
        </div>
      </button>
      
      <button
        onClick={onClick}
        className="ml-3 px-4 py-2 bg-[#9AE5FB] hover:bg-[#8ADDFB] text-slate-800 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        Agendar Cita
      </button>
    </div>
  );
};

export default PatientAppointmentCard;

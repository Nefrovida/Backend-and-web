import React from "react";
import { BsPerson } from "react-icons/bs";
import { AppointmentRequest } from "../../../types/appointment";

interface Props {
  request: AppointmentRequest;
  isSelected: boolean;
  onSelect: (request: AppointmentRequest) => void;
}

const AppointmentRequestCard: React.FC<Props> = ({ request, isSelected, onSelect }) => {
  const requestDate = new Date(request.requested_date);
  const formattedDate = `${requestDate.getDate()}/${requestDate.getMonth() + 1}/${requestDate.getFullYear()}`;
  const formattedTime = `${requestDate.getHours().toString().padStart(2, '0')}:${requestDate.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div
      className={`rounded-lg drop-shadow-md shadow-md border-2 flex flex-col bg-white p-4 hover:shadow-xl cursor-pointer transition-all ${
        isSelected ? "border-primary bg-blue-50" : "border-light-blue"
      }`}
      onClick={() => onSelect(request)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <BsPerson className="text-3xl mr-3" />
          <div>
            <p className="text-lg font-semibold">{request.patient_name}</p>
            <p className="text-sm text-gray-600">{request.patient_phone}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tipo de cita:</span>
          <span className="font-medium">{request.appointment_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Modalidad:</span>
          <span className="font-medium">{request.appointment_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duración:</span>
          <span className="font-medium">{request.duration} min</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fecha solicitada:</span>
          <span className="font-medium">{formattedDate} {formattedTime}</span>
        </div>
      </div>

      <button
        className="mt-3 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(request);
        }}
      >
        Agendar Cita
      </button>
    </div>
  );
};

export default AppointmentRequestCard;

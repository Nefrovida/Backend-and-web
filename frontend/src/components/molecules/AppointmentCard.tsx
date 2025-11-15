// components/molecules/AppointmentCard.tsx

import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import Button from '../atoms/Button';
import { Appointment } from '../../types/appointment';
import appointmentController from '../../controller/AppointmentController';

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onReschedule 
}) => {
  const fullName = appointmentController.getFullPatientName(appointment);
  const formattedDate = appointmentController.formatDate(appointment.date_hour);
  const formattedTime = appointmentController.formatTime(appointment.date_hour);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <BsPersonCircle className="w-10 h-10 text-gray-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{fullName}</h3>
            <p className="text-sm text-gray-600">{appointment.reason}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formattedDate} - {formattedTime}
            </p>
          </div>
        </div>
        <Button 
          variant="primary" 
          onClick={() => onReschedule(appointment)}
          className="text-sm"
        >
          Reagendar
        </Button>
      </div>
    </div>
  );
};

export default AppointmentCard;
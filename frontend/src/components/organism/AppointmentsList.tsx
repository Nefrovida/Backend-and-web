// components/organisms/AppointmentsList.tsx

import React from 'react';
import AppointmentCard from '../molecules/AppointmentCard';
import Button from '../atoms/Button';
import { Appointment } from '../../types/appointment';

interface AppointmentsListProps {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  onReschedule: (appointment: Appointment) => void;
  onRetry?: () => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  loading,
  error,
  onReschedule,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando citas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron citas médicas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onReschedule={onReschedule}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentsList;
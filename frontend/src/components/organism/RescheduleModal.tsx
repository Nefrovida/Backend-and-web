import React, { useState } from 'react';
import Button from '../atoms/Button';
import TimeSlotGrid from '../molecules/TimeSlotGrid';
import { Appointment, RescheduleData } from '../../types/appointment';
import appointmentController from '../../controller/AppointmentController';

interface RescheduleModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: (id: number, data: RescheduleData) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  onClose,
  onSave
}) => {
  const [reason, setReason] = useState(appointment.reason);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!date || !time) {
      alert('Debe seleccionar fecha y hora');
      return;
    }

    setLoading(true);
    
    const dateTimeString = `${date}T${time}:00.000Z`;

    const rescheduleData: RescheduleData = {
      date_hour: dateTimeString,
      reason: reason
    };

    try {
      await onSave(appointment.id, rescheduleData);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setLoading(false);
    }
  };

  const fullName = appointmentController.getFullPatientName(appointment);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Reagendar cita médica de<br />
          {fullName}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de la cita:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Consulta general"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccione la fecha para la cita:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccione el horario para la cita:
            </label>
            <TimeSlotGrid
              selectedTime={time}
              onTimeSelect={setTime}
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="warning"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3"
          >
            Salir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
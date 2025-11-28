import React, { useState, useEffect } from 'react';
import PageHeader from '../molecules/PageHeader';
import Search from '../atoms/Search';
import Filter from '../atoms/Filter';
import AppointmentsList from '../organism/AppointmentsList';
import RescheduleModal from '../organism/RescheduleModal';
import appointmentController from '../../controller/AppointmentController';
import { Appointment, RescheduleData } from '../../types/appointment';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar citas al montar el componente
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentController.loadAppointments();
      const sorted = appointmentController.sortByDate(data);
      setAppointments(sorted);
      setFilteredAppointments(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const filtered = appointmentController.searchAppointments(appointments, value);
    setFilteredAppointments(filtered);
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleSaveReschedule = async (id: number, data: RescheduleData) => {
    try {
      const updated = await appointmentController.rescheduleAppointment(id, data);
      
      // Actualizar estado local
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === updated.id ? updated : apt))
      );
      setFilteredAppointments((prev) =>
        prev.map((apt) => (apt.id === updated.id ? updated : apt))
      );
      
      setSelectedAppointment(null);
      alert('Cita reagendada exitosamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al reagendar');
    }
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
  };

  const filterContent = (
    <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
      <p className="text-sm text-gray-600">Filtros disponibles próximamente</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <PageHeader />
          <div className="flex items-center space-x-3 relative">
            <Search onChange={handleSearch} />
            <Filter show={filterContent} />
          </div>
        </div>

        <AppointmentsList
          appointments={filteredAppointments}
          loading={loading}
          error={error}
          onReschedule={handleReschedule}
          onRetry={loadAppointments}
        />

        <div className="fixed bottom-8 left-8">
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Reschedule Modal */}
      {selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          onSave={handleSaveReschedule}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
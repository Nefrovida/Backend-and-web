import React, { useEffect, useState } from "react";
import { Calendar } from "../components/organism/Calendar";
import { appointmentsService } from "../services/appointments.service";
import { mapAppointmentsToEvents } from "../model/doctorAppointments.model";
import { DoctorAppointment } from "../types/doctorAppointment.types";
import AppointmentDetailModal from "../components/organism/appointments/AppointmentDetailModal";

export const DoctorAppointmentsController = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedAppointments = await appointmentsService.getMyAppointments();
      const mappedEvents = mapAppointmentsToEvents(fetchedAppointments);

      setAppointments(fetchedAppointments);
      setEvents(mappedEvents);
    } catch (err: any) {
      setError(err.message || "Error al cargar las citas");
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventInfo: any) => {
    const appointmentId = eventInfo.event.id;
    const appointment = appointments.find(
      (apt) => apt.patient_appointment_id.toString() === appointmentId
    );

    if (appointment) {
      setSelectedAppointment(appointment);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Cargando citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Calendar
        events={events}
        viewType="timeGridWeek"
        minTime="09:00:00"
        maxTime="18:01:00"
        onEventClick={handleEventClick}
      />
      <AppointmentDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
      />
    </div>
  );
};

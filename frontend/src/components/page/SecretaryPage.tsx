import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PendingAppointmentsList from '../organism/secretary/PendingAppointmentsList';
import AppointmentScheduler from '../organism/secretary/AppointmentScheduler';
import { MdCheckCircle, MdError } from 'react-icons/md';

const API_BASE_URL = '/api';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

interface Appointment {
  patient_appointment_id: number;
  appointment_id: number;
  patient_name: string;
  patient_parent_last_name: string;
  patient_maternal_last_name: string;
  appointment_type: string;
  created_at: string;
}

interface Doctor {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
}

const SecretaryPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const response = await axios.get('/agenda/appointment-requests');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showNotification('error', 'Error al cargar las citas solicitadas');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/agenda/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDoctorChange = async (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setAvailableSlots([]);
    setSelectedTime('');
    if (selectedDate) {
      await fetchAvailability(doctorId, selectedDate);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setAvailableSlots([]);
    setSelectedTime('');
    if (selectedDoctor && date) {
      await fetchAvailability(selectedDoctor, date);
    }
  };

  const fetchAvailability = async (doctorId: string, date: string) => {
    try {
      const response = await axios.get(`/agenda/doctor/${doctorId}/availability?date=${date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots([]);
      showNotification('error', 'Error al obtener disponibilidad del doctor');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleSchedule = async () => {
    if (!selectedAppointment || !selectedDoctor || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const dateTime = `${selectedDate}T${selectedTime}:00.000Z`;
      await axios.post('/agenda/schedule', {
        patientAppointmentId: selectedAppointment.patient_appointment_id,
        doctorId: selectedDoctor,
        dateHour: dateTime,
      });
      
      const doctor = doctors.find(d => d.user_id === selectedDoctor);
      showNotification(
        'success', 
        `Cita agendada exitosamente para ${selectedAppointment.patient_name} ${selectedAppointment.patient_parent_last_name} con Dr. ${doctor?.name} el ${formatDate(selectedDate)} a las ${selectedTime}`
      );
      
      // Reset form
      fetchAppointments();
      setSelectedAppointment(null);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      setAvailableSlots([]);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      showNotification('error', 'Error al agendar la cita. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 w-full">
      <PendingAppointmentsList
        appointments={appointments}
        selectedAppointment={selectedAppointment}
        onSelectAppointment={setSelectedAppointment}
        loading={appointmentsLoading}
      />

      <div className="flex-1 min-w-0">
        <AppointmentScheduler
          selectedAppointment={selectedAppointment}
          doctors={doctors}
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          availableSlots={availableSlots}
          loading={loading}
          onDoctorChange={handleDoctorChange}
          onDateChange={handleDateChange}
          onTimeSelect={setSelectedTime}
          onSchedule={handleSchedule}
        />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={[
              "flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border-l-4",
              notification.type === 'success'
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800",
            ].join(" ")}
          >
            {notification.type === 'success' ? (
              <MdCheckCircle className="text-2xl text-green-600" />
            ) : (
              <MdError className="text-2xl text-red-600" />
            )}
            <p className="font-medium max-w-sm">{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretaryPage;
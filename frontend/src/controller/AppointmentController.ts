// controllers/AppointmentController.ts

import { Appointment, RescheduleData } from '../types/appointment';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class AppointmentController {

  /**
   * Cargar todas las citas
   */
  async loadAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar citas');
      }

      return response.json();
    } catch (error) {
      console.error('Error loading appointments:', error);
      throw error;
    }
  }

  /**
   * Cargar citas de un día específico
   */
  async loadAppointmentsByDay(date: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_URL}/api/appointments/day/${date}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar citas del día');
      }

      return response.json();
    } catch (error) {
      console.error('Error loading appointments by day:', error);
      throw error;
    }
  }

  /**
   * Reagendar cita
   */
  async rescheduleAppointment(id: number, data: RescheduleData): Promise<Appointment> {
    try {
      // Validaciones básicas del frontend
      if (!data.date_hour) throw new Error('Debe seleccionar fecha y hora');
      if (!data.reason) throw new Error('Debe especificar el motivo');

      const selectedDate = new Date(data.date_hour);
      const now = new Date();
      
      if (selectedDate < now) {
        throw new Error('No se puede agendar en el pasado');
      }

      const response = await fetch(`${API_URL}/api/appointments/${id}/reschedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al reagendar cita');
      }

      return response.json();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  }

  /**
   * Buscar citas por término
   */
  searchAppointments(appointments: Appointment[], searchTerm: string): Appointment[] {
    if (!searchTerm?.trim()) return appointments;

    const term = searchTerm.toLowerCase();
    return appointments.filter(apt => 
      apt.patient_name?.toLowerCase().includes(term) ||
      apt.reason?.toLowerCase().includes(term)
    );
  }

  /**
   * Formatear nombre completo del paciente
   */
  getFullPatientName(appointment: Appointment): string {
    const parts = [
      appointment.patient_name,
      appointment.patient_parent_last_name,
      appointment.patient_maternal_last_name
    ].filter(Boolean);
    
    return parts.join(' ');
  }

  /**
   * Formatear fecha para display (DD/MM/YYYY)
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatear hora (HH:MM)
   */
  formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Ordenar citas por fecha
   */
  sortByDate(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort((a, b) => {
      const dateA = new Date(a.date_hour);
      const dateB = new Date(b.date_hour);
      return dateA.getTime() - dateB.getTime();
    });
  }
}

export default new AppointmentController();
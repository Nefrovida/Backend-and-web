export interface AppointmentRequest {
  patient_appointment_id: number;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  appointment_name: string;
  appointment_type: 'PRESENCIAL' | 'VIRTUAL';
  requested_date: string;
  duration: number;
  current_doctor: string | null;
}

export interface Doctor {
  doctor_id: string;
  name: string;
  specialty: string;
}

export interface ScheduleAppointmentData {
  patientAppointmentId: number;
  doctorId: string;
  dateHour: string;
  duration: number;
  appointmentType: 'PRESENCIAL' | 'VIRTUAL';
  place?: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  date_hour: Date | string;
  reason: string;
  status: string;
  patient_name?: string;
  patient_parent_last_name?: string;
  patient_maternal_last_name?: string;
}

export interface RescheduleData {
  date_hour: string;
  reason: string;
}
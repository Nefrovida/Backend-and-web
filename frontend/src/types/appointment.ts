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

export interface Patient {
  patient_id: string;
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  full_name: string;
  phone_number?: string;
  birthday?: Date;
  gender?: string;
}

export interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  dateHour: string;
  duration: number;
  appointmentType: 'PRESENCIAL' | 'VIRTUAL';
  place?: string;
}

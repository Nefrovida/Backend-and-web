export enum Status {
  MISSED = "MISSED",
  CANCELED = "CANCELED",
  FINISHED = "FINISHED",
  PROGRAMMED = "PROGRAMMED",
}

export enum AppointmentType {
  PRESENCIAL = "PRESENCIAL",
  VIRTUAL = "VIRTUAL",
}

export interface User {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string | null;
  phone_number: string;
  username: string;
  birthday: string;
  gender: string;
}

export interface Patient {
  patient_id: string;
  user_id: string;
  curp: string;
  user: User;
}

export interface Doctor {
  doctor_id: string;
  user_id: string;
  speciality: string;
  license: string;
  user: User;
}

export interface Appointment {
  appointment_id: number;
  doctor_id: string;
  name: string;
  general_cost: string;
  community_cost: string;
  doctor: Doctor;
}

export interface PatientAppointment {
  patient_appointment_id: number;
  patient_id: string;
  appointment_id: number;
  date_hour: string;
  duration: number;
  appointment_type: AppointmentType;
  link: string | null;
  place: string | null;
  appointment_status: Status;
  appointment: Appointment;
  patient: Patient;
}

export interface AppointmentsResponse {
  success: boolean;
  data: PatientAppointment[];
}

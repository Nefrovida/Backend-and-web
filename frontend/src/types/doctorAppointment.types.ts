export interface DoctorAppointment {
  patient_appointment_id: number;
  patient_id: string;
  appointment_id: number;
  date_hour: string; // ISO datetime
  cost: string;
  status: string;
  appointment_name: string;
  appointment_general_cost: string;
  appointment_community_cost: string;
  appointment_image_url: string | null;
  patient_name: string | null;
  patient_parent_last_name: string | null;
  patient_maternal_last_name: string | null;
  patient_phone: string | null;
  patient_birthday: string | null;
  patient_gender: string | null;
}

export interface DoctorAppointmentsResponse {
  appointments: DoctorAppointment[];
}

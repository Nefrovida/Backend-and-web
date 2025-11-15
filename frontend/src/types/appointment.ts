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
  date_hour: string; // ISO string
  reason: string;
}
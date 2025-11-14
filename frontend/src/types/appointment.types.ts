export interface AppointmentData {
  id: string;
  date: string;
  schedule: string;
  reason: string;
  consulting_room: number;
  patient: PatientInfo;
}

export interface PatientInfo {
  name: string;
  age: number;
  genre: string;
  diagnostic: string;
  LastAnalisisUrl: string; 
}
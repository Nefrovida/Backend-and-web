export interface AppointmentData {
  id: string;
  date: string;
  schedule: string;
  reason: string;
  consulting_room: number;
  patient: PacienteInfo;
}

export interface PacienteInfo {
  name: string;
  age: number;
  sex: string;
  diagnostic: string;
  LastAnalisisUrl: string; 
}
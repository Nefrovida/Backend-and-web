// Define la estructura de un registro de historial
export interface HistoryRecord {
  id: number;
  date: string;
  description: string;
  doctorId: number;
  doctorName: string; // O lo que sea que la API devuelva
}

// El tipo de dato que devuelve la API
export type PatientHistoryResponse = HistoryRecord[];
// Defines the structure of the history record
export interface HistoryRecord {
  id: number;
  date: string;
  description: string;
  doctorId: number;
  doctorName: string;
}

// Type of data that the API returns
export type PatientHistoryResponse = HistoryRecord[];

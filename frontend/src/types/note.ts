export interface Note {
  note_id: number;
  patient_id: string | null;
  patient_appointment_id: number | null;
  title: string;
  content: string;
  general_notes: string | null;
  ailments: string | null;
  prescription: string | null;
  additional_notes: string | null;
  visibility: boolean;
  creation_date: Date | string;
}

export interface CreateNotePayload {
  patientId: string;
  patient_appointment_id?: number;
  title: string;
  content?: string;
  general_notes?: string;
  ailments?: string;
  prescription?: string;
  additional_notes?: string;
  visibility?: boolean;
}

export interface NoteContent {
  general_notes: string;
  ailments: string;
  prescription: string;
  additional_notes: string;
  visibility: boolean;
}

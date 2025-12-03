import Notes from "../model/notes.model";

/**
 * Create a new clinical note
 */
export const createNote = async (data: {
  patient_id: string;
  patient_appointment_id?: number;
  title: string;
  content: string;
  general_notes?: string;
  ailments?: string;
  prescription?: string;
  visibility?: boolean;
}) => {
  return await Notes.createNote(data);
};

/**
 * Get notes by patient ID
 */
export const getNotesByPatient = async (page: number, patientId: string, filterByVisibility: boolean = false) => {
  return await Notes.getNotesByPatient(page, patientId, filterByVisibility);
};

import Notes from "../model/notes.model";

/**
 * Create a new clinical note
 */
export const createNote = async (data: {
  patient_id: string;
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
export const getNotesByPatient = async (patientId: string) => {
  return await Notes.getNotesByPatient(patientId);
};

/**
 * Result response DTO
 */
export interface ResultResponse {
  resultId: number;
  patientAnalysisId: number;
  date: string; // ISO string
  path: string;
  interpretation: string;
  recommendation: string,
  patientAnalysis: {
    patientAnalysisId: number;
    analysisDate: string;
    resultsDate: string;
    place: string;
    duration: number;
    analysisStatus: string;
    analysis: {
      analysisId: number;
      name: string;
      description: string;
    };
  };
}

/**
 * Note response DTO
 */
export interface NoteResponse {
  noteId: number;
  patientAppointmentId: number;
  patientId: string;

  title: string;
  content: string;

  ailments: string;           
  generalNotes: string;       
  prescription: string;       
  visibility: boolean;

  createdAt: string;          

  appointment: {
    appointmentId: number;
    date: string;
    duration: number;
    type: string;
    place: string | null;
    status: string;
  };
}
  
/**
 * Risk question response DTO
 */
export interface RiskQuestionResponse {
  questionId: number;
  description: string;
  type: string;
  options?: RiskOptionResponse[];
}

/**
 * Risk option response DTO
 */
export interface RiskOptionResponse {
  optionId: number;
  questionId: number;
  description: string;
}

/**
 * Get result query params
 */
export interface GetResultParams {
  patient_analysis_id: number;
}
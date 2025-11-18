// Types for Medical Record (Expediente)

export interface MedicalRecordPatient {
  patient_id: string;
  curp: string;
  user: {
    user_id: string;
    name: string;
    parent_last_name: string;
    maternal_last_name: string;
    phone_number: string;
    birthday: Date;
    gender: string;
  };
}

export interface MedicalRecordAppointment {
  patient_appointment_id: string;
  date_hour: Date;
  duration: number;
  appointment_type: string;
  appointment_status: string;
  link: string | null;
  place: string | null;
  appointment: {
    appointment_id: string;
    name: string;
    general_cost: number;
    community_cost: number;
    image_url: string | null;
    doctor: {
      specialty: string;
      license: string;
      user: {
        name: string;
        parent_last_name: string;
        maternal_last_name: string;
      };
    };
  };
}

export interface MedicalRecordNote {
  note_id: string;
  title: string | null;
  content: string | null;
  general_notes: string | null;
  ailments: string | null;
  prescription: string | null;
  visibility: string;
  creation_date: Date;
  patient_appointment_id: string | null;
}

export interface MedicalRecordAnalysis {
  patient_analysis_id: string;
  analysis_date: Date;
  results_date: Date | null;
  analysis_status: string;
  place: string | null;
  duration: number | null;
  analysis: {
    analysis_id: string;
    name: string;
    description: string;
    previous_requirements: string | null;
    general_cost: number;
    community_cost: number;
    image_url: string | null;
  };
  laboratorist: {
    laboratorist_id: string;
    user: {
      name: string;
      parent_last_name: string;
      maternal_last_name: string;
    };
  } | null;
  results: {
    result_id: string;
    date: Date;
    path: string;
    interpretation: string | null;
  } | null;
}

export interface ClinicalHistoryItem {
  question_id: number;
  patient_id: string;
  answer: string;
  question: {
    description: string;
    type: string;
  };
}

export interface UserReport {
  report_id: string;
  user_id: string;
  reported_message: string | null;
  cause: string;
  date: Date;
  status: string;
}

export interface MedicalRecordData {
  patient: MedicalRecordPatient;
  appointments: MedicalRecordAppointment[];
  notes: MedicalRecordNote[];
  analysis: MedicalRecordAnalysis[];
  clinicalHistory: ClinicalHistoryItem[];
  reports: UserReport[];
}

// Form data types for creating/editing medical record
export interface PersonalInfoFormData {
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  curp: string;
  birthday: string;
  gender: string;
  phone_number: string;
  address: string;
}

export interface MedicalHistoryFormData {
  allergies: string;
  previous_illnesses: string;
  previous_surgeries: string;
  previous_hospitalizations: string;
  current_medications: string;
  previous_medications: string;
  drug_consumption: string;
  other_conditions: string;
}

export interface LabResultFormData {
  file?: File | null;
  files?: File[];
  interpretation?: string;
  interpretations?: string[];
}

export interface MedicalRecordFormData {
  personalInfo: PersonalInfoFormData;
  medicalHistory: MedicalHistoryFormData;
  labResult: LabResultFormData;
}

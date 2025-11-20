export interface MedicalRecordData {
  patient: {
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
  };
  appointments: Array<{
    patient_appointment_id: number;
    date_hour: Date;
    duration: number;
    appointment_type: string;
    appointment_status: string;
    link?: string | null;
    place?: string | null;
    appointment: {
      appointment_id: number;
      name: string;
      general_cost: number;
      community_cost: number;
      image_url?: string | null;
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
  }>;
  notes: Array<{
    note_id: number;
    title: string;
    content: string;
    general_notes?: string | null;
    ailments?: string | null;
    prescription?: string | null;
    visibility: boolean;
    creation_date: Date;
    patient_appointment_id?: number | null;
  }>;
  analysis: Array<{
    patient_analysis_id: number;
    analysis_date: Date;
    results_date: Date;
    analysis_status: string;
    place: string;
    duration: number;
    analysis: {
      analysis_id: number;
      name: string;
      description: string;
      previous_requirements: string;
      general_cost: number;
      community_cost: number;
      image_url?: string | null;
    };
    laboratorist: {
      laboratorist_id: string;
      user: {
        name: string;
        parent_last_name: string;
        maternal_last_name: string;
      };
    };
    results?: {
      result_id: number;
      date: Date;
      path: string;
      interpretation: string;
    } | null;
  }>;
  clinicalHistory: Array<{
    question_id: number;
    patient_id: string;
    answer: string;
    question: {
      description: string;
      type: string;
    };
  }>;
  reports: Array<{
    report_id: number;
    user_id: string;
    reported_message: number;
    cause: string;
    date: Date;
    status: boolean;
  }>;
}
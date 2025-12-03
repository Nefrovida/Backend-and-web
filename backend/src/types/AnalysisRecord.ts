export type AnalysisRecord = {
  patient_analysis_id: number;
  analysis_date: Date;
  analysis: {
    analysis_id: number;
    name: string;
  };
  patient: {
    patient_id: string;
    user: {
      name: string;
      parent_last_name: string;
      maternal_last_name: string | null;
    };
  };
};
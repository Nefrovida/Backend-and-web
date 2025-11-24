export type analysisHistory = {
  analysis: { name: string };
  results: { path: string; interpretation: string };
  patient_analysis_id: number;
  analysis_date: Date;
};

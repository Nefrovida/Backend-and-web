export interface AnalysisResultItem {
  id: number;            
  name: string;          
  date: string;          
  pdfUrl: string | null; 
}


export interface AnalysisHistoryResponse {
  success: boolean;
  message: string;
  data: AnalysisResultItem[];
}

export interface RawAnalysisData {
  patient_analysis_id: number;
  analysis_date: Date;
  analysis: {
    name: string;
  };
  results: {
    path: string;
  } | null; 
}
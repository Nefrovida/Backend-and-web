export interface CreateAnalysisData {
  name: string;
  description: string;
  previousRequirements: string;
  generalCost: number;
  communityCost: number;
}

export interface AnalysisResponse {
  analysisId: number;
  name: string;
  description: string;
  previousRequirements: string;
  generalCost: string; // formatted
  communityCost: string; // formatted
}

export interface UpdateAnalysisData {
  name?: string;
  description?: string;
  previousRequirements?: string;
  generalCost?: number;
  communityCost?: number;
}

/**
 * Create analysis request DTO
 */
export interface CreateAnalysisRequest {
  name: string;
  description: string;
  previousRequirements: string;
  generalCost: number;
  communityCost: number;
}

/**
 * Analysis response DTO
 */
export interface AnalysisResponse {
  analysisId: number;
  name: string;
  description: string;
  previousRequirements: string;
  generalCost: string;
  communityCost: string;
}

/**
 * Update analysis request DTO
 */
export interface UpdateAnalysisRequest {
  name?: string;
  description?: string;
  previousRequirements?: string;
  generalCost?: number;
  communityCost?: number;
}
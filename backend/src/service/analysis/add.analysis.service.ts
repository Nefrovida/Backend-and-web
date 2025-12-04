// backend/src/service/analysis/add.analysis.service.ts
import * as analysisModel from '../../model/analysis/add.analysis.model';

/**
 * Get analysis by name
 */
export const getAnalysisByName = async (analysisName: string) => {
  const analysis = await analysisModel.findByName(analysisName);
  if (!analysis) {
    throw new NotFoundError('Analysis not found');
  }
  return analysis;
};
import {
  CreateAnalysisRequest,
  AnalysisResponse,
  UpdateAnalysisRequest,
} from '../../types/analysis/add.analysis.types';
import { NotFoundError, ConflictError } from '../../util/errors.util';

/**
 * Format cost to MXN with 2 decimals
 */
const formatCost = (cost: number): string => {
  return cost.toFixed(2);
};

/**
 * Transform database analysis to response format
 */
const transformAnalysisToResponse = (analysis: any): AnalysisResponse => {
  return {
    analysisId: analysis.analysis_id,
    name: analysis.name,
    description: analysis.description,
    previousRequirements: analysis.previous_requirements,
    generalCost: formatCost(analysis.general_cost),
    communityCost: formatCost(analysis.community_cost),
  };
};

/**
 * Create a new analysis
 */
export const createAnalysis = async (data: CreateAnalysisRequest) => {
  // Check if analysis with the same name already exists
  const existingAnalysis = await analysisModel.findByName(data.name);

  if (existingAnalysis) {
    throw new ConflictError('Ya existe un tipo de análisis con ese nombre');
  }

  try {
    // Create the analysis
    const analysis = await analysisModel.create({
      name: data.name,
      description: data.description,
      previous_requirements: data.previousRequirements,
      general_cost: data.generalCost,
      community_cost: data.communityCost,
    });

    return transformAnalysisToResponse(analysis);
  } catch (err: any) {
    const code = err?.code as string | undefined;

    if (code === '23505' || code === 'P2002') {
      throw new ConflictError('Ya existe un tipo de análisis con ese nombre');
    }

    throw err;
  }
};

/**
 * Get all analysis with pagination and search
 */
export const getAllAnalysis = async (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await analysisModel.count(search);

  // Get paginated results
  const analysis = await analysisModel.findAll(skip, limit, search);

  return {
    data: analysis.map(transformAnalysisToResponse),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get analysis by ID
 */
export const getAnalysisById = async (analysisId: number) => {
  const analysis = await analysisModel.findById(analysisId);

  if (!analysis) {
    throw new NotFoundError('Analysis not found');
  }

  return transformAnalysisToResponse(analysis);
};

/**
 * Update analysis by ID
 */
export const updateAnalysis = async (
  analysisId: number,
  updateData: UpdateAnalysisRequest
) => {
  // Check if analysis exists
  const existingAnalysis = await analysisModel.findById(analysisId);

  if (!existingAnalysis) {
    throw new NotFoundError('Analysis not found');
  }

  // If updating name, check for duplicates
  if (updateData.name) {
    const duplicateAnalysis = await analysisModel.findDuplicateName(
      updateData.name,
      analysisId
    );

    if (duplicateAnalysis) {
      throw new ConflictError('Ya existe un tipo de análisis con ese nombre');
    }
  }

  // Transform camelCase to snake_case for database
  const dbUpdateData: any = {};
  if (updateData.name) dbUpdateData.name = updateData.name;
  if (updateData.description) dbUpdateData.description = updateData.description;
  if (updateData.previousRequirements)
    dbUpdateData.previous_requirements = updateData.previousRequirements;
  if (updateData.generalCost) dbUpdateData.general_cost = updateData.generalCost;
  if (updateData.communityCost)
    dbUpdateData.community_cost = updateData.communityCost;

  try {
    // Update analysis
    const updatedAnalysis = await analysisModel.update(
      analysisId,
      dbUpdateData
    );

    return transformAnalysisToResponse(updatedAnalysis);
  } catch (err: any) {
    const code = err?.code as string | undefined;

    if (code === '23505' || code === 'P2002') {
      throw new ConflictError('Ya existe un tipo de análisis con ese nombre');
    }

    throw err;
  }
};

/**
 * Delete analysis by ID
 */
export const deleteAnalysis = async (analysisId: number) => {
  const analysis = await analysisModel.findById(analysisId);

  if (!analysis) {
    throw new NotFoundError('Analysis not found');
  }

  // Do not allow deletion if analysis is referenced by any patient_analysis
  const references = await analysisModel.countPatientAnalysisReferences(
    analysisId
  );
  if (references > 0) {
    throw new ConflictError(
      'Cannot delete analysis that has patient requests'
    );
  }

  await analysisModel.deleteById(analysisId);
};
import { Request, Response } from 'express';
import Report from '../../model/report.model';
import { ResultResponse, RiskQuestionResponse, RiskOptionResponse } from '../../types/report.types';
import { NotFoundError } from '../../util/errors.util';

/**
 * Transform database result to response format
 */
const transformResultToResponse = (result: any): ResultResponse => {
  return {
    resultId: result.result_id,
    patientAnalysisId: result.patient_analysis_id,
    date: result.date.toISOString(),
    path: result.path,
    interpretation: result.interpretation,
    patientAnalysis: {
      patientAnalysisId: result.patient_analysis.patient_analysis_id,
      analysisDate: result.patient_analysis.analysis_date.toISOString(),
      resultsDate: result.patient_analysis.results_date.toISOString(),
      place: result.patient_analysis.place,
      duration: result.patient_analysis.duration,
      analysisStatus: result.patient_analysis.analysis_status,
      analysis: {
        analysisId: result.patient_analysis.analysis.analysis_id,
        name: result.patient_analysis.analysis.name,
        description: result.patient_analysis.analysis.description,
      },
    },
  };
};

/**
 * Transform risk question to response format
 */
const transformQuestionToResponse = (question: any): RiskQuestionResponse => {
  return {
    questionId: question.question_id,
    description: question.description,
    type: question.type,
    options: question.options?.map((opt: any) => ({
      optionId: opt.option_id,
      questionId: opt.question_id,
      description: opt.description,
    })),
  };
};

/**
 * Transform risk option to response format
 */
const transformOptionToResponse = (option: any): RiskOptionResponse => {
  return {
    optionId: option.option_id,
    questionId: option.question_id,
    description: option.description,
  };
};

/**
 * Get result by patient analysis ID
 */
export const getResultById = async (patientAnalysisId: number) => {
  const result = await Report.getResult(patientAnalysisId);

  if (!result) {
    throw new NotFoundError(`No result found for patient_analysis_id ${patientAnalysisId}`);
  }

  return transformResultToResponse(result);
};

/**
 * Get results by patient user ID
 */
export const getResultsByUserId = async (userId: string) => {
  const results = await Report.getResultsByUserId(userId);

  if (results.length === 0) {
    return [];
  }

  return results.map(transformResultToResponse);
};

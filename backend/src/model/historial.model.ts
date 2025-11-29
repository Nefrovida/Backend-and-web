import { ANALYSIS_STATUS } from "@prisma/client";
import { prisma } from "../util/prisma.js";

export default class Historial {
  Historial() {}

  /**
   * Get analysis history for a specific patient
   * @param patientId - The patient's UUID
   * @param pagination - Page number (0-indexed)
   * @param filter - Optional filters for the query
   * @returns Array of patient analysis records with details
   */
  static async getPatientAnalysisHistory(
    patientId: string,
    pagination: number = 0,
    filter?: {
      start?: string | null;
      end?: string | null;
      analysisType?: number[];
      status?: ANALYSIS_STATUS[] | null;
    }
  ) {
    const paginationSkip = 10;

    const patientAnalysisHistory = await prisma.patient_analysis.findMany({
      where: {
        patient_id: patientId,
        ...(filter?.start || filter?.end
          ? {
              analysis_date: {
                ...(filter.start ? { gte: filter.start } : {}),
                ...(filter.end ? { lte: filter.end } : {}),
              },
            }
          : {}),
        ...(filter?.analysisType && filter.analysisType.length > 0
          ? { analysis_id: { in: filter.analysisType } }
          : {}),
        ...(filter?.status
          ? {
              analysis_status: {
                in: filter.status,
              },
            }
          : {}),
      },
      orderBy: [
        { analysis_status: "desc" },
        { analysis_date: "desc" },
      ],
      select: {
        patient_analysis_id: true,
        analysis_date: true,
        results_date: true,
        analysis_status: true,
        place: true,
        duration: true,
        analysis: {
          select: {
            analysis_id: true,
            name: true,
            description: true,
            previous_requirements: true,
            general_cost: true,
            community_cost: true,
          },
        },
        laboratorist: {
          select: {
            laboratorist_id: true,
            user: {
              select: {
                name: true,
                parent_last_name: true,
                maternal_last_name: true,
              },
            },
          },
        },
        results: {
          select: {
            result_id: true,
            date: true,
            path: true,
            interpretation: true,
            recommendation: true,
          },
        },
      },
      take: paginationSkip,
      skip: pagination * paginationSkip,
    });

    return patientAnalysisHistory;
  }

  /**
   * Get a specific analysis result for a patient
   * @param patientId - The patient's UUID
   * @param analysisId - The patient_analysis_id
   * @returns Single patient analysis record with full details
   */
  static async getPatientAnalysisById(
    patientId: string,
    analysisId: number
  ) {
    const analysisRecord = await prisma.patient_analysis.findFirst({
      where: {
        patient_analysis_id: analysisId,
        patient_id: patientId,
      },
      select: {
        patient_analysis_id: true,
        analysis_date: true,
        results_date: true,
        analysis_status: true,
        place: true,
        duration: true,
        analysis: {
          select: {
            analysis_id: true,
            name: true,
            description: true,
            previous_requirements: true,
            general_cost: true,
            community_cost: true,
            image_url: true,
          },
        },
        laboratorist: {
          select: {
            laboratorist_id: true,
            user: {
              select: {
                name: true,
                parent_last_name: true,
                maternal_last_name: true,
                phone_number: true,
              },
            },
          },
        },
        results: {
          select: {
            result_id: true,
            date: true,
            path: true,
            interpretation: true,
            recommendation: true,
          },
        },
      },
    });

    return analysisRecord;
  }
}

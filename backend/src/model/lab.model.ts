import { ANALYSIS_STATUS } from "@prisma/client";
import { prisma } from "../util/prisma.js";

export default class Laboratory {
  Laboratory() {

  }

  static async getLabResults(pagination: number = 0, 
    filter: {
      name?: string | null, 
      start?: string | null, 
      end?: string | null,  
      analysisType?: number[],
      status?: ANALYSIS_STATUS[] | null
    }) {
    const paginationSkip = 10;
    
    const patientResults = await prisma.patient_analysis.findMany({
      where: {
        ...(filter.name
            ? {
                patient: {
                  user: {
                    name: {
                      contains: filter.name,
                      mode: "insensitive",
                    },
                  },
                },
              }
            : {}),
        ...(filter.start || filter.end
        ? {
            analysis_date: {
              ...(filter.start ? { gte: filter.start } : {}),
              ...(filter.end ? { lte: filter.end } : {}),
            },
          }
        : {}),
        ...(filter.analysisType && filter.analysisType.length > 0
        ? { analysis_id: { in: filter.analysisType } }
        : {}),
        ...(filter?.status ? {analysis_status: {
          in: filter?.status
        }} : {})
      },
      orderBy: [
        {analysis_status: "desc"},
        {analysis_date: "desc"},
      ],
      select: {
        patient_analysis_id: true,
        analysis_date: true,
        results_date: true,
        analysis_status: true,
        patient: {
          select: {
            user: {
              select: {
                name: true,
                parent_last_name: true,
                maternal_last_name: true,
              }
            }
          }
        },
      },
      take: paginationSkip,
      skip: pagination * paginationSkip
    });
    return patientResults;
  }

  static async getAnalysis() {
    const analysis = await prisma.analysis.findMany({
      select: {
        analysis_id: true,
        name: true
      }
    });
    return analysis
  }
}
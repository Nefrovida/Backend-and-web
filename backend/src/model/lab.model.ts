import { ANALYSIS_STATUS } from "../../prisma/database/prisma/index.js";
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

  static async getLabAppointmentsForUpload(page: number = 0, pageSize: number = 10) {
    const rows = await prisma.patient_analysis.findMany({
      orderBy: [
        { analysis_date: "desc" },
      ],
      skip: page * pageSize,
      take: pageSize,
      select: {
        patient_analysis_id: true,
        analysis_date: true,
        analysis_status: true,
        analysis: {
          select: {
            name: true,
          },
        },
        patient: {
          select: {
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
            path: true,
          },
        },
      },
    });

    return rows.map((r: any) => ({
      id: r.patient_analysis_id,
      date: r.analysis_date,
      status: r.analysis_status,
      analysisName: r.analysis.name,
      patientName: `${r.patient.user.name} ${r.patient.user.parent_last_name} ${r.patient.user.maternal_last_name}`.trim(),
      resultURI: r.results?.path ?? null,
    }));
  }

  static async confirmLabAppointmentResult(patientAnalysisId: number, fileUri: string) {
    await prisma.$transaction(async (tx: any) => {
      await tx.results.upsert({
        where: { patient_analysis_id: patientAnalysisId },
        update: {
          path: fileUri,
          date: new Date(),
        },
        create: {
          patient_analysis_id: patientAnalysisId,
          path: fileUri,
          date: new Date(),
          interpretation: "",
        },
      });

      await tx.patient_analysis.update({
        where: { patient_analysis_id: patientAnalysisId },
        data: {
          analysis_status: "SENT",
          results_date: new Date(),
        },
      });
    });
  }
}
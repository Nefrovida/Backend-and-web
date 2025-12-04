import { ANALYSIS_STATUS, Prisma } from "@prisma/client";
import { prisma } from "../util/prisma";

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
        ...(filter?.status ? {
          analysis_status: {
            in: filter?.status
          }
        } : {})
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

  static async confirmLabAppointmentResult(
    patientAnalysisId: number,
    fileUri: string
  ) {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Verify it exists and that it is in REQUESTED status
      const existing = await tx.patient_analysis.findUnique({
        where: { patient_analysis_id: patientAnalysisId },
        select: { analysis_status: true },
      });

      if (!existing) {
        throw new Error("La cita de laboratorio no existe.");
      }

      // Only allow uploading results when the study is already in the laboratory (LAB)
      if (existing.analysis_status !== ANALYSIS_STATUS.LAB) {
        throw new Error(
          "Solo se pueden subir resultados para estudios que ya están en laboratorio (estado LAB)."
        );
      }

      // Save/update result
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

      // Update appointment status
      await tx.patient_analysis.update({
        where: { patient_analysis_id: patientAnalysisId },
        data: {
          analysis_status: ANALYSIS_STATUS.SENT,
          results_date: new Date(),
        },
      });
    });
  }

  static async getFullLabResults(
    patient_analysis_id: number
  ) {
    try {
      const analysis_res = await prisma.patient_analysis.findUnique({
        where: { patient_analysis_id: patient_analysis_id },
        include: {
          analysis: true
        }
      });
      const results_res = await prisma.results.findUnique({
        where: { patient_analysis_id: patient_analysis_id }
      });

      const result = {
        analysis: analysis_res,
        results: results_res
      };

      return result;
    } catch (error) {
      throw new Error("request to db for patient analysis results failed");
    }
  }

  static async generateReport(
    patient_analysis_id: number,
    interpretations: string,
    recommendations: string) {
    try {
      await prisma.results.update({
        where: { patient_analysis_id: patient_analysis_id },
        data: {
          interpretation: interpretations,
          recommendation: recommendations,
          updated: new Date(),
        },
      })
      return { success: true }
    } catch (error) {
      console.error("Error creating lab report in db: ", error);
      throw new Error(`Error creating lab report in db ${error}`);
    }
  }
}
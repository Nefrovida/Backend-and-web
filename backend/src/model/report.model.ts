import { prisma } from "../util/prisma";

export default class Report {
  Report() {}

  static async getResult(patientAnalysisId: number) {
    return prisma.results.findFirst({
      where: {
        patient_analysis_id: patientAnalysisId,
      },
      include: {
        patient_analysis: {
          include: {
            analysis: true,
          },
        },
      },
    });
  }

  static async getResultByUserId(userId: string) {
    const patient = await prisma.patients.findFirst({
      where: { user_id: userId },
    });

    if (!patient) return null;

    const analysis = await prisma.patient_analysis.findFirst({
      where: { patient_id: patient.patient_id },
    });

    if (!analysis) return null;

    return prisma.results.findFirst({
      where: {
        patient_analysis_id: analysis.patient_analysis_id,
      },
      include: {
        patient_analysis: {
          include: {
            analysis: true
          },
        },
      },
    });
  }

}
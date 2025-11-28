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

  static async getResultsByUserId(userId: string) {
  
  const patient = await prisma.patients.findFirst({
    where: { user_id: userId },
  });

  if (!patient) return [];


  const analysis = await prisma.patient_analysis.findMany({
    where: { patient_id: patient.patient_id },
  });

  if (analysis.length === 0) return [];

  const analysisIds = analysis.map(a => a.patient_analysis_id);

  return prisma.results.findMany({
    where: {
      patient_analysis_id: { in: analysisIds },
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

}
import { prisma } from "../util/prisma.js";

export default class Report {
  Report() {

  }

  static async getResult(patientAnalysisId: number) {
    
  return prisma.results.findFirst({
      where: {
        patient_analysis_id: patientAnalysisId
      },
      include: {
        patient_analysis: {
          include: {
              analysis: true,
          }
        }
      }
      });
  }

  static async getRiskQuestions() {
    return prisma.questions_history.findMany();
  }

  static async getRiskOptions() {
    return prisma.options.findMany();
  }
}
import { report } from "process";
import { PrismaClient } from "../../prisma/database/prisma";

const prisma = new PrismaClient;

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
}
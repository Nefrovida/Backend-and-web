import { PrismaClient, ANALYSIS_STATUS } from "@client";

const prisma = new PrismaClient;

export default class Laboratory {
  Laboratory() {

  }

  static async getLabResults(pagination: number = 0, filter?: {patientId?: string, status?: ANALYSIS_STATUS}) {
    const paginationSkip = 10;
    
    const patientResults = await prisma.patient_analysis.findMany({
      where: {
        ...(filter?.patientId ? {patient_id: filter?.patientId} : {}),
        ...(filter?.status ? {analysis_status: filter?.status} : {})
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
}
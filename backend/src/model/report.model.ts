import { report } from "process";
import { PrismaClient } from "../../prisma/database/prisma";

const prisma = new PrismaClient;

export default class Report {
  Report() {

  }

  static async getResult(patient_analysis_id: number) {
    
  const reportInfo = await prisma.results.findFirst({
    where: {
      patient_analysis_id
    },
    include: {
      patient_analysis: true
    }
  });

  if (!reportInfo) {
    return null;
  }

  if (reportInfo.route) {
    reportInfo.route = reportInfo.route.trim();
  }



  console.log(reportInfo?.route);


    return reportInfo;
  }
}
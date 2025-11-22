import { prisma } from '../util/prisma';


export const findPatientByUserId = async (userId: string) => {
  return prisma.patients.findFirst({
    where: { user_id: userId },
  });
};


export const findAnalysisResultsByPatientId = async (patientId: string) => {
  return prisma.patient_analysis.findMany({
    where: { patient_id: patientId },
    orderBy: {
      analysis_date: 'desc',
    },
    include: {
      analysis: true,
      results: true,  
    },
  });
};
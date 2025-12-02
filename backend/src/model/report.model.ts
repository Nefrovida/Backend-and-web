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

  static async getResultsAndNotesByUserId(userId: string) {
  const patient = await prisma.patients.findFirst({
    where: { user_id: userId },
  });

  if (!patient) return { results: [], notes: [] };

  // ANALYSIS IDS
  const analysis = await prisma.patient_analysis.findMany({
    where: { patient_id: patient.patient_id },
  });

  const analysisIds = analysis.map(a => a.patient_analysis_id);

  // APPOINTMENT IDS
  const appointments = await prisma.patient_appointment.findMany({
    where: { patient_id: patient.patient_id },
  });

  const appointmentIds = appointments.map(a => a.patient_appointment_id);

  // RESULTS QUERY
  const results = await prisma.results.findMany({
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
    orderBy: { date: "desc" },
  });

  // NOTES QUERY
  const notes = await prisma.notes.findMany({
    where: {
      patient_appointment_id: { in: appointmentIds },
      visibility: true,
    },
    include: {
      patient_appointment: true,
    },
    orderBy: { creation_date: "desc" },
  });

  return { results, notes };
}

}
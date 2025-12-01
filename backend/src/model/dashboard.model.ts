import { ANALYSIS_STATUS, Status } from "@prisma/client";
import { DoctorDashboardInfo } from "../types/dashboard/dashboard.types";
import { prisma } from "../util/prisma";

export default class Dashboard {
  Dashboard() {}

  static async getDoctorData(userId: string) {
    const doctor = await prisma.doctors.findUnique({
      where: { user_id: userId },
      select: { doctor_id: true },
    });

    const doctorId = doctor!.doctor_id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // --------- 1. Citas agendadas hoy ----------
    const appointmentsToday = await prisma.patient_appointment.count({
      where: {
        appointment: {
          doctor_id: doctorId,
        },
        date_hour: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // --------- 2. Expedientes activos ----------
    const activePatients = await prisma.patient_appointment.groupBy({
      by: ["patient_id"],
      where: {
        appointment: {
          doctor_id: doctorId,
        },
      },
    });

    const activeCount = activePatients.length;
    const patientIds = activePatients.map((p) => p.patient_id);

    // --------- 3. Resultados pendientes ----------
    const pendingResults = await prisma.patient_analysis.count({
      where: {
        patient_id: { in: patientIds },
        analysis_status: "REQUESTED", // o "PENDING" dependiendo tu enum
      },
    });

    return {
      appointments: appointmentsToday,
      active: activeCount,
      pending: pendingResults,
    } as DoctorDashboardInfo;
  }
}

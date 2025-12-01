import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all appointments for a specific patient
 * @route GET /api/appointments/patient/:patientId
 */
async function getPatientAppointments(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const userId = req.user!.userId;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Verify that the patient belongs to the authenticated doctor
    const patientBelongsToDoctor = await prisma.patient_appointment.findFirst({
      where: {
        patient_id: patientId,
        appointment: {
          doctor: {
            user_id: userId,
          },
        },
      },
    });

    if (!patientBelongsToDoctor) {
      return res
        .status(403)
        .json({ error: "Forbidden: patient does not belong to this doctor" });
    }

    // Get all appointments for the patient
    const appointments = await prisma.patient_appointment.findMany({
      where: {
        patient_id: patientId,
        appointment: {
          doctor: {
            user_id: userId,
          },
        },
      },
      include: {
        appointment: {
          select: {
            appointment_id: true,
            name: true,
            general_cost: true,
            community_cost: true,
          },
        },
      },
      orderBy: {
        date_hour: "desc",
      },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
}

export default getPatientAppointments;

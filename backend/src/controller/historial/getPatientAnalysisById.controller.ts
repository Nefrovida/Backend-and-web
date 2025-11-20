import { type Request, type Response } from "express";
import Historial from "../../model/historial.model";

/**
 * Get a specific analysis record by ID for the authenticated patient
 * Requires authenticated user with patient context
 */
async function getPatientAnalysisById(req: Request, res: Response) {
  try {
    // Extract patient_id from session/authenticated user
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get patient_id from the user
    const { prisma } = await import("../../util/prisma.js");
    const patient = await prisma.patients.findFirst({
      where: { user_id: userId },
      select: { patient_id: true }
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found for this user" });
    }

    // Get analysis ID from route params
    const analysisId = Number(req.params.id);

    if (isNaN(analysisId)) {
      return res.status(400).json({ error: "Invalid analysis ID" });
    }

    // Query specific analysis record
    const analysisRecord = await Historial.getPatientAnalysisById(
      patient.patient_id,
      analysisId
    );

    if (!analysisRecord) {
      return res.status(404).json({ error: "Analysis record not found" });
    }

    res.json(analysisRecord);
  } catch (error) {
    console.error("Error fetching patient analysis by ID:", error);
    res.status(500).json({ error: "Failed to fetch analysis record" });
  }
}

export default getPatientAnalysisById;

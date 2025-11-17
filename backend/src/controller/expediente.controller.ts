import { type Request, type Response } from "express";
import * as expedienteService from "../service/expediente.service";

/**
 * Get complete medical record for a patient
 * GET /api/patients/:patientId/expediente
 */
export const getMedicalRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { patientId } = req.params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(patientId)) {
      return res.status(400).json({
        error: "Invalid patient ID format",
      });
    }

    const medicalRecord = await expedienteService.getMedicalRecord(
      req.user.userId,
      patientId,
      req.user.roleId
    );

    return res.status(200).json(medicalRecord);
  } catch (error: any) {
    console.error("Error fetching medical record:", error);

    if (error.statusCode === 404) {
      return res.status(404).json({ error: error.message });
    }

    if (error.statusCode === 403) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Error fetching medical record",
    });
  }
};
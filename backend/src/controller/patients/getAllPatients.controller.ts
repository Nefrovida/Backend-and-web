import { type Request, type Response } from "express";
import Patients from "src/model/patient.model";

/**
 * Get all patients in the system
 */
async function getAllPatients(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const patients = await Patients.getAllPatients();

    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ 
      success: false,
      error: error.message 
    });
  }
}

export default getAllPatients;

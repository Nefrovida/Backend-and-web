import { type Request, type Response } from "express";
import Patients from "src/model/patient.model";

/**
 * Get all patients assigned to the authenticated doctor
 */
async function getDoctorPatients(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const doctorId = req.user.userId;
    const assignments = await Patients.getMyPatients(doctorId);
    const myPatients = assignments.map(assignment => assignment.patient);

    res.status(200).json(myPatients);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

export default getDoctorPatients;
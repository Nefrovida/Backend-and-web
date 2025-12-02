import { type Request, type Response } from "express";
import Patients from "src/model/patient.model";
import { getServices } from "#/src/service/services.catalog.service";

/**
 * Get all patients assigned to the authenticated doctor
 */
async function getAllServices(req: Request, res: Response) {
  try {

    const data = await getServices();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

export default getAllServices;
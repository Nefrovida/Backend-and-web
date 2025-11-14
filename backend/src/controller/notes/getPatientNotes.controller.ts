import { Request, Response } from "express";
import Patients from "src/model/patient.model";

async function getPatientNotes(req: Request, res: Response) {
  try {
    const userId = req.user!.userId

    const patients = await Patients.getMyPatients(userId)
      .then(patients => 
        patients.map(patient => patient.patient));

  } catch(e) {
    res.status(404).json({error: "User id not found"})
  }
}

export default getPatientNotes;
import { type Request, type Response } from "express";
import Patients from "src/model/patient.model";

async function getDoctorPatients(req: Request, res: Response) {
  try {
    const doctorId = req.user!.userId;
    const myPatients = await Patients.getMyPatients(doctorId)
      .then(patients => 
        patients.map(patient => patient.patient))

    res.status(200).json(Object.values(myPatients));
  } catch (error: any) {
    res.status(error.statusCode || 500).json({error: error.message})
  }
}

export default getDoctorPatients;
import { type Request, type Response } from "express";
import Patients from "src/model/patient.model";

/**
/**
 * Get all patients in the system (for secretaries to schedule appointments)
 */
async function getAllPatients(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const patients = await Patients.getAllPatients();
    
    // Flatten the user data for easier consumption
    const formattedPatients = patients.map(patient => ({
      patient_id: patient.patient_id,
      user_id: patient.user.user_id,
      name: patient.user.name,
      parent_last_name: patient.user.parent_last_name,
      maternal_last_name: patient.user.maternal_last_name,
      full_name: `${patient.user.name} ${patient.user.parent_last_name} ${patient.user.maternal_last_name}`,
      phone_number: patient.user.phone_number,
      birthday: patient.user.birthday,
      gender: patient.user.gender,
    }));

    res.status(200).json({
      success: true,
      data: formattedPatients
    });
  } catch (error: any) {
    console.error("Error fetching all patients:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      error: error.message || "Failed to fetch patients"
    });
  }
}
  }
}

export default getAllPatients;

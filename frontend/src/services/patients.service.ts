const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export interface Patient {
  patient_id: string;
  user_id: string;
  curp: string;
  user: {
    name?: string;
    parent_last_name?: string;
    maternal_last_name?: string;
  };
}

export interface PatientsResponse {
  success: boolean;
  data: Patient[];
}

export const patientsService = {
  /**
   * Get all patients in the system
   */
  async getAllPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    const result: PatientsResponse = await response.json();
    return result.data || [];
  },

  /**
   * Get patients assigned to the current doctor
   */
  async getDoctorPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients/doctorPatients`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch doctor's patients");
    }

    const data = await response.json();
    return data || [];
  },
};

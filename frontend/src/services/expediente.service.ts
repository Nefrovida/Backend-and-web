import { MedicalRecordData } from "../types/expediente.types";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export const expedienteService = {
  /**
   * Get complete medical record for a patient
   * @param patientId - The patient's UUID
   * @returns Complete medical record data
   */
  async getMedicalRecord(patientId: string): Promise<MedicalRecordData> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/expediente`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error fetching medical record");
    }

    return response.json();
  },
};

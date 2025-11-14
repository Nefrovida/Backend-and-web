import { 
  AddPatientToForumRequest, 
  AddPatientToForumResponse, 
  Forum, 
  Patient 
} from "../../types/forums/add_patient_to_forum.types";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export const addPatientToForumService = {
  /**
   * Añade un paciente a un foro privado
   */
  async addPatientToForum(
    forumId: number,
    data: AddPatientToForumRequest
  ): Promise<AddPatientToForumResponse> {
    const response = await fetch(`${API_BASE_URL}/forums/${forumId}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies (JWT in httpOnly)
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to add patient to forum");
    }

    return response.json();
  },

  /**
   * Obtiene la lista de foros (opcional, para selector)
   */
  async getForums(): Promise<Forum[]> {
    const response = await fetch(`${API_BASE_URL}/forums`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch forums");
    }

    const data = await response.json();
    return data.data || [];
  },

  /**
   * Obtiene la lista de pacientes (opcional, para selector)
   */
  async getPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    const data = await response.json();
    return data.data || [];
  },
};
import { 
  AddPatientToForumRequest, 
  AddPatientToForumResponse, 
  Forum, 
  Patient 
} from "../../types/forums/add_patient_to_forum.types";
import { API_BASE_URL } from "../../config/api.config";

export const addPatientToForumService = {
  /**
   * Add a patient to a forum
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
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || result.message || "Failed to add patient to forum");
    }

    return result;
  },

  /**
   * Gets the list of forums (optional, for selector)
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
   * Gets the list of forums (optional, for selector)
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
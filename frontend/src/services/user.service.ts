import { API_BASE_URL } from "../config/api.config";

export interface ExternalUser {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  phone_number: string;
  username: string;
  birthday: string;
  gender: string;
  registration_date: string;
  role_id: number;
  role_name: string;
}

export interface ConvertToPatientRequest {
  curp: string;
}

export interface ConvertToPatientResponse {
  success: boolean;
  message: string;
  patient_id: string;
}

export const userService = {
  /**
   * Get all external users (users without role-specific records)
   */
  async getExternalUsers(): Promise<ExternalUser[]> {
    const response = await fetch(`${API_BASE_URL}/users/external`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch external users");
    }

    return response.json();
  },

  /**
   * Check if a user is an external user
   */
  async isExternalUser(userId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/is-external`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to check user status");
    }

    const data = await response.json();
    return data.isExternal;
  },

  /**
   * Convert an external user to a patient (doctors only)
   */
  async convertUserToPatient(
    userId: string,
    curp: string
  ): Promise<ConvertToPatientResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/convert-to-patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ curp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to convert user to patient");
    }

    return response.json();
  },
};

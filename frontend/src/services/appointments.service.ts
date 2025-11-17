import { DoctorAppointment } from "../types/doctorAppointment.types";

const API_BASE_URL =
  (import.meta as any).env?.VITE_APP_API_URL || "http://localhost:3001/api";

export const appointmentsService = {
  async getMyAppointments(): Promise<DoctorAppointment[]> {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error?.error?.message ||
        error?.message ||
        "Failed to load appointments"
      );
    }

    return response.json();
  },
};

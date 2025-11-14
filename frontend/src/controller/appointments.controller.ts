import { AppointmentsResponse } from "../model/appointments.model";

// En desarrollo, el proxy redirige automáticamente a http://localhost:3001
// En producción, usa REACT_APP_API_URL del .env
const API_URL = process.env.REACT_APP_API_URL || "/api";

export async function getDoctorAppointments(
  userId: string
): Promise<AppointmentsResponse> {
  try {
    const response = await fetch(
      `${API_URL}/doctor-appointments/get-appointments/${userId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AppointmentsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    throw error;
  }
}

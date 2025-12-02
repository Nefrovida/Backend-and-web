import { AuthResponse } from "../types/auth.types";
import { DoctorInput } from "../types/doctor.types";


const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export const registerDoctor = async (
  adminAccount: AuthResponse["user"],
  doctorData: DoctorInput
) => {
  const response = await fetch(`${API_URL}/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      loggedUser: adminAccount,
      doctor: doctorData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    // Create an error with the response data attached
    const err = new Error(error.message || "Doctor registration failed");
    (err as any).response = {
      data: error,
      status: response.status,
    };
    throw err;
  }

  return response.json();
};

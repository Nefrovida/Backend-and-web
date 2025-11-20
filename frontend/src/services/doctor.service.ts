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
    throw new Error(error.message || "Doctor registration failed");
  }

  return response.json();
};

export const getDoctors = async () => {
  const response = await fetch(`${API_URL}/doctors`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch doctors");
  }

  return response.json();
};
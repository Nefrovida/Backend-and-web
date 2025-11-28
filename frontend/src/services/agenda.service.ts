import { AppointmentRequest, Doctor, ScheduleAppointmentData, Patient, CreateAppointmentData } from "../types/appointment";

const API_BASE_URL = (import.meta as any).env.VITE_APP_API_URL || "http://localhost:3001/api";

export const agendaService = {
  async getPendingRequests(): Promise<AppointmentRequest[]> {
    const response = await fetch(`${API_BASE_URL}/agenda/pending-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pending appointment requests");
    }

    return response.json();
  },

  async getDoctors(): Promise<Doctor[]> {
    const response = await fetch(`${API_BASE_URL}/agenda/doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }

    return response.json();
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/agenda/doctor-availability?doctorId=${doctorId}&date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch doctor availability");
    }

    return response.json();
  },

  async scheduleAppointment(data: ScheduleAppointmentData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agenda/schedule-appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to schedule appointment");
    }

    return response.json();
  },

  async getAllPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    const result = await response.json();
    // Endpoint returns { success: boolean, data: Patient[] }
    // Normalize to return only the array so callers can safely call patients.find
    return result && result.data ? result.data : [];
  },

  async createAppointment(data: CreateAppointmentData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agenda/create-appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create appointment");
    }

    return response.json();
  },
};

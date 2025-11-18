import { AppointmentRequest, Doctor, ScheduleAppointmentData, Patient, CreateAppointmentData } from "../types/appointment";

const API_BASE_URL = (import.meta as any).env.VITE_APP_API_URL || "http://localhost:3001";

export const agendaService = {
  async getPendingRequests(): Promise<AppointmentRequest[]> {
    const response = await fetch(`${API_BASE_URL}/api/agenda/pending-requests`, {
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
    const response = await fetch(`${API_BASE_URL}/api/agenda/doctors`, {
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
      `${API_BASE_URL}/api/agenda/doctor-availability?doctorId=${doctorId}&date=${date}`,
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
    const response = await fetch(`${API_BASE_URL}/api/agenda/schedule-appointment`, {
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
    const response = await fetch(`${API_BASE_URL}/api/patients/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    return response.json();
  },

  async createAppointment(data: CreateAppointmentData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/agenda/create-appointment`, {
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

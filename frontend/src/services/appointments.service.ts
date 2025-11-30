import { DoctorAppointment } from "../types/doctorAppointment.types";
import {
  AppointmentTypeResponse,
  CreateAppointmentTypeData,
  UpdateAppointmentTypeData,
} from "../types/add.appointment.types";

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


type AppointmentTypeListResponse = {
  success: boolean;
  message: string;
  data: AppointmentTypeResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const appointmentTypeService = {
  async getAll(): Promise<DoctorAppointment[]> {
  const res = await fetch(`${API_BASE_URL}/appointments/getAllAppointments`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error?.error?.message ||
        error?.message ||
        "Error al cargar servicios de citas"
    );
  }

  const json = await res.json();

  // map memo épico 💪
  return json.map((item: any) => ({
    appointmentId: item.appointment_id,
    doctorId: item.doctor_id,
    name: item.name?.trim() ?? "",
    cost: item.general_cost,
    communityCost: item.community_cost ?? null,
    imageUrl: item.image_url
  }));
},

  async create(data: CreateAppointmentTypeData) {
    const res = await fetch(`${API_BASE_URL}/appointment-types`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error?.error?.message ||
          error?.message ||
          "Error al crear tipo de cita"
      );
    }

    return res.json();
  },

  async update(id: number, data: UpdateAppointmentTypeData) {
    const res = await fetch(`${API_BASE_URL}/appointment-types/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error?.error?.message ||
          error?.message ||
          "Error al actualizar tipo de cita"
      );
    }

    return res.json();
  },

  async delete(id: number) {
    const res = await fetch(`${API_BASE_URL}/appointment-types/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error?.error?.message ||
          error?.message ||
          "Error al eliminar tipo de cita"
      );
    }

    return res.json();
  },
};
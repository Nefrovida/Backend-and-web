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

export const appointmentTypeService = {
  // ==============================
  // GET ALL
  // ==============================
  async getAll(): Promise<AppointmentTypeResponse[]> {
    const res = await fetch(`${API_BASE_URL}/appointments/getAllAppointments`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || "Error al cargar servicios");
    }

    const data = await res.json();

    return data.map((item: any) => ({
      appointmentId: item.appointment_id,
      doctorId: item.doctor_id,
      name: item.name?.trim(),
      cost: item.general_cost,
      communityCost: item.community_cost ?? null,
    }));
  },

  // ==============================
  // CREATE
  // ==============================
  async create(data: CreateAppointmentTypeData) {
    const res = await fetch(`${API_BASE_URL}/appointments/new-appointment`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      // Backend espera snake_case
      body: JSON.stringify({
        doctor_id: data.doctorId,
        name: data.name,
        general_cost: data.cost,
        community_cost: data.communityCost,
        image_url: data.imageUrl,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || "Error al crear servicio");
    }

    return res.json();
  },

  // ==============================
  // UPDATE
  // ==============================
  async update(id: number, data: UpdateAppointmentTypeData) {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: data.appointmentId,
        doctor_id: data.doctorId,
        name: data.name,
        general_cost: data.cost,
        community_cost: data.communityCost,
        image_url: data.imageUrl,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || "Error al actualizar servicio");
    }

    return res.json();
  },

  // ==============================
  // DELETE
  // ==============================
  async delete(id: number) {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || "Error al eliminar servicio");
    }

    return res.json();
  },
};
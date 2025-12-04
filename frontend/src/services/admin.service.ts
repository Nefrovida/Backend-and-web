import { AuthResponse } from "../types/auth.types";
import { AdminInput } from "../types/admin.types";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export const registerAdmin = async (
    adminAccount: AuthResponse["user"],
    adminData: AdminInput
) => {
    const response = await fetch(`${API_URL}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            loggedUser: adminAccount,
            admin: adminData,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        const err = new Error(error.message || "Admin registration failed");
        (err as any).response = {
            data: error,
            status: response.status,
        };
        throw err;
    }

    return response.json();
};

export const getAllUsers = async () => {
    const response = await fetch(`${API_URL}/admins/Allusers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json();
        const err = new Error(error.message || "Failed to fetch users");
        (err as any).response = {
            data: error,
            status: response.status,
        };
        throw err;
    }

    const data = await response.json();
    return data.users; 
};

//Desactivar usuario
export const deleteUser = async (userId: string) => {
  const response = await fetch(`${API_URL}/admins/desactivate/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    const err = new Error(error.message || "Failed to deactivate user");
    (err as any).response = {
      data: error,
      status: response.status,
    };
    throw err;
  }
};

// 🚨 Obtener usuarios externos
export const getExternalUsers = async () => {
  const response = await fetch(`${API_URL}/users/getAllExternalUsers`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || "Error al cargar externos");

  return data; // 👈 el backend ya manda array directo
};

// 🔁 Convertir externo a paciente (solo cambia first_login)
export const convertExternalToPatient = async (userId: string) => {
  const response = await fetch(`${API_URL}/users/external-to-patient/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Error al convertir usuario externo");
};

export type User = {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string | null;
  username: string;
  phone_number: string;
  active: boolean;  
  user_status: string; 
  role_id: number; 
};

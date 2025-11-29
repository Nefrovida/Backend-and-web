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

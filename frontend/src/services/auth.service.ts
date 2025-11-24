import { RegisterData, AuthResponse, LoginData } from "../types/auth.types";
import { requestPermissionAndGetToken } from "../firebase/firebaseConfig";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in request
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in request
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const authResponse = await response.json();

    try {
      const token = await requestPermissionAndGetToken();
      if (token) {
        await fetch(`${API_BASE_URL}/devices/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceToken: token }),
          credentials: "include",
        });
        console.log("Device registered successfully");
      } else {
        console.warn("Notification permission denied or token unavailable");
      }
    } catch (error) {
      console.error("Failed to register device token:", error);
      // Don't throw - let login succeed even if notification setup fails
    }

    return authResponse;
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Include cookies in request
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

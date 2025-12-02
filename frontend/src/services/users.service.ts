const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export interface PendingUser {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  username: string;
  phone_number: string;
  birthday: string;
  gender: string;
  registration_date: string;
  user_status: string;
  role: {
    role_id: number;
    role_name: string;
  };
}

export const usersService = {
  async getPendingUsers(): Promise<PendingUser[]> {
    const response = await fetch(`${API_BASE_URL}/users/pending/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch pending users");
    }

    return response.json();
  },

  async getRejectedUsers(): Promise<PendingUser[]> {
    const response = await fetch(`${API_BASE_URL}/users/rejected/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch rejected users");
    }

    return response.json();
  },

  async approveUser(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to approve user");
    }

    return response.json();
  },

  async rejectUser(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to reject user");
    }

    return response.json();
  },
};

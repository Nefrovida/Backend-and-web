const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

export const usersService = {
    async getUsers(resetRequested: boolean = false) {
        const url = resetRequested
            ? `${API_URL}/users?resetRequested=true`
            : `${API_URL}/users`;

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        return response.json();
    },

    async resetPassword(userId: string, password: string) {
        const response = await fetch(`${API_URL}/users/${userId}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to reset password");
        }

        return response.json();
    },
};

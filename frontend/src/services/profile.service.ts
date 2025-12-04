import { API_BASE_URL } from "../config/api.config";

export const profileService = {
  async getMyProfile() {
    const res = await fetch(`${API_BASE_URL}/profile/me`, { credentials: 'include' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error fetching profile');
    }
    return res.json();
  },

  async updateMyProfile(payload: any) {
    const res = await fetch(`${API_BASE_URL}/profile/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error updating profile');
    }
    return res.json(); // backend returns { message, data }
  },

  async changePassword(payload: any) {
    const res = await fetch(`${API_BASE_URL}/profile/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error changing password');
    }
    return;
  }
};

export default profileService;

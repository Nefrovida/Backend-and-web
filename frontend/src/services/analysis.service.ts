import { CreateAnalysisData } from "@/types/add.analysis.types";

const API_BASE_URL = (import.meta as any).env?.VITE_APP_API_URL || "http://localhost:3001/api";

export const analysisService = {
  async createAnalysis(data: CreateAnalysisData) {
    const res = await fetch(`${API_BASE_URL}/analysis`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to create analysis");
    }

    return res.json();
  },

  async deleteAnalysis(analysisId: number) {
    const res = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to delete analysis");
    }

    return res.json();
  }
};

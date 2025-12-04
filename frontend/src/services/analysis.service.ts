// frontend/src/services/analysis.service.ts
// us28, us29, us30
import {
  CreateAnalysisData,
  AnalysisResponse,
  UpdateAnalysisData,
} from "@/types/add.analysis.types";
import { API_BASE_URL } from "../config/api.config";

type ListResponse = {
  success: boolean;
  message: string;
  data: AnalysisResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const analysisService = {
  async getAll(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<ListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search && search.trim().length > 0) {
      params.append("search", search.trim());
    }

    const res = await fetch(`${API_BASE_URL}/analysis?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error?.error?.message ||
        error?.message ||
        "Failed to load analyses"
      );
    }

    return res.json();
  },

  async createAnalysis(data: CreateAnalysisData) {
    const res = await fetch(`${API_BASE_URL}/analysis`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error?.error?.message || error.error || "Failed to create analysis"
      );
    }

    return res.json();
  },

  async updateAnalysis(analysisId: number, data: UpdateAnalysisData) {
    const res = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error?.error?.message || error.error || "Failed to update analysis"
      );
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
      throw new Error(
        error?.error?.message || error.error || "Failed to delete analysis"
      );
    }

    return res.json();
  },
};
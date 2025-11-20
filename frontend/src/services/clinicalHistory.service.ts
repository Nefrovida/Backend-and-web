const API_BASE_URL = (import.meta as any).env?.VITE_APP_API_URL || "http://localhost:3001/api";

export interface Question {
  question_id: number;
  description: string;
  type: string;
}

export interface Option {
  option_id: number;
  description: string;
  question_id: number;
}

export interface Answer {
  question_id: number;
  answer: string;
}

export interface RiskFormAnswer {
  question_id: number;
  patient_id: string;
  answer: string;
}

export const clinicalHistoryService = {
  /**
   * Get all risk assessment questions
   */
  async getRiskQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_BASE_URL}/clinical-history/risk-questions`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error fetching risk questions");
    }

    return response.json();
  },

  /**
   * Get all options for questions
   */
  async getRiskOptions(): Promise<Option[]> {
    const response = await fetch(`${API_BASE_URL}/clinical-history/risk-options`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error fetching risk options");
    }

    return response.json();
  },

  /**
   * Submit risk form answers for a patient
   */
  async submitRiskForm(patientId: string, answers: Answer[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clinical-history/risk-form/submit/${patientId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error submitting risk form");
    }

    return response.json();
  },

  /**
   * Get risk form answers for a patient
   */
  async getRiskFormAnswers(patientId: string): Promise<{ data: RiskFormAnswer[] }> {
    const response = await fetch(`${API_BASE_URL}/clinical-history/risk-form/get/${patientId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error fetching risk form answers");
    }

    return response.json();
  },
};

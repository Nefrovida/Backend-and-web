import { MedicalRecordData } from "../types/expediente.types";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "https://www.snefrovidaac.com/api/";
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export interface UploadPDFRequest {
  patientId: string;
  patientAnalysisId: number;
  file: File;
  interpretation?: string;
}

export const expedienteService = {
  /**
   * Get complete medical record for a patient
   * @param patientId - The patient's UUID
   * @returns Complete medical record data
   */
  async getMedicalRecord(patientId: string): Promise<MedicalRecordData> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/expediente`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error fetching medical record");
    }

    return response.json();
  },

  /**
   * Upload a PDF result for a patient analysis
   */
  async uploadAnalysisPDF({
    patientId,
    patientAnalysisId,
    file,
    interpretation,
  }: UploadPDFRequest): Promise<{ success: boolean; resultId?: number }> {
    try {
      // Step 1: Request presigned URL
      const presignResponse = await fetch(
        `${API_BASE_URL}/patients/${patientId}/expediente/presign`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mime: file.type,
            size: file.size,
          }),
        }
      );

      if (!presignResponse.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { url } = await presignResponse.json();

      // Step 2: Upload file to the presigned URL (convert relative path to full URL)
      const uploadUrl = url.startsWith('http') ? url : `${BACKEND_ORIGIN}${url}`;
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Failed to upload file: ${uploadResponse.status}`);
      }

      console.log("File uploaded successfully, confirming...");

      // Step 3: Confirm upload
      const confirmResponse = await fetch(
        `${API_BASE_URL}/patients/${patientId}/expediente/result`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uri: url,
            interpretation: interpretation || "",
            patientAnalysisId,
          }),
        }
      );

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json().catch(() => ({ error: "Unknown error" }));
        console.error("Confirm failed:", errorData);
        throw new Error(errorData.error || `Failed to confirm upload: ${confirmResponse.status}`);
      }

      console.log("Upload confirmed successfully");

      const confirmData = await confirmResponse.json();

      return {
        success: true,
        resultId: confirmData.resultId,
      };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      throw error;
    }
  },
};

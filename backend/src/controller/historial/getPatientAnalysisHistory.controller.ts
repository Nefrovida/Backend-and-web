import { type Request, type Response } from "express";
import Historial from "../../model/historial.model";
import { ANALYSIS_STATUS } from "@prisma/client";

/**
 * Get analysis history for the authenticated patient
 * Requires authenticated user with patient context
 */
async function getPatientAnalysisHistory(req: Request, res: Response) {
  try {
    // Extract patient_id from session/authenticated user
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get patient_id from the user - need to query patients table
    const { prisma } = await import("../../util/prisma.js");
    const patient = await prisma.patients.findFirst({
      where: { user_id: userId },
      select: { patient_id: true }
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found for this user" });
    }

    // Parse query parameters
    const page = Number(req.query.page) || 0;
    const start = (req.query.start as string) || null;
    const end = (req.query.end as string) || null;
    const analysisType =
      req.query.analysis &&
      JSON.parse(req.query.analysis as string).map((v: string) => Number(v));
    const statusParams =
      req.query.status && JSON.parse(req.query.status.toString().toUpperCase());
    const status: ANALYSIS_STATUS[] | null =
      (statusParams &&
        statusParams.length > 0 &&
        statusParams.map((p: string) => p as ANALYSIS_STATUS)) ||
      null;

    // Query patient's analysis history
    const patientAnalysisHistory = await Historial.getPatientAnalysisHistory(
      patient.patient_id,
      page,
      { start, end, analysisType, status }
    );

    console.log("Patient analysis history:", patientAnalysisHistory);

    const newResult = [];
    for (const item of patientAnalysisHistory) {
      newResult.push({
        "id": item.patient_analysis_id,
        "name": item.analysis.name,
        "date": item.analysis_date,
        "recommendations": item.results?.recommendation,
        "download_url": item.results?.path,
      });
    }

    console.log("New result:", newResult);

    // res.json(patientAnalysisHistory);
    res.json(newResult);
  } catch (error) {
    console.error("Error fetching patient analysis history:", error);
    res.status(500).json({ error: "Failed to fetch analysis history" });
  }
}

export default getPatientAnalysisHistory;

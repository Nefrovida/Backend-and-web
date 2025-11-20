import { type Request, type Response } from "express";
import * as expedienteService from "../service/expediente.service";
import { prisma } from "../util/prisma";

/**
 * Get complete medical record for a patient
 * GET /api/patients/:patientId/expediente
 */
export const getMedicalRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { patientId } = req.params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(patientId)) {
      return res.status(400).json({
        error: "Invalid patient ID format",
      });
    }

    const medicalRecord = await expedienteService.getMedicalRecord(
      req.user.userId,
      patientId,
      req.user.roleId
    );

    return res.status(200).json(medicalRecord);
  } catch (error: any) {
    console.error("Error fetching medical record:", error);

    if (error.statusCode === 404) {
      return res.status(404).json({ error: error.message });
    }

    if (error.statusCode === 403) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Error fetching medical record",
    });
  }
};

/**
 * Request presigned URL for uploading PDF result
 * POST /api/patients/:patientId/expediente/presign
 */
export const requestPresignForResult = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { patientId } = req.params;
    const { mime, size } = req.body ?? {};

    console.log("Presign for expediente result", { patientId, mime, size });

    const safeName = `${patientId}-${Date.now()}.pdf`;
    const url = `/uploads/${safeName}`;

    res.status(200).json({ url });
  } catch (error: any) {
    console.error("Error requesting presign URL: ", error);
    res.status(500).json({ success: false, message: "Error requesting presign URL" });
  }
};

/**
 * Upload analysis result PDF for a patient
 * POST /api/patients/:patientId/expediente/result
 * 
 * Note: This creates a result linked to an existing patient_analysis.
 * The patient_analysis should be created first via the analysis/lab workflow.
 */
export const uploadAnalysisResult = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { patientId } = req.params;
    const { uri, interpretation, patientAnalysisId } = req.body ?? {};

    console.log("Upload analysis result", { patientId, uri, interpretation, patientAnalysisId });

    if (!uri) {
      return res.status(400).json({ error: "uri is required" });
    }

    if (!patientAnalysisId) {
      return res.status(400).json({ error: "patientAnalysisId is required" });
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(patientId)) {
      return res.status(400).json({
        error: "Invalid patient ID format",
      });
    }

    // Verify the patient_analysis exists and belongs to this patient
    const patientAnalysis = await prisma.patient_analysis.findUnique({
      where: { patient_analysis_id: parseInt(patientAnalysisId) },
    });

    if (!patientAnalysis) {
      return res.status(404).json({ error: "Patient analysis not found" });
    }

    if (patientAnalysis.patient_id !== patientId) {
      return res.status(403).json({ error: "Analysis does not belong to this patient" });
    }

    // Check if result already exists
    const existingResult = await prisma.results.findUnique({
      where: { patient_analysis_id: parseInt(patientAnalysisId) },
    });

    let result;
    if (existingResult) {
      // Update existing result
      result = await prisma.results.update({
        where: { patient_analysis_id: parseInt(patientAnalysisId) },
        data: {
          path: uri,
          interpretation: interpretation || "",
          date: new Date(),
        },
      });
    } else {
      // Create new result
      result = await prisma.results.create({
        data: {
          patient_analysis_id: parseInt(patientAnalysisId),
          date: new Date(),
          path: uri,
          interpretation: interpretation || "",
        },
      });
    }

    // Update patient_analysis status and results_date
    await prisma.patient_analysis.update({
      where: { patient_analysis_id: parseInt(patientAnalysisId) },
      data: {
        results_date: new Date(),
        analysis_status: "SENT",
      },
    });

    console.log("Result saved successfully", { resultId: result.result_id });

    res.status(200).json({ 
      success: true, 
      message: "Result uploaded successfully",
      resultId: result.result_id 
    });
  } catch (error: any) {
    console.error("Error uploading analysis result: ", error);
    res.status(500).json({ success: false, message: "Error uploading analysis result" });
  }
};
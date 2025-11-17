import express from "express";
const router = express.Router();

import getPatientAnalysisHistory from "../controller/historial/getPatientAnalysisHistory.controller";
import getPatientAnalysisById from "../controller/historial/getPatientAnalysisById.controller";
import { authenticate } from "../middleware/auth.middleware";

/**
 * GET /historial/analysis
 * Get analysis history for the authenticated patient
 */
router.get(
  "/analysis",
  authenticate,
  getPatientAnalysisHistory
);

/**
 * GET /historial/analysis/:id
 * Get a specific analysis record by ID for the authenticated patient
 */
router.get(
  "/analysis/:id",
  authenticate,
  getPatientAnalysisById
);

export default router;

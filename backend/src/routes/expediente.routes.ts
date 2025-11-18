import express from "express";
import * as expedienteController from "../controller/expediente.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router();

/**
 * GET /patients/:patientId/expediente
 * Get complete medical record for a patient
 * 
 * Access control handled by service layer based on role:
 * - Admin: full access
 * - Doctor: only patients they've treated
 * - Patient: only their own record
 * - Familiar: only their assigned patient's record
 */
router.get(
  "/:patientId/expediente",
  authenticate,
  requirePrivileges([Privilege.VIEW_MEDICAL_RECORD]),
  expedienteController.getMedicalRecord
);

/**
 * POST /patients/:patientId/expediente/presign
 * Request presigned URL for uploading analysis result PDF
 */
router.post(
  "/:patientId/expediente/presign",
  authenticate,
  requirePrivileges([Privilege.UPDATE_ANALYSIS]),
  expedienteController.requestPresignForResult
);

/**
 * POST /patients/:patientId/expediente/result
 * Confirm upload and save analysis result
 */
router.post(
  "/:patientId/expediente/result",
  authenticate,
  requirePrivileges([Privilege.UPDATE_ANALYSIS]),
  expedienteController.uploadAnalysisResult
);

export default router;
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

export default router;
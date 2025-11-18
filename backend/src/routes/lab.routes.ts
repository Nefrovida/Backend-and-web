import express from "express"
const router = express.Router()

import getLabResults from "../controller/lab/getLabResults.controller";
import getAnalysis from "src/controller/lab/getAnalysis.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";

import getAnalysisByDay from "../controller/lab/laboratoristGetAnalysis.controller";
import generateLabReport from "../controller/lab/generateReport.controller";
import { getFullLabResults, getResultsPDF } from "../controller/lab/getFullLabResults.controller";

import * as labAppointmentsController from "../controller/lab/labAppointments.controller";

router.use(authenticate);

router.get("/results", 
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getLabResults);

router.get(
  "/analysis",
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getAnalysis
)

router.get(
  "/patient-full-results",
  requirePrivileges([Privilege.VIEW_LAB_RESULTS]),
  getFullLabResults
)

router.get(
  "/results-pdf",
  requirePrivileges([Privilege.VIEW_LAB_RESULTS]),
  getResultsPDF
)

// Date format: dd-mm-yyyy
router.get("/analysis/by-date/:date", 
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getAnalysisByDay);

// List pending lab appointments (US5)
router.get(
  "/lab-appointments",
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  labAppointmentsController.getLabAppointments
);

// Request URL for file upload (US5)
router.post(
  "/lab-appointments/:id/presign",
  requirePrivileges([Privilege.UPDATE_APPOINTMENTS]),
  labAppointmentsController.requestPresign
);

// Confirm file has been uploaded and is in DB (US5)
router.post(
  "/lab-appointments/:id/result",
  requirePrivileges([Privilege.UPDATE_APPOINTMENTS]),
  labAppointmentsController.confirmUpload
);

router.post(
  "/generate-report", 
  requirePrivileges([Privilege.EDIT_LAB_RESULTS]),
  generateLabReport
)

export default router;
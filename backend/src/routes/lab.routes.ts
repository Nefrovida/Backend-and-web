import express from "express"
const router = express.Router()

import getLabResults from "../controller/lab/getLabResults.controller";
import getAnalysis from "src/controller/lab/getAnalysis.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";

import getAnalysisByDay from "../controller/lab/laboratoristGetAnalysis.controller";

import * as labAppointmentsController from "../controller/lab/labAppointments.controller";

router.get("/results", 
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getLabResults);
router.get("/analysis", getAnalysis)

// Date format: dd-mm-yyyy
router.get("/analysis/by-date/:date", 
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getAnalysisByDay);

// Listar citas de laboratorio pendientes de resultado
router.get(
  "/lab-appointments",
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  labAppointmentsController.getLabAppointments
);

// Solicitar URL (dummy) para subir archivo de resultado
router.post(
  "/lab-appointments/:id/presign",
  authenticate,
  requirePrivileges([Privilege.CREATE_ANALYSIS]),
  labAppointmentsController.requestPresign
);

// Confirmar que el archivo ya está subido y guardar en DB
router.post(
  "/lab-appointments/:id/result",
  authenticate,
  requirePrivileges([Privilege.CREATE_ANALYSIS]),
  labAppointmentsController.confirmUpload
);

export default router;
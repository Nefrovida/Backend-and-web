// backend/src/routes/routes.ts
import express from "express";
import doctorRoutes from "./doctor.routes";
import labRoutes from "./lab.routes";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import rolesRoutes from "./roles.routes";
import privilegesRoutes from "./privileges.routes";
import * as analysisController from "../controller/analysis/add_analysis.controller";
import appointmentsRoutes from "./appointments.routes";
import notesRouter from "./notes.routes";
import forumsRoutes from "./forums.routes";
import patientRoutes from "./patients.routes";
import clinicalHistoryRoutes from "./clinicalHistory.routes";
import reportRouter from "./report.routes";
import historialRoutes from "./historial.routes"
import historyRoutes from "./history.routes";
import agendaRoutes from "./agenda.routes"
import appointmentRoutes from "./appointment.routes";
import expedienteRoutes from "./expediente.routes";
import * as analysisPDFController from "../controller/analysisPDF.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router();


//Analysis Routes
router.get(
  "/analysis/my-results",
  authenticate,
  analysisPDFController.getMyAnalysisResultsController as express.RequestHandler
);

// ============================================
// Authentication Routes (Public)
// ============================================
router.use("/auth", authRoutes);

// ============================================
// User Routes (Protected)
// ============================================
router.use("/users", usersRoutes);

// ============================================
// Clinical History Routes (Protected)
// ============================================
router.use("/clinical-history", clinicalHistoryRoutes);

// ============================================
// Role Routes (Protected)
// ============================================
router.use("/roles", rolesRoutes);

// ============================================
// Privilege Routes (Protected)
// ============================================
router.use("/privileges", privilegesRoutes);

// ============================================
// Forum Routes (Protected)
// ============================================
router.use("/forums", forumsRoutes);

// ============================================
// Laboratory Routes (Protected)
// ============================================
router.use("/laboratory", labRoutes);

// ============================================
// Report Routes (Protected)
// ============================================
router.use("/report", reportRouter);

// ============================================
// Notes Routes (Protected)
// ============================================
router.use("/notes", notesRouter);

// ============================================
// Patients Routes (Protected)
// ============================================
router.use("/patients", patientRoutes);

// Expediente Routes (Protected)
// ============================================
router.use("/patients", expedienteRoutes);

// ============================================
// Patient History Questions Templates
// ============================================
router.use("/history", historyRoutes);

// ============================================
// Agenda Routes
// ============================================
router.use("/agenda", agendaRoutes);

// ============================================
// Appointments Routes (Protected)
// ============================================
router.use("/appointments", appointmentRoutes); 

// ============================================
// Appointments Routes (Protected)
// ============================================
router.use("/appointments", appointmentRoutes); 

// ============================================
// Historial Routes (Patient Analysis History)
// ============================================
router.use("/historial", historialRoutes);

// Appointments Routes (Protected)
// ============================================
router.use("/appointments", appointmentsRoutes);

// Doctors Routes (Protected)
// ============================================
router.use("/doctors", doctorRoutes);

// ============================================
// Analysis Routes (Secretary: creates / views / updates / deletes analysis types)
// ============================================
// List / view details: anyone with VIEW_ANALYSIS (doctor, lab, secretary, admin)
router.get(
  "/analysis",
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  analysisController.getAllAnalysis
);

router.get(
  "/analysis/:id",
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  analysisController.getAnalysisById
);
// Create / update / delete analysis types:
// only those with MANAGE_ANALYSIS_TYPES (secretary + admin)
router.post(
  "/analysis",
  authenticate,
  requirePrivileges([Privilege.MANAGE_ANALYSIS_TYPES]),
  analysisController.createAnalysis
);

router.put(
  "/analysis/:id",
  authenticate,
  requirePrivileges([Privilege.MANAGE_ANALYSIS_TYPES]),
  analysisController.updateAnalysis
);

router.delete(
  "/analysis/:id",
  authenticate,
  requirePrivileges([Privilege.MANAGE_ANALYSIS_TYPES]),
  analysisController.deleteAnalysis
);

export default router;


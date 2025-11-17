import express, { type Request, type Response } from "express";

import labRoutes from "./lab.routes";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import rolesRoutes from "./roles.routes";
import privilegesRoutes from "./privileges.routes";

import appointmentsRoutes from "./appointments.routes";
import notesRouter from "./notes.routes";
import forumsRoutes from "./forums.routes";
import * as analysisController from '../controller/analysis/add.analysis.controller';
import patientRoutes from "./patients.routes";
import clinicalHistoryRoutes from "./clinicalHistory.routes";

import reportRouter from "./report.routes";

import historyRoutes from "./history.routes";
import agendaRoutes from "./agenda.routes";

import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router();

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

router.use("/report", reportRouter);

router.use("/notes", notesRouter);

router.use("/patients", patientRoutes);

// ============================================
// Patient History Questions Templates
// ============================================
router.use("/history", historyRoutes);

// Agenda Routes
// ============================================
router.use("/agenda", agendaRoutes);

// ============================================
// Patient History Questions Templates
// ============================================
router.use("/history", historyRoutes);

// Agenda Routes
// ============================================
router.use("/agenda", agendaRoutes);

// ============================================
// Appointments Routes (Protected)
// ============================================
router.use("/appointments", appointmentsRoutes);

// ============================================
// Analysis Routes
// ============================================
router.post(
  "/analysis",
  authenticate,
  requirePrivileges([Privilege.CREATE_ANALYSIS]),
  analysisController.createAnalysis
);

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

router.put(
  "/analysis/:id",
  authenticate,
  requirePrivileges([Privilege.UPDATE_ANALYSIS]),
  analysisController.updateAnalysis
);

router.delete(
  "/analysis/:id",
  authenticate,
  requirePrivileges([Privilege.DELETE_ANALYSIS]),
  analysisController.deleteAnalysis
);

export default router;

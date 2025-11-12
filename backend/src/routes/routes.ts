import express, { type Request, type Response } from "express";

import labRoutes from "./lab.routes";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import rolesRoutes from "./roles.routes"
import privilegesRoutes from "./privileges.routes";
import * as analysisController from '../controller/analysis/add.analysis.controller';

import reportRouter from "./report.routes";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router();

// Health check
router.get("/", (_req: Request, res: Response) => {
  console.log("API hit");
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// ============================================
// Authentication Routes (Public)
// ============================================
router.use("/auth", authRoutes)

// ============================================
// User Routes (Protected)
// ============================================
router.use("/users", usersRoutes)

// ============================================
// Role Routes (Protected)
// ============================================
router.use("/roles", rolesRoutes)

// ============================================
// Privilege Routes (Protected)
// ============================================
router.use("/privileges", privilegesRoutes)

// ============================================
// Laboratory Routes (Protected)
// ============================================
router.use("/laboratory", labRoutes);

router.use("/report", reportRouter);

// ============================================
// Analysis Routes
// ============================================
router.post(
  '/analysis',
  authenticate,
  requirePrivileges([Privilege.CREATE_ANALYSIS]),
  analysisController.createAnalysis
);

router.get(
  '/analysis',
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  analysisController.getAllAnalyses
);

router.get(
  '/analysis/:id',
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  analysisController.getAnalysisById
);

router.put(
  '/analysis/:id',
  authenticate,
  requirePrivileges([Privilege.UPDATE_ANALYSIS]),
  analysisController.updateAnalysis
);

router.delete(
  '/analysis/:id',
  authenticate,
  requirePrivileges([Privilege.DELETE_ANALYSIS]),
  analysisController.deleteAnalysis
);

export default router;

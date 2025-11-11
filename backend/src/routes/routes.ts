import express, { type Request, type Response } from "express";

import labRoutes from "./lab.routes";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import rolesRoutes from "./roles.routes"
import privilegesRoutes from "./privileges.routes";

import reportRouter from "./report.routes";
import secretaryRoutes from "./secretary.routes"


const router = express.Router();

// Health check
router.get("/", (_req: Request, res: Response) => {
  console.log("API hit");
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

router.use("/secretary-agenda", secretaryRoutes);
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

export default router;

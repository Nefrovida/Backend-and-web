import { Router } from "express";
import { createDoctor } from "../controller/doctor.controller";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePrivileges(["CREATE_DOCTOR"]), 
  createDoctor
);

export default router;
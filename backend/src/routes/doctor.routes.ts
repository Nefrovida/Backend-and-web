import { Router } from "express";
import { createDoctor, getAllDoctors } from "../controller/doctor.controller";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getAllDoctors
);

router.post(
  "/",
  authenticate,
  requirePrivileges(["CREATE_DOCTOR"]), 
  createDoctor
);

export default router;
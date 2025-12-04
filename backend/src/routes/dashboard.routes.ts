import { Router } from "express";
import getDoctorDashboard from "../controller/dashboard/getDoctorDashboard.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";
const router = Router();

router.get(
  "/doctor",
  authenticate,
  requirePrivileges([Privilege.CREATE_NOTES]),
  getDoctorDashboard
);

export default router;

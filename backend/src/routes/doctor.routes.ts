import { Router } from "express";
import { createDoctor } from "../controller/doctor.controller";
import { requirePrivileges } from "../middleware/rbac.middleware";

const router = Router();

// Only admins with privilege "CREATE_DOCTOR" can register doctors
//here the priviledge is given but in my db i didnt see any priviledges created so i wrote CREATE_DOCTOR
// but if it already exists and i missed it, please feel free to change it or tell me
router.post(
  "/doctors",
  requirePrivileges(["CREATE_DOCTOR"]), 
  createDoctor
);

export default router;
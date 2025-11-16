import express from "express"
const router = express.Router()

import getDoctorPatients from "../controller/patients/getDoctorPatients.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";


router.get("/doctorPatients", 
  authenticate,
  requirePrivileges([Privilege.VIEW_PATIENTS]),
  getDoctorPatients)


export default router
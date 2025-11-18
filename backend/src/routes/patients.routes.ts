import express from "express"
const router = express.Router()

import getDoctorPatients from "../controller/patients/getDoctorPatients.controller";
import getAllPatients from "../controller/patients/getAllPatients.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";


router.get("/doctorPatients", 
  authenticate,
  requirePrivileges([Privilege.VIEW_PATIENTS]),
  getDoctorPatients)

router.get("/all", 
  authenticate,
  requirePrivileges([Privilege.VIEW_PATIENTS]),
  getAllPatients)


export default router
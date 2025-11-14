import express from "express";
const router = express.Router()

import getAppointmentsPerDay from "../controller/agenda/getAppointmentsPerDay.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";


router.get("/appointments-per-day", 
    /*authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),*/
     getAppointmentsPerDay);

export default router;
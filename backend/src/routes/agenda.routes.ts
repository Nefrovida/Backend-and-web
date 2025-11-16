import express from "express";
const router = express.Router();

import getAppointmentsPerDay from "../controller/agenda/getAppointmentsPerDay.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";
import AppointmentsPerDayByAppointmentId from "src/controller/agenda/AppointmentsPerDayByAppointmentId.controller";
import createAppointment from "../controller/agenda/createAppointment.controller";

router.get(
    "/appointments-per-day",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAppointmentsPerDay
);

router.get(
    "/appointments-per-day/by-appointment",
    //authenticate,
    //requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    AppointmentsPerDayByAppointmentId
);

router.post(
    "/appointment",
    // authenticate,
    // requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
    createAppointment
);

export default router;

import express from "express";
const router = express.Router();

import getAppointmentsPerDaySec from "../controller/agenda/getAppointmentsPerDaySec.controller";
import getAppointmentsPerDay from "../controller/agenda/getAppointmentsPerDay.controller";
import getAppointmentsInRangeC from "../controller/agenda/getAppointmentsInRange.controller";

import cancelAppointment from "src/controller/agenda/cancelAppointment.controller";
import getAppointmentById from "src/controller/agenda/getAppointmentById.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";

// Secretaria – day appointments (secretary view, with patient names)
router.get(
    "/appointments-per-day-sec",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAppointmentsPerDaySec
);

// Doctor / mobile – daily appointments (doctor's name)
router.get(
    "/appointments-per-day",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAppointmentsPerDay
);

// Appointment detail by id
router.get(
    "/appointment/:id",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAppointmentById
);

// Cancel appointment
router.post(
    "/appointments/:id/cancel",
    authenticate,
    requirePrivileges([Privilege.UPDATE_APPOINTMENTS]),
    cancelAppointment
);

// Secretaria – appointments in date range (calendar view / filter)
router.get(
    "/appointments/range",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAppointmentsInRangeC
);

export default router;

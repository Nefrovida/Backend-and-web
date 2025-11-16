import express from "express";
const router = express.Router()

import getAppointmentsPerDay from "../controller/agenda/getAppointmentsPerDay.controller";
import cancelAppointment from "../controller/agenda/cancelAppointment.controller";
import getAppointmentRequests from "../controller/agenda/getAppointmentRequests.controller";
import getDoctors from "../controller/agenda/getDoctors.controller";
import getDoctorAvailability from "../controller/agenda/getDoctorAvailability.controller";
import scheduleAppointment from "../controller/agenda/scheduleAppointment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";


router.get("/appointments-per-day", 
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
     getAppointmentsPerDay);

router.post("/appointments/:id/cancel", 
    authenticate,
    requirePrivileges([Privilege.UPDATE_APPOINTMENTS]),
     cancelAppointment);

router.get("/appointment-requests", 
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
     getAppointmentRequests);

router.get("/doctors", 
    authenticate,
    requirePrivileges([Privilege.VIEW_USERS]),
     getDoctors);

router.get("/doctor/:doctorId/availability", 
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
     getDoctorAvailability);

router.post("/schedule", 
    authenticate,
    requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
     scheduleAppointment);

export default router;
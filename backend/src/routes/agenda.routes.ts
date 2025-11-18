import express from "express";
const router = express.Router();

import getAppointmentsPerDaySec from "../controller/agenda/getAppointmentsPerDaySec.controller";
import getAppointmentsPerDay from "../controller/agenda/getAppointmentsPerDay.controller";
import cancelAppointment from "src/controller/agenda/cancelAppointment.controller";
import * as secretariaController from "../controller/agenda/secretaria.controller";
import getAppointmentById from "src/controller/agenda/getAppointmentById.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";

router.get(
  "/appointments-per-day",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  getAppointmentsPerDay
);

router.get("/appointments-per-day-sec", 
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
     getAppointmentsPerDaySec);

router.get("/appointments-per-day", 
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
     getAppointmentsPerDay);

router.post("/appointments/:id/cancel", 
    authenticate,
    requirePrivileges([Privilege.UPDATE_APPOINTMENTS]),
     cancelAppointment);

router.get("/appointment/:id",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAppointmentById);

// Secretaria endpoints for scheduling appointments
router.get(
  "/pending-requests",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  secretariaController.getPendingAppointmentRequests
);

router.get(
  "/doctors",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  secretariaController.getDoctors
);

router.get(
  "/doctor-availability",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  secretariaController.getDoctorAvailability
);

router.post(
  "/schedule-appointment",
  authenticate,
  requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
  secretariaController.scheduleAppointment
);

router.post(
  "/create-appointment",
  authenticate,
  requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
  secretariaController.createAppointment
);

export default router;

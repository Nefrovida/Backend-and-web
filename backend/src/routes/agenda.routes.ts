import express from "express";
const router = express.Router();

import getAppointmentsPerDaySec from "../controller/agenda/getAppointmentsPerDaySec.controller";
import getAppointmentsPerDay from "../controller/agenda/getAppointmentsPerDay.controller";
import getAppointmentsInRangeC from "../controller/agenda/getAppointmentsInRange.controller";
import getAppointmentsPerPatient from "../controller/agenda/getAppointmentsPerPatient.controller";

import getAppointmentDateAvailability from "../controller/agenda/getAppointmentDateAvailability.controller";

import cancelAppointment from "src/controller/agenda/cancelAppointment.controller";
import cancelAnalysis from "src/controller/agenda/cancelAnalysis.controller";

import * as secretariaController from "../controller/agenda/secretaria.controller";
import getAppointmentById from "src/controller/agenda/getAppointmentById.controller";
import getAnalysisById from "src/controller/agenda/getAnalysisById.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "src/types/rbac.types";
import AppointmentsPerDayByAppointmentId from "src/controller/agenda/AppointmentsPerDayByAppointmentId.controller";
import createAppointment from "../controller/agenda/createAppointment.controller";

// Secretaria – day appointments (secretary view, with patient names)
router.get(
  "/appointments-per-day-sec",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  getAppointmentsPerDaySec
);

// Doctor daily appointments (doctor's name)
router.get(
  "/appointments-per-day",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  getAppointmentsPerDay
);

// mobile – daily appointments per patient (doctor's name)
router.get(
    "/appointments-per-patient",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAppointmentsPerPatient
);

// Appointment detail by id
router.get(
  "/appointment/:id",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  getAppointmentById
);

// Analysis detail by id
router.get(
    "/analysis/:id",
    authenticate,
    requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
    getAnalysisById
);

// Cancel appointment
  console.log("Canceling appointment..."),
router.post(
  "/appointments/:id/cancel",
  authenticate,
  requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
  cancelAppointment,
);

router.post(
  "/analysis/:id/cancel",
  //authenticate,
  //requirePrivileges([Privilege.CREATE_ANALYSIS]),
  cancelAnalysis
);

// Secretaria – appointments in date range (calendar view / filter)
router.get(
  "/appointments/range",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  getAppointmentsInRangeC
);

// Secretaria endpoints for scheduling appointments
router.get(
  "/pending-requests",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  secretariaController.getPendingAppointmentRequests
);

router.get(
  "/appointments/date-availability",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  getAppointmentDateAvailability
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

router.get(
  "/appointments-per-day/by-appointment",
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  AppointmentsPerDayByAppointmentId
);

router.post(
  "/appointment",
  authenticate,
  requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
  createAppointment
);

export default router;

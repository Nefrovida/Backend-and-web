import express from "express"
import * as appointmentController from "../controller/appointment/getUserAppointment";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";
import { exit } from "process";
import * as appointmentsController from '../controller/appointment/appointments.controller';

const router = express.Router();

/**
 * GET /appointments/my-appointments
 *
 * Get all appointments for the authenticated doctor
 *
 * Protected by:
 * - authenticate: Ensures user is logged in
 * - requirePrivileges([VIEW_APPOINTMENTS]): Ensures user has permission to view appointments
 */
router.get(
  '/my-appointments',
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  appointmentsController.getDoctorAppointments
);

router.get("/getAllAppointments", appointmentsController.getAllAppointments);

router.post("/new-appointment", 
  //authenticate,
  //requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
  appointmentsController.createAppointment);

router.get("/user/:user_id",
  authenticate, 
  appointmentController.getUserAppointments);


export default router;

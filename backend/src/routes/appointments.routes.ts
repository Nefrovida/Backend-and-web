import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requirePrivileges } from '../middleware/rbac.middleware';
import { Privilege } from '../types/rbac.types';
import * as appointmentsController from '../controller/appointments.controller';

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

export default router;

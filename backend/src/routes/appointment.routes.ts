import express from 'express';
import AppointmentController from '../controller/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePrivileges } from '../middleware/rbac.middleware';
import { Privilege } from '../types/rbac.types';

const router = express.Router();


// GET /api/appointments
router.get(
  '/',
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  AppointmentController.getAllAppointments
);

// GET /api/appointments/day/:date
router.get(
  '/day/:date',
  authenticate,
  requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  AppointmentController.getAppointmentsByDay
);

// PUT /api/appointments/:id/reschedule
router.put(
  '/:id/reschedule',
  authenticate,
  requirePrivileges([Privilege.CREATE_APPOINTMENTS]),
  AppointmentController.rescheduleAppointment
);

// GET /api/appointments/patient/get-notes
router.get(
  '/patient/get-notes',
  authenticate,
  requirePrivileges([Privilege.VIEW_NOTES]),
  AppointmentController.getPatientAppointment
);

export default router;
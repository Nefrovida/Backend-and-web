// routes/appointment.routes.ts

import express from 'express';
import AppointmentController from '../controller/appointment.controller';
// import { authenticate } from '../middleware/auth.middleware';
// import { requirePrivileges } from '../middleware/rbac.middleware';
// import { Privilege } from '../types/rbac.types';

const router = express.Router();

// GET /api/appointments
router.get(
  '/',
  // authenticate,
  // requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  AppointmentController.getAllAppointments
);

// GET /api/appointments/day/:date
router.get(
  '/day/:date',
  // authenticate,
  // requirePrivileges([Privilege.VIEW_APPOINTMENTS]),
  AppointmentController.getAppointmentsByDay
);

// PUT /api/appointments/:id/reschedule
router.put(
  '/:id/reschedule',
  // authenticate,
  // requirePrivileges([Privilege.UPDATE_APPOINTMENTS]),
  AppointmentController.rescheduleAppointment
);

export default router;
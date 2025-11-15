
// routes/appointment.routes.ts

import { Router } from 'express';
import AppointmentController from '../controller/appointment.controller';
// import { authMiddleware } from '../middleware/auth'; // tu middleware de auth

const router = Router();

// Aplicar middleware de autenticación si lo necesitas
// router.use(authMiddleware);

router.get('/appointments', AppointmentController.getAllAppointments);
router.get('/appointments/day/:date', AppointmentController.getAppointmentsByDay);
router.put('/appointments/:id/reschedule', AppointmentController.rescheduleAppointment);

export default router;
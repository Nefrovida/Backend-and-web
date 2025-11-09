import express from "express";
const router = express.Router()

import getAppointmentsPerDay from "../controller/secretary/getAppointmentsPerDay.controller";
import scheduleAppointment from "../controller/secretary/scheduleAppointment.controller.ts";
import getAppointmentRequests from "../controller/secretary/getAppointmentRequests.controller";
import getDoctors from "../controller/secretary/getDoctors.controller";
import getDoctorAvailability from "../controller/secretary/getDoctorAvailability.controller";
//import getPermission from "../util/getPermission";

router.get("/appointments-per-day", /*getPermission("filterAppointments"),*/ getAppointmentsPerDay);
router.get("/appointment-requests", /*getPermission("viewAppointmentRequests"),*/ getAppointmentRequests);
router.get("/doctors", /*getPermission("viewDoctors"),*/ getDoctors);
router.get("/doctor/:doctorId/availability", /*getPermission("viewDoctorAvailability"),*/ getDoctorAvailability);
router.post("/schedule", /*getPermission("assignAppointment"),*/ scheduleAppointment);

export default router;
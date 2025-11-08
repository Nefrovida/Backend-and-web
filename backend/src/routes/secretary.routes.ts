import express from "express";
const router = express.Router()

import getAppointmentsPerDay from "../controller/secretary/getAppointmentsPerDay.controller";
//import getPermission from "../util/getPermission";

router.get("/appointments-per-day", /*getPermission("filterAppointments"),*/ getAppointmentsPerDay);

export default router;
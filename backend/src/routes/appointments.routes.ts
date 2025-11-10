import express from "express";

const router = express.Router();

import getAppointments from "../controller/appointments/doctorAppointments.controller";

router.get("/get-appointments/:user_id", getAppointments);

export default router;
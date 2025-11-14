import express from "express"
import * as appointmentController from "../controller/appointment/getUserAppointment";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";
import { exit } from "process";

const router = express.Router()

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});


router.get("/user/:id",authenticate, appointmentController.getUserAppointments);

export default router;

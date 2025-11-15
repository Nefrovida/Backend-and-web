import { Router } from "express";
import { createDoctor } from "../controller/doctor.controller";

const router = Router();

router.post("/doctors", createDoctor);

export default router;
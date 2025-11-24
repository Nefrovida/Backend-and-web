import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import registerDeviceController from "../controller/devices/devices.controller";

const router = Router();

router.post(
    "/register", 
    authenticate,
    registerDeviceController.registerDevice
);

export default router;

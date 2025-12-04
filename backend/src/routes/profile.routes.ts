import express from "express";
import { ProfileController } from "../controller/profile.controller";
import { authenticate } from "src/middleware/auth.middleware";
import { requirePrivileges } from "src/middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types"; 

const router = express.Router();

router.get(
    "/me",
    authenticate,
    requirePrivileges([Privilege.VIEW_OWN_PROFILE]),
    ProfileController.getMe
);

router.put(
    "/me",
    authenticate,
    requirePrivileges([Privilege.UPDATE_OWN_PROFILE]),
    ProfileController.updateMe
);

router.put(
    "/change-password",
    authenticate,
    requirePrivileges([Privilege.UPDATE_OWN_PROFILE]),
    ProfileController.changePassword
);

export default router;
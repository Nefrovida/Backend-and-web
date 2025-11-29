import { Router } from "express";
import { createAdmin } from "../controller/admin.controller";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
    "/",
    authenticate,
    requirePrivileges(["CREATE_ADMIN"]),
    createAdmin
);

export default router;

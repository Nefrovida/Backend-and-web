import { Router } from "express";
import { createAdmin, desactivateUserController, getActiveUsers } from "../controller/admin.controller";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { Privilege } from "../types/rbac.types";

const router = Router();

router.post(
    "/",
    authenticate,
    requirePrivileges(["CREATE_ADMIN"]),
    createAdmin
);

router.get("/Allusers",
    authenticate,
    getActiveUsers
)

router.put("/desactivate/:id",
    authenticate,
    desactivateUserController
);

export default router;

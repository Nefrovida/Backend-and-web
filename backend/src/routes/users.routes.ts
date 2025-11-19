import express from "express"
import * as usersController from "../controller/users.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";
import { exit } from "process";
import { checkAdminStatus, getAdminUsers } from "src/controller/forums.controller";


const router = express.Router()

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});1


// ============================================
// User Routes (Protected)
// ============================================
router.get("/profile", authenticate, usersController.getProfile);



router.get(
  "/",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  usersController.getAllUsers
);



router.get(
  "/:id",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  usersController.getUserById
);



router.put(
  "/:id",
  authenticate,
  requirePrivileges([Privilege.UPDATE_USERS]),
  usersController.updateUser
);



router.delete(
  "/:id",
  authenticate,
  requirePrivileges([Privilege.DELETE_USERS]),
  usersController.deleteUser
);

export default router;

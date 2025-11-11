import express from "express"
import * as usersController from "../controller/users.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router()

// ============================================
// User Routes (Protected)
// ============================================
router.get("/users/profile", authenticate, usersController.getProfile);

router.get(
  "/users",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  usersController.getAllUsers
);

router.get(
  "/users/:id",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  usersController.getUserById
);

router.put(
  "/users/:id",
  authenticate,
  requirePrivileges([Privilege.UPDATE_USERS]),
  usersController.updateUser
);

router.delete(
  "/users/:id",
  authenticate,
  requirePrivileges([Privilege.DELETE_USERS]),
  usersController.deleteUser
);

router.get(
  "/users/:id/appointments",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  usersController.getUserAppointments
)

export default router;
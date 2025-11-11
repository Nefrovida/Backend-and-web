import express from "express"
import * as rolesController from "../controller/roles.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router()

// ============================================
// Role Routes (Protected)
// ============================================
router.get(
  "/roles",
  authenticate,
  requirePrivileges([Privilege.VIEW_ROLES]),
  rolesController.getAllRoles
);

router.get(
  "/roles/:id",
  authenticate,
  requirePrivileges([Privilege.VIEW_ROLES]),
  rolesController.getRoleById
);

router.post(
  "/roles",
  authenticate,
  requirePrivileges([Privilege.CREATE_ROLES]),
  rolesController.createRole
);

router.put(
  "/roles/:id",
  authenticate,
  requirePrivileges([Privilege.UPDATE_ROLES]),
  rolesController.updateRole
);

router.delete(
  "/roles/:id",
  authenticate,
  requirePrivileges([Privilege.DELETE_ROLES]),
  rolesController.deleteRole
);

router.post(
  "/roles/:id/privileges",
  authenticate,
  requirePrivileges([Privilege.UPDATE_ROLES]),
  rolesController.assignPrivileges
);

export default router
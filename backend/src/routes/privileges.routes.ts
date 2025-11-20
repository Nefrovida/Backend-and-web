import express from "express"
import * as privilegesController from "../controller/privileges.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router()

// ============================================
// Privilege Routes (Protected)
// ============================================
router.get(
  "/",
  authenticate,
  requirePrivileges([Privilege.VIEW_PRIVILEGES]),
  privilegesController.getAllPrivileges
);

router.get(
  "/:id",
  authenticate,
  requirePrivileges([Privilege.VIEW_PRIVILEGES]),
  privilegesController.getPrivilegeById
);

router.post(
  "/",
  authenticate,
  requirePrivileges([Privilege.CREATE_PRIVILEGES]),
  privilegesController.createPrivilege
);

router.put(
  "/:id",
  authenticate,
  requirePrivileges([Privilege.UPDATE_PRIVILEGES]),
  privilegesController.updatePrivilege
);

router.delete(
  "/:id",
  authenticate,
  requirePrivileges([Privilege.DELETE_PRIVILEGES]),
  privilegesController.deletePrivilege
);

export default router;
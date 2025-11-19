import express, { Request, Response } from "express";
import * as authController from "../controller/auth.controller";
import * as usersController from "../controller/users.controller";
import * as rolesController from "../controller/roles.controller";
import * as privilegesController from "../controller/privileges.controller";

import * as analysisController from "../controller/analysis.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router();

// Health check
router.get("/", (_req: Request, res: Response) => {
  console.log("API hit");
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

//Analysis Routes
router.get(
  "/analysis/my-results",
  authenticate,
  analysisController.getMyAnalysisResultsController as express.RequestHandler
);

// ============================================
// Authentication Routes (Public)
// ============================================
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Protected auth routes
router.post("/auth/refresh", authenticate, authController.refreshToken);
router.post("/auth/logout", authenticate, authController.logout);

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

// ============================================
// Privilege Routes (Protected)
// ============================================
router.get(
  "/privileges",
  authenticate,
  requirePrivileges([Privilege.VIEW_PRIVILEGES]),
  privilegesController.getAllPrivileges
);

router.get(
  "/privileges/:id",
  authenticate,
  requirePrivileges([Privilege.VIEW_PRIVILEGES]),
  privilegesController.getPrivilegeById
);

router.post(
  "/privileges",
  authenticate,
  requirePrivileges([Privilege.CREATE_PRIVILEGES]),
  privilegesController.createPrivilege
);

router.put(
  "/privileges/:id",
  authenticate,
  requirePrivileges([Privilege.UPDATE_PRIVILEGES]),
  privilegesController.updatePrivilege
);

router.delete(
  "/privileges/:id",
  authenticate,
  requirePrivileges([Privilege.DELETE_PRIVILEGES]),
  privilegesController.deletePrivilege
);

export default router;

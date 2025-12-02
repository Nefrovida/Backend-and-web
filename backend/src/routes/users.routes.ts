import express from "express"
import * as usersController from "../controller/users.controller";
import * as patientConversionController from "../controller/patient.conversion.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";
import { exit } from "process";
import { checkAdminStatus, getAdminUsers } from "src/controller/forums.controller";


const router = express.Router()

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});


// ============================================
// User Routes (Protected)
// ============================================
router.get("/profile", authenticate, usersController.getProfile);

router.get("/first-login/:user_id",
  authenticate,
  usersController.isFirstLogin);

// Get all external users (users without role-specific records)
router.get(
  "/external",
  authenticate,
  requirePrivileges([Privilege.VIEW_PATIENTS]),
  patientConversionController.getExternalUsers
);

// Check if user is external
router.get(
  "/:userId/is-external",
  authenticate,
  requirePrivileges([Privilege.VIEW_PATIENTS]),
  patientConversionController.checkIfExternalUser
);

// Convert external user to patient (doctors only)
router.post(
  "/:userId/convert-to-patient",
  authenticate,
  requirePrivileges([Privilege.CREATE_PATIENTS]),
  patientConversionController.convertUserToPatient
);

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

// ============================================
// User Approval Routes (Admin Only)
// ============================================
router.get(
  "/pending/all",
  authenticate,
  requirePrivileges([Privilege.APPROVE_USERS]),
  usersController.getPendingUsers
);

router.get(
  "/rejected/all",
  authenticate,
  requirePrivileges([Privilege.APPROVE_USERS]),
  usersController.getRejectedUsers
);

router.put(
  "/:id/approve",
  authenticate,
  requirePrivileges([Privilege.APPROVE_USERS]),
  usersController.approveUser
);

router.put(
  "/:id/reject",
  authenticate,
  requirePrivileges([Privilege.APPROVE_USERS]),
  usersController.rejectUser
);

export default router;

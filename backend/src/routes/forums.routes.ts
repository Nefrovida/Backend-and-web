import express from "express";
import * as forumsController from "../controller/forums.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router();

// ============================================
// Forum Routes (Protected)
// ============================================

/**
 * Create a new forum
 * 
 * POST /api/forums
 * 
 * User Story: "Admin: Create Forums"
 * 
 * Middlewares:
 * 1. authenticate - Verifies JWT and injects req.user
 * 2. requirePrivileges - Checks if user has CREATE_FORUMS privilege
 * 3. forumsController.create - Handles the request
 * 
 * Request Body:
 * {
 *   "name": "Forum Name",
 *   "description": "Forum description",
 *   "public_status": true
 * }
 * 
 * Response: 201 Created
 * {
 *   "forum_id": 1,
 *   "name": "Forum Name",
 *   "description": "Forum description",
 *   "public_status": true,
 *   "created_by": "user-uuid",
 *   "active": true,
 *   "creation_date": "2025-11-13T..."
 * }
 */
router.post(
  "/",
  authenticate,
  requirePrivileges([Privilege.CREATE_FORUMS]),
  forumsController.create
);

export default router;

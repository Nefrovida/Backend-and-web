import express from "express";
import * as forumsController from "../controller/forums.controller";
import * as addPatientToForumController from '../controller/forums/add_patient_to_forum.controller';
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

const router = express.Router();

// ============================================
// Forum Routes (Protected)
// ============================================

/**
 * Get all forums
 * 
 * GET /api/forums
 * 
 * User Story: "User: View Forums List"
 * 
 * Middlewares:
 * 1. authenticate - Verifies JWT and injects req.user
 * 2. requirePrivileges - Checks if user has VIEW_FORUMS privilege
 * 3. forumsController.getAll - Handles the request
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20)
 * - search: string (optional)
 * - isPublic: boolean (optional)
 * 
 * Response: 200 OK
 * [
 *   {
 *     "forum_id": 1,
 *     "name": "Forum Name",
 *     "description": "Forum description",
 *     "public_status": true,
 *     "created_by": "user-uuid",
 *     "active": true,
 *     "creation_date": "2025-11-13T..."
 *   }
 * ]
 */
router.get(
  "/",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getAll
);

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

/**
 * Update a forum
 * 
 */
router.put(
  "/:forumId",
  authenticate,
  requirePrivileges([Privilege.UPDATE_FORUMS]),
  forumsController.update
);

// Admin routes - Get admin users with pagination
router.get(
  '/admin-users', 
  authenticate, 
  requirePrivileges([Privilege.VIEW_USERS]), 
  forumsController.getAdminUsers
);

// Admin routes - Check if user is admin
router.get(
  '/admin-status/:userId', 
  authenticate, 
  requirePrivileges([Privilege.VIEW_USERS]), 
  forumsController.checkAdminStatus
);

// Forum administrators routes
router.get(
  '/:forumId/administrators',
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  forumsController.getForumAdministrators
);

router.post(
  '/:forumId/administrators',
  authenticate,
  requirePrivileges([Privilege.UPDATE_FORUMS]),
  forumsController.addForumAdministrator
);

router.delete(
  '/:forumId/administrators/:userId',
  authenticate,
  requirePrivileges([Privilege.UPDATE_FORUMS]),
  forumsController.removeForumAdministrator
);

// Forum users routes (from add_patient_to_forum.routes.ts)
router.post(
  '/:forumId/users',
  authenticate,
  requirePrivileges([Privilege.ADD_USER_TO_FORUM]),
  addPatientToForumController.addPatientToForum
);

export default router;

import express from "express";
import * as forumsController from "../controller/forums.controller";
import * as addPatientToForumController from "../controller/forums/add_patient_to_forum.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";
import postNewMessage from "src/controller/forum/postNewMessage.controller";
import {
  getMyForums,
  getMyForumsWeb,
} from "src/controller/forum/getMyForums.controller";
import getForumFeed from "src/controller/forum/getForumFeed.controller";

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
router.get("/myForums", authenticate, getMyForums);
router.get("/myForums/web", authenticate, getMyForumsWeb);

router.get("/feed", authenticate, getForumFeed);

router.get(
  "/",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getAll
);

router.get(
  "/:forumId",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getById
);

router.get(
  "/me",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getMyForums
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

// Admin routes - Get admin users with pagination
router.get(
  "/admin-users",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  forumsController.getAdminUsers
);

// Admin routes - Get non-admin users with pagination
router.get(
  "/regular-users",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  forumsController.getRegularUsers
);

// Admin routes - Check if user is admin
router.get(
  "/admin-status/:userId",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  forumsController.checkAdminStatus
);

router.get(
  "/:forumId",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getById
);

router.post("/:forumId", authenticate, postNewMessage);

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

// Forum administrators routes
router.get(
  "/:forumId/administrators",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  forumsController.getForumAdministrators
);

router.post(
  "/:forumId/administrators",
  authenticate,
  requirePrivileges([Privilege.UPDATE_FORUMS]),
  forumsController.addForumAdministrator
);

router.delete(
  "/:forumId/administrators/:userId",
  authenticate,
  requirePrivileges([Privilege.UPDATE_FORUMS]),
  forumsController.removeForumAdministrator
);

// Forum members routes
router.get(
  "/:forumId/members",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  forumsController.getForumMembers
);

router.post(
  "/:forumId/members",
  authenticate,
  requirePrivileges([Privilege.ADD_USER_TO_FORUM]),
  forumsController.addForumMember
);

router.delete(
  "/:forumId/members/:userId",
  authenticate,
  requirePrivileges([Privilege.UPDATE_FORUMS]),
  forumsController.removeForumMember
);

// Forum users routes (from add_patient_to_forum.routes.ts)
router.post(
  "/:forumId/users",
  authenticate,
  requirePrivileges([Privilege.ADD_USER_TO_FORUM]),
  addPatientToForumController.addPatientToForum
);

// Allow authenticated patients to join public forums (self-join)
router.post(
  "/:forumId/join",
  authenticate,
  addPatientToForumController.joinForum
);

/**
 * Get messages for a forum
 *
 * GET /api/forums/:forumId/messages
 */
router.get(
  "/:forumId/messages",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getMessages
);

/**
 * Reply to a message in a forum
 *
 * POST /api/forums/:forumId/replies
 *
 * User Story: "Todos responden mensaje en el foro"
 *
 * Middlewares:
 * 1. authenticate - Verifies JWT and injects req.user
 * 2. forumsController.replyToMessage - Handles the request
 *
 * Request Body:
 * {
 *   "parentMessageId": 123,
 *   "content": "Este es mi comentario en hilo"
 * }
 *
 * Response: 201 Created
 * {
 *   "message_id": 456,
 *   "forum_id": 1,
 *   "user_id": "user-uuid",
 *   "content": "Este es mi comentario en hilo",
 *   "parent_message_id": 123,
 *   "publication_timestamp": "2025-11-16T..."
 * }
 */
router.post("/:forumId/replies", authenticate, forumsController.replyToMessage);

/**
 * Get replies for a message
 *
 * GET /api/forums/:forumId/messages/:messageId/replies
 */
router.get(
  "/:forumId/messages/:messageId/replies",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getReplies
);

router.get(
  "/message/:messageId",
  authenticate,
  requirePrivileges([Privilege.VIEW_FORUMS]),
  forumsController.getMessage
);

export default router;

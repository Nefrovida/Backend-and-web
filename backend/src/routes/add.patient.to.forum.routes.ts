import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requirePrivileges } from '../middleware/rbac.middleware';
import { Privilege } from '../types/rbac.types';
import * as addPatientToForumController from '../controller/forums/add.patient.to.forum.controller';

const router = Router();

/**
 * @route   POST /api/forums/:forumId/users
 * @desc    Add a patient to a private forum
 * @access  Private (requires ADD_USER_TO_FORUM privilege)
 */
router.post(
  '/forums/:forumId/users',
  authenticate,
  requirePrivileges([Privilege.ADD_USER_TO_FORUM]),
  addPatientToForumController.addPatientToForum
);

export default router;
import express from 'express';
import * as historyController from '../controller/history.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePrivileges } from '../middleware/rbac.middleware';
import { Privilege } from '../types/rbac.types';

const router = express.Router();

// Questions templates - Admin only
router.get(
  '/questions',
  authenticate,
  requirePrivileges([Privilege.VIEW_HISTORY_QUESTIONS]),
  historyController.listQuestions
);

router.get(
  '/questions/:id',
  authenticate,
  requirePrivileges([Privilege.VIEW_HISTORY_QUESTIONS]),
  historyController.getQuestion
);

router.post(
  '/questions',
  authenticate,
  requirePrivileges([Privilege.CREATE_HISTORY_QUESTIONS]),
  historyController.createQuestion
);

router.put(
  '/questions/:id',
  authenticate,
  requirePrivileges([Privilege.UPDATE_HISTORY_QUESTIONS]),
  historyController.updateQuestion
);

router.delete(
  '/questions/:id',
  authenticate,
  requirePrivileges([Privilege.DELETE_HISTORY_QUESTIONS]),
  historyController.deleteQuestion
);

export default router;

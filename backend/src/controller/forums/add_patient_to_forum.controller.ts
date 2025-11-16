import type { Request, Response, NextFunction } from 'express';
import { addPatientToForumService, joinForumService } from '../../service/forums/add_patient_to_forum.service';
import {
  addPatientToForumBodySchema,
  addPatientToForumParamsSchema
} from '../../validators/forums/add_patient_to_forum.validator';
import { BadRequestError } from '../../util/errors.util.js';

/**
 * Controller add patient to forum
 */
export async function addPatientToForum(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Verify params
    const paramsValidation = addPatientToForumParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      const errors = paramsValidation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new BadRequestError(`Invalid request parameters: ${JSON.stringify(errors)}`));
    }

    // Verify body
    const bodyValidation = addPatientToForumBodySchema.safeParse(req.body);
    if (!bodyValidation.success) {
      const errors = bodyValidation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new BadRequestError(`Invalid request body: ${JSON.stringify(errors)}`));
    }

    const { forumId } = paramsValidation.data;
    const { userId, forumRole } = bodyValidation.data;

    // Call service
    const result = await addPatientToForumService(forumId, userId, forumRole);

    // Added successfully - result already contains the full response structure
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Join a public forum as authenticated user (patient)
 */
export async function joinForum(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate params
    const paramsValidation = addPatientToForumParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      const errors = paramsValidation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new BadRequestError(`Invalid request parameters: ${JSON.stringify(errors)}`));
    }

    const { forumId } = paramsValidation.data;

    // Use the authenticated user id from req.user
    const userId = req.user!.userId;

    // Call the service for joining forums (self-join)
  const result = await joinForumService(forumId, userId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
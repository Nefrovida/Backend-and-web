import { Request, Response } from 'express';
import { createForumSchema } from '../validators/forum.validator';
import * as forumsService from '../service/forums.service';

/**
 * Create a new forum (Admin only)
 * 
 * User Story: "Admin: Create Forums"
 * 
 * Flow:
 * 1. Validate request body with Zod schema
 * 2. Extract userId from authenticated user (req.user)
 * 3. Call service to create forum with business logic
 * 4. Return created forum with 201 status
 * 
 * Prerequisites (handled by middlewares):
 * - authenticate: Ensures req.user exists and is valid
 * - requirePrivileges(['CREATE_FORUMS']): Ensures user has permission
 * 
 * @param req - Express request with validated user and body
 * @param res - Express response
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body with Zod
    // This ensures type safety and data integrity before reaching the service
    const validatedData = createForumSchema.parse(req.body);

    // Extract userId from JWT payload (guaranteed to exist after authenticate middleware)
    const userId = req.user!.userId;

    // Call service to execute business logic
    const newForum = await forumsService.createForum(validatedData, userId);

    // Respond with created forum
    res.status(201).json(newForum);
  } catch (error: any) {
    // Delegate error handling to Express
    // Custom errors (ConflictError, etc.) have statusCode property
    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

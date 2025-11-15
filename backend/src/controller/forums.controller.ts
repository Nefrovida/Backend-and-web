import { Request, Response } from 'express';
import { ZodError } from 'zod';
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
    // Handle Zod validation errors with friendly, field-specific messages
    if (error instanceof ZodError) {
      const formatted = error.errors.map((e) => {
        const field = e.path && e.path.length ? String(e.path[0]) : undefined;
        // Provide friendly messages for common validation failures
        let message = e.message;

        if (field === 'name') {
          if ((e as any).code === 'too_big') message = 'El nombre no puede exceder 100 caracteres';
          if ((e as any).code === 'too_small') message = 'El nombre debe tener al menos 3 caracteres';
        }

        if (field === 'description') {
          if ((e as any).code === 'too_big') message = 'La descripción no puede exceder 255 caracteres';
        }

        return { field, message };
      });

  res.status(400).json({ errors: formatted });
  return;
    }

    // Delegate other errors to Express-style response
    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

/**
 * Get all forums
 * 
 * User Story: "User: View Forums List"
 * 
 * Flow:
 * 1. Extract query parameters (page, limit, search, isPublic)
 * 2. Call service to retrieve forums with filters
 * 3. Return array of forums with 200 status
 * 
 * Prerequisites (handled by middlewares):
 * - authenticate: Ensures req.user exists and is valid
 * - requirePrivileges(['VIEW_FORUMS']): Ensures user has permission
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20)
 * - search: string (optional)
 * - isPublic: boolean (optional)
 * 
 * @param req - Express request with query params
 * @param res - Express response
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const isPublic = req.query.isPublic === 'true' ? true : 
                     req.query.isPublic === 'false' ? false : 
                     undefined;

    // Call service to get forums
    const forums = await forumsService.getAllForums(page, limit, {
      search,
      isPublic,
    });

    // Respond with forums array
    res.status(200).json(forums);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

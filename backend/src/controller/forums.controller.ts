import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createForumSchema, updateForumSchema, replyToMessageSchema } from '../validators/forum.validator';
import * as forumsService from '../service/forums.service';

/**
 * Create a new forum (Admin only)
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createForumSchema.parse(req.body);
    const userId = req.user!.userId;
    const newForum = await forumsService.createForum(validatedData, userId);
    res.status(201).json(newForum);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formatted = error.issues.map((issue) => {
        const field = issue.path?.[0];
        let message = issue.message;

        if (field === 'name') {
          if (issue.code === 'too_big') message = 'El nombre no puede exceder 100 caracteres';
          if (issue.code === 'too_small') message = 'El nombre debe tener al menos 3 caracteres';
        }

        if (field === 'description') {
          if (issue.code === 'too_big') message = 'La descripción no puede exceder 255 caracteres';
        }

        return { field, message };
      });

      res.status(400).json({ errors: formatted });
      return;
    }

    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

/**
 * Get all forums
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const isPublic = req.query.isPublic === 'true' ? true :
                     req.query.isPublic === 'false' ? false : undefined;

    const forums = await forumsService.getAllForums(page, limit, { search, isPublic });
    res.status(200).json(forums);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Update a forum (Admin only)
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateForumSchema.parse(req.body);
    const forumId = parseInt(req.params.forumId);

    if (isNaN(forumId)) {
      res.status(400).json({ field: 'forumId', message: 'ID de foro inválido' });
      return;
    }

    const updatedForum = await forumsService.updateForum(forumId, validatedData);
    res.status(200).json(updatedForum);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formatted = error.issues.map((issue) => {
        const field = issue.path?.[0];
        let message = issue.message;

        if (field === 'name') {
          if (issue.code === 'too_big') message = 'El nombre no puede exceder 100 caracteres';
          if (issue.code === 'too_small') message = 'El nombre debe tener al menos 3 caracteres';
        }

        if (field === 'description') {
          if (issue.code === 'too_big') message = 'La descripción no puede exceder 255 caracteres';
        }

        return { field, message };
      });

      res.status(400).json({ errors: formatted });
      return;
    }

    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

// Forum responses

/**
 * respond a message in a forum
 */
export const replyToMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = replyToMessageSchema.parse(req.body);
    const forumId = parseInt(req.params.forumId);

    if (isNaN(forumId)) {
      res.status(400).json({ field: 'forumId', message: 'ID de foro inválido' });
      return;
    }

    const userId = req.user!.userId;

    const reply = await forumsService.replyToMessageService(
      forumId,
      userId,
      validatedData.parentMessageId,
      validatedData.content
    );

    res.status(201).json(reply);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formatted = error.issues.map((issue) => ({
        field: issue.path?.[0],
        message: issue.message,
      }));
      res.status(400).json({ errors: formatted });
      return;
    }

    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
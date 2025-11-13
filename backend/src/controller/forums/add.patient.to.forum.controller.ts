import type { Request, Response, NextFunction } from 'express';
import { addPatientToForumService } from '../../service/forums/add.patient.to.forum.service';
import {
  addPatientToForumBodySchema,
  addPatientToForumParamsSchema
} from '../../validators/forums/add.patient.to.forum.validator';
import { BadRequestError } from '../../util/errors.util.js';

/**
 * Controller para añadir un paciente a un foro
 */
export async function addPatientToForum(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar params
    const paramsValidation = addPatientToForumParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      const errors = paramsValidation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new BadRequestError(`Invalid request parameters: ${JSON.stringify(errors)}`));
    }

    // Validar body
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

    // Llamar al servicio
    const result = await addPatientToForumService(forumId, userId, forumRole);

    // Responder
    res.status(201).json({
      success: true,
      message: 'Patient added to forum successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
}
import type { Request, Response, NextFunction } from 'express';
import { patientSelfJoinService } from '../../service/forums/patient.self.join.service';
import {
  patientSelfJoinParamsSchema
} from '../../validators/forums/patient.self.join.validator';
import { BadRequestError } from '../../util/errors.util.js';

/**
 * Controller: Patient self-join to a public forum
 */
export async function patientSelfJoin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate params
    const paramsValidation = patientSelfJoinParamsSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      const errors = paramsValidation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new BadRequestError(`Invalid request parameters: ${JSON.stringify(errors)}`));
    }

    const { forumId } = paramsValidation.data;

    // Get the authenticated user id from req.user
    const userId = req.user!.userId;

    // Call the service
    const result = await patientSelfJoinService(forumId, userId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
import { Request, Response } from 'express';
import { NotFoundError, ConflictError } from '../util/errors.util';
import * as analysisService from '../service/analysisPDF.service';


interface JwtPayload {
  id: string;
  userId: string;
  roleId: number;
  privileges: string[];
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}
// --------------------------------------------------------------

/**
 * Get analysis results (PDFs) for the authenticated patient
 */
export const getMyAnalysisResultsController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado correctamente.',
        },
      });
    }

    const userId = req.user.id;

    
    const analysisData = await analysisService.getAnalysisResultsForPatient(userId);

    
    res.status(200).json({
      success: true,
      message: 'Analysis results retrieved successfully',
      data: analysisData,
    });

  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message,
        },
      });
    } else if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT_ERROR',
          message: error.message,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    }
  }
};
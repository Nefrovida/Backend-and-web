import { Request, Response } from 'express';
import { 
  createAnalysisSchema, 
  updateAnalysisSchema,
  getAnalysesQuerySchema 
} from '../../validators/add.analysis.validator';
import * as analysisService from '../../service/analysis/add.analysis.service';
import { NotFoundError, ConflictError } from '../../util/errors.util';
import { ZodError } from 'zod';

/**
 * Create a new analysis
 */
export const createAnalysis = async (req: Request, res: Response) => {
  try {
    const validatedData = createAnalysisSchema.parse(req.body);
    const analysis = await analysisService.createAnalysis(validatedData);

    res.status(201).json({
      success: true,
      message: 'Analysis created successfully',
      data: analysis,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      });
    } else if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        error: {
          code: 'ANALYSIS_ALREADY_EXISTS',
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

/**
 * Get all analysis with pagination and search
 */
export const getAllAnalysis = async (req: Request, res: Response) => {
  try {
    const { page, limit, search } = getAnalysesQuerySchema.parse(req.query);
    const result = await analysisService.getAllAnalysis(page, limit, search);

    res.status(200).json({
      success: true,
      message: 'Analyses retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: error.errors,
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

/**
 * Get analysis by ID
 */
export const getAnalysisById = async (req: Request, res: Response) => {
  try {
    const analysisId = parseInt(req.params.id);

    if (isNaN(analysisId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Analysis ID must be a valid number',
        },
      });
      return;
    }

    const analysis = await analysisService.getAnalysisById(analysisId);

    res.status(200).json({
      success: true,
      message: 'Analysis retrieved successfully',
      data: analysis,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          code: 'ANALYSIS_NOT_FOUND',
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

/**
 * Update analysis by ID
 */
export const updateAnalysis = async (req: Request, res: Response) => {
  try {
    const analysisId = parseInt(req.params.id);

    if (isNaN(analysisId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Analysis ID must be a valid number',
        },
      });
      return;
    }

    const validatedData = updateAnalysisSchema.parse(req.body);
    const updatedAnalysis = await analysisService.updateAnalysis(analysisId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Analysis updated successfully',
      data: updatedAnalysis,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          code: 'ANALYSIS_NOT_FOUND',
          message: error.message,
        },
      });
    } else if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        error: {
          code: 'ANALYSIS_ALREADY_EXISTS',
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

/**
 * Delete analysis by ID
 */
export const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    const analysisId = parseInt(req.params.id);

    if (isNaN(analysisId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Analysis ID must be a valid number',
        },
      });
      return;
    }

    await analysisService.deleteAnalysis(analysisId);

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          code: 'ANALYSIS_NOT_FOUND',
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
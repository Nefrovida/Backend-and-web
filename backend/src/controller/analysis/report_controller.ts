import { type Request, type Response } from "express";
import * as getResultsService from "../../service/analysis/getResult.service"
import { getResultParamsSchema } from "../../validators/report.validators";
import { NotFoundError } from "../../util/errors.util";
import { ZodError } from "zod";



/*async function getResult(req: Request, res: Response) {
    const patient_analysis_id = Number(req.params.patient_analysis_id);
    
    const info = await Report.getResult(patient_analysis_id);

    if (info == null) {
        return res.status(404).json("There's no result for patient_analysis_id " + patient_analysis_id);
    }
    
    res.status(200).json(info);
}*/

// ======================
// Endpoint for Android
// ======================
export const getResultV2 = async (req: Request, res: Response) => {
  try {
    const { patient_analysis_id } = getResultParamsSchema.parse(req.params);
    const result = await getResultsService.getResultById(patient_analysis_id);

    res.status(200).json({
      success: true,
      message: "Result retrieved successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid patient_analysis_id",
          details: error.errors,
        },
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          code: "RESULT_NOT_FOUND",
          message: error.message,
        },
      });
    } else {
      console.error(error);
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      });
    }
  }
};

// ======================
// Endpoint for Android
// ======================
export const getResultByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    const result = await getResultsService.getResultByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Result retrieved successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid patient_analysis_id",
          details: error.errors,
        },
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          code: "RESULT_NOT_FOUND",
          message: error.message,
        },
      });
    } else {
      console.error(error);
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      });
    }
  }
};

async function getResult (req: Request, res: Response) {
    try {
    const id = Number(req.params.patient_analysis_id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid patient_analysis_id' });
    }

    const results = await getResultsService.getResultById(id);

        res.status(200).json(results);

    } catch (error) {
        console.log(error);
    }
}


export default getResult;
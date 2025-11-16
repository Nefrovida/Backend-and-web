import { Request, Response } from 'express';
import Report from '../../model/report.model.js';

export const getResultById = (req: Request, res: Response) => {
    const patientAnalysisId = Number(req.params.patient_analysis_id);
    return Report.getResult(patientAnalysisId);
};

export const getRiskQuestions = (req: Request, res: Response) => {
    return Report.getRiskQuestions();
};

export const getRiskOptions = (req: Request, res: Response) => {
    return Report.getRiskOptions();
}
import { Request, Response } from 'express';
import Analysis from '../../model/analysis.model.js';

export const getAnalysisByDate = (req: Request, res: Response) => {
    const dateString = req.params.date;

    return Analysis.getAnalysisByDate(dateString);

}
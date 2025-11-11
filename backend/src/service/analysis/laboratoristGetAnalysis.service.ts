import { Request, Response } from 'express';
import { PrismaClient } from '../../../prisma/database/prisma/client.js';
import Analysis from '../../model/analysis.model.js';
const prisma = new PrismaClient();

export const getAnalysisByDate = (req: Request, res: Response) => {
    const dateString = req.params.date;

    return Analysis.getAnalysisByDate(dateString);

}
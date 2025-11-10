import { Request, Response } from 'express';
import { PrismaClient } from '../../../prisma/database/prisma/client.js';
import Report from '../../model/report.model.js'
const prisma = new PrismaClient();

export const getResultById = (req: Request, res: Response) => {

    const patientAnalysisId = Number(req.params.patient_analysis_id);

    return Report.getResult(patientAnalysisId);

    return prisma.results.findFirst({
    where: {
      patient_analysis_id: patientAnalysisId
    },
    include: {
      patient_analysis: {
        include: {
            analysis: true
        }
      }
    }
    });

};
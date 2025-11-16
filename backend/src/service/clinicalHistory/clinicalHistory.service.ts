import { Request, Response } from 'express';
import CH from '../../model/clinicalHistory/clinicalHistory.model.js';


export const getRiskQuestions = (req: Request, res: Response) => {
    return CH.getRiskQuestions();
};

export const getRiskOptions = (req: Request, res: Response) => {
    return CH.getRiskOptions();
}

export const submitRiskForm = async (id:string, answers:any) => {
  return CH.postRiskFormAnswers(id, answers);
};
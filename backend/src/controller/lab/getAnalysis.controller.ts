import Laboratory from "src/model/lab.model"
import { type Request, type Response } from "express";

export default async function getAnalysis(req: Request, res: Response) {
  const analysis = await Laboratory.getAnalysis()

  res.json(analysis);
  
}
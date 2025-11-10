import { type Request, type Response } from "express";
import Laboratory from "../../model/lab.model.js";
import type { ANALYSIS_STATUS } from "@client";

async function getLabResults(req: Request, res: Response) {
    const page = Number(req.query.page);
    const name = req.query.name?.toString() ?? null
    const start = (req.query.start as string) || null
    const end = (req.query.end as string) || null
    const analysisType = req.query.analysis && JSON.parse(req.query.analysis as string).map((v: string) => Number(v))
    const statusParams = req.query.status && JSON.parse(req.query.status.toString().toUpperCase());
    const status: ANALYSIS_STATUS[] | null = statusParams.length > 0 
        ? statusParams.map((p: string) => p as ANALYSIS_STATUS)
        : null

    const patientLabResults = await Laboratory.getLabResults(page, {name, start, end, analysisType, status});

    // console.log(patientLabResults.length)
    // console.dir(patientLabResults, { depth: null, colors: true });
    
    res.json(patientLabResults);
}

export default getLabResults;
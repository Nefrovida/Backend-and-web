import { type Request, type Response } from "express";
import Laboratory from "../../model/lab.model.js";

async function getLabResults(req: Request, res: Response) {
    const page = Number(req.query.page);
    const name = req.query.name?.toString() ?? null
    const start = (req.query.start as string) || null
    const end = (req.query.end as string) || null
    const analysisType = req.query.analysis && JSON.parse(req.query.analysis as string)

    console.log(start, end)

    const patientLabResults = await Laboratory.getLabResults(page, {name, start, end, analysisType});

    // console.log(patientLabResults.length)
    // console.dir(patientLabResults, { depth: null, colors: true });
    
    res.json(patientLabResults);
}

export default getLabResults;
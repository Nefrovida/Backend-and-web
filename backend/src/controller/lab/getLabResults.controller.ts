import { type Request, type Response } from "express";
import Laboratory from "../../model/lab.model.js";

async function getLabResults(req: Request, res: Response) {
    const page = Number(req.query.page);
    const patientLabResults = await Laboratory.getLabResults(page);

    // console.log(patientLabResults.length)
    // console.dir(patientLabResults, { depth: null, colors: true });
    
    res.json(patientLabResults);
}

export default getLabResults;
import { type Request, type Response } from "express";
import Laboratory from "../../model/lab.model.js";

async function getLabResults(req: Request, res: Response) {
    const patientLabResults = await Laboratory.getLabResults();

    console.log(patientLabResults);

    res.json(patientLabResults);
}

export default getLabResults;
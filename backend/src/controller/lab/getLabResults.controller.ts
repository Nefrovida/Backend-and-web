import { Request, Response } from "express";
import Laboratory from "../../model/lab.model";

function getLabResults(req: Request, res: Response) {
    const patientLabResults = Laboratory.getLabResults();

    console.log(patientLabResults);

    res.json(patientLabResults);
}

export default getLabResults;
import { type Request, type Response } from "express";
import Report from "../../model/report.model.js";

async function getResult(req: Request, res: Response) {
    const patient_analysis_id = Number(req.params.patient_analysis_id);
    
    const info = await Report.getResult(patient_analysis_id);

    if (info == null) {
        return res.status(404).json("There's no result for patient_analysis_id " + patient_analysis_id);
    }
    
    res.status(200).json(info);
}

export default getResult;
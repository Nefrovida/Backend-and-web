import { type Request, type Response } from "express";
import * as getResultsService from "../../service/analysis/getResult.service"



/*async function getResult(req: Request, res: Response) {
    const patient_analysis_id = Number(req.params.patient_analysis_id);
    
    const info = await Report.getResult(patient_analysis_id);

    if (info == null) {
        return res.status(404).json("There's no result for patient_analysis_id " + patient_analysis_id);
    }
    
    res.status(200).json(info);
}*/

async function getResult (req: Request, res: Response) {
    try {
        
        const results = await getResultsService.getResultById(req, res);

        res.status(200).json(results);

    } catch (error) {
        console.log(error);
    }
}
export const getRiskQuestions = async (req: Request, res: Response) => {
    try {
        
        if(!req.user){
            return  res.status(401).json("Unauthorized");
        }
        const questions = await getResultsService.getRiskQuestions(req, res);

        res.status(200).json(questions);

    }
    catch (error) {
        res.status(500).json("Internal Server Error");
        console.log(error);
    }
}

export const getRiskOptions = async (req: Request, res: Response) => {
    try {
        const options = await getResultsService.getRiskOptions(req, res);

        res.status(200).json(options);
    } catch (error) {
        res.status(500).json("Internal Server Error");
        console.log(error);
    }
}

export default getResult;
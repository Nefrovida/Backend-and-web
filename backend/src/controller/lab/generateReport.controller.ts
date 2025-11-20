import { type Request, type Response } from "express";
import Laboratory from "#/src/model/lab.model";


async function generateLabReport(req: Request, res: Response) {
    try {
        // console.log("In generate lab report controller");
        // console.log("req body: ", req.body);
        const { patient_analysis_id, interpretations, recommendations } = req.body;
        const id = Number(patient_analysis_id)

        // Update recommendations/interpretations values in 'results' model object
        const result = await Laboratory.generateReport(id, interpretations, recommendations);
        
        res.status(200).json({ success: true, message: "Report submitted successfully" });
    } catch (error: any) {
        console.error("Error generating lab report: ", error);
        res.status(500).json({ success: false, message: "Server error generating the lab report" });
    }
}

export default generateLabReport;
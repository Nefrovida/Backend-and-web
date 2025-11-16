import { type Request, type Response } from "express";
// import Laboratory from "../../model/lab.model";
import Laboratory from "#/src/model/lab.model";
// import { ANALYSIS_STATUS } from "@prisma/client";

async function generateLabReport(req: Request, res: Response) {
    try {
        console.log("In generate lab report controller");
        console.log("req body: ", req.body);
        const { resultadoId, interpretations, recommendations } = req.body;
        const resultadoIdNormalized = Number(resultadoId)

        const result = await Laboratory.generateReport(resultadoIdNormalized, interpretations, recommendations);
        
        res.status(200).json({ success: true, message: "Report submitted successfully" });
    } catch (error: any) {
        console.error("Error generating lab report: ", error);
        res.status(500).json({ success: false, message: "Server error generating the lab report" });
    }
}

export default generateLabReport;
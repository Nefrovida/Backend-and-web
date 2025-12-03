import { type Request, type Response } from "express";
import * as generateLabReportService from "#/src/service/lab/lab.service";


async function generateLabReport(req: Request, res: Response) {
    try {
        const { patient_analysis_id, interpretations, recommendations } = req.body;
        const id = Number(patient_analysis_id)

        if (interpretations.length > 400 || recommendations.length > 400) {
            return res.status(400).json({ success: false, message: "Interpretaciones y recomendaciones no pueden exceder 400 caracteres" });
        }

        // Update recommendations/interpretations values in 'results' model object
        const result = await generateLabReportService.generateLabReport(id, interpretations, recommendations);
        
        res.status(200).json({ success: true, message: "Reporte subido con éxito" });
    } catch (error: any) {
        console.error("Error al generar el reporte de laboratorio: ", error);
        res.status(500).json({ success: false, message: "Error del servidor al generar reporte" });
    }
}

export default generateLabReport;
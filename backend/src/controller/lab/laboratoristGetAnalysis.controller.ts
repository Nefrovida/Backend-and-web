// controller/lab/laboratoristGetAnalysis.controller.ts
import { type Request, type Response } from "express";
import * as laboratoristService from "../../service/analysis/laboratoristGetAnalysis.service";
import { AnalysisRecord } from "../../types/AnalysisRecord";

async function getAnalysisByDay(req: Request, res: Response) {
    try {
        const analysis = await laboratoristService.getAnalysisByDate(req, res);

        const groupedAnalysis = analysis.reduce(
            (acc: Record<string, AnalysisRecord[]>, record: AnalysisRecord) => {
                const key = record.analysis_date.toISOString();

                if (!acc[key]) {
                    acc[key] = [];
                }

                acc[key].push(record);
                return acc;
            },
            {}
        );

        return res.status(200).json(groupedAnalysis);
    } catch (error) {
        console.error("Error en getAnalysisByDay:", error);
        return res
            .status(500)
            .json({ error: "Error al obtener análisis para ese día" });
    }
}

export default getAnalysisByDay;
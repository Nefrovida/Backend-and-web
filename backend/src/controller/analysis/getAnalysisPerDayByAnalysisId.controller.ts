import Analysis from "#/src/model/analysis/scheduleAnalysis.model";
import { Request, Response } from "express";


async function getAnalysisPerDayByAnalysisId(
    req: Request,
    res: Response
) {
    try {
        const targetDate = req.query.date as string;
        const analysisId = Number(req.query.analysisId);

        if (!targetDate || isNaN(analysisId)) {
            return res.status(400).json({
                error: "Missing or invalid parameters. Use: ?date=YYYY-MM-DD&analysisId=1",
            });
        }

        const analysisAppointments = await Analysis.getAnalysisPerDayByAnalysisId(
            targetDate,
            analysisId
        );

        res.json(analysisAppointments);
    } catch (error) {
        console.error("Error al conseguir el analisis por su ID:", error);
        res.status(500).json({ error: "Error al obtener analisis :(" });
    }
}

export default getAnalysisPerDayByAnalysisId;
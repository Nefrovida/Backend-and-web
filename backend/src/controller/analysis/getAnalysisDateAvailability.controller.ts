// controller/analysis/getAnalysisDateAvailability.controller.ts
import { Request, Response } from "express";
import { getAnalysisByName } from "../../service/analysis/add.analysis.service";
import * as agendaService from "../../service/agenda.service";
import { NotFoundError } from "../../util/errors.util";

const getAnalysisDateAvailability = async (req: Request, res: Response) => {
  try {
    const { analysisName, date } = req.query;

    if (!analysisName || !date) {
      return res
        .status(400)
        .json({ error: "analysisName and date are required" });
    }

    await getAnalysisByName(analysisName as string);

    const availability = await agendaService.getLaboratoryAvailability(
      date as string
    );

    return res.json(availability);
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    console.error("Error fetching laboratory availability:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch laboratory availability" });
  }
};

export default getAnalysisDateAvailability;

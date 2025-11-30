import { Request, Response } from "express";
import Agenda from "../../model/agenda.model";

async function getAnalysisById(req: Request, res: Response) {
    try {
        const idParam = req.params.id;

        if (!idParam) {
            return res
                .status(400)
                .json({ error: "Parameter 'id' is required (e.g., ?id=1)" });
        }

        const id = Number(idParam);

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: "Parameter 'id' must be a number" });
        }

        const appointment = await Agenda.getAnalysisById(id);

        res.json(appointment);
    } catch (error) {
        console.error("Error canceling appointment:", error);
        res.status(500).json({ error: "Failed to fetch appointment" });
    }
}

export default getAnalysisById;

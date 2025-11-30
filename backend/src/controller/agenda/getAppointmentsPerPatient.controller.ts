import { Request, Response } from "express";
import Agenda from "../../model/agenda.model";

async function getAppointmentsPerPatient(req: Request, res: Response) {
    try {
        const targetDate = req.query.date as string;
        const userId = req.query.id as string;

        if (!targetDate) {
            return res.status(400).json({ error: "Date parameter is required (e.g., ?date=2023-10-05)" });
        }

        if (!userId) {
            return res.status(400).json({ error: "User ID parameter is required (e.g., ?id=uuid)" });
        }

        const result = await Agenda.getAppointmentsPerPatient(targetDate, userId);

        console.log("Date:", targetDate);
        console.log("UserID:", userId);
        console.log("Appointments:", result);

        res.json(result);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
}

export default getAppointmentsPerPatient;

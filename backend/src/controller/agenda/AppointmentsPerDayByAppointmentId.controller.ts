import { Request, Response } from "express";
import Agenda from "../../model/agenda.model";

async function getAppointmentsPerDayByAppointmentId(
    req: Request,
    res: Response
) {
    try {
        const targetDate = req.query.date as string;
        const appointmentId = Number(req.query.appointmentId);

        if (!targetDate || isNaN(appointmentId)) {
            return res.status(400).json({
                error: "Missing or invalid parameters. Use: ?date=YYYY-MM-DD&appointmentId=1",
            });
        }

        const appointments = await Agenda.getAppointmentsPerDayByAppointmentId(
            targetDate,
            appointmentId
        );

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments by appointment ID:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
}

export default getAppointmentsPerDayByAppointmentId;

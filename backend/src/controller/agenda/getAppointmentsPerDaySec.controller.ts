import { Request, Response } from "express";
import Agenda from "../../model/agenda.model";

async function getAppointmentsPerDaySec(req: Request, res: Response) {
  try {
    const targetDate = req.query.date as string;
    if (!targetDate) {
      return res
        .status(400)
        .json({ error: "Date parameter is required (e.g., ?date=2023-10-05)" });
    }
    const appointmentsPerDay = await Agenda.getAppointmentsPerDaySec(
      targetDate
    );

    res.json(appointmentsPerDay);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
}

export default getAppointmentsPerDaySec;

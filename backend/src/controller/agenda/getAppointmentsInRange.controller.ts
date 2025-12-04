import { Request, Response } from "express";
import { getAppointmentsInRange } from "../../service/agenda.service";
import { AppointmentRecord } from "src/types/appointment.types";

async function getAppointmentsInRangeC(req: Request, res: Response) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        error: "Missing required query params: start and end",
      });
    }

        // Remove timezone suffix (e.g., "000Z" or "T00:00:00.000Z") to get just the date part
        const cleanStart = start.toString().split('T')[0].split(' ')[0];
        const cleanEnd = end.toString().split('T')[0].split(' ')[0];

        const appointments: AppointmentRecord[] = await getAppointmentsInRange(
            cleanStart,
            cleanEnd
        );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments in range:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAppointmentsInRangeC;

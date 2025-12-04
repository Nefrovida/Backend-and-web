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

        const appointments: AppointmentRecord[] = await getAppointmentsInRange(
            start.toString().split("T")[0],
            end.toString().split("T")[0]
        );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments in range:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getAppointmentsInRangeC;

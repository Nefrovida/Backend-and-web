import { Request, Response } from "express";
import Secretary from "../../model/secretary.model";

async function scheduleAppointment(req: Request, res: Response) {
  try {
    const {
      patientAppointmentId,
      doctorId,
      dateHour,
      duration,
      place,
      link,
    } = req.body as {
      patientAppointmentId?: number;
      doctorId?: string;
      dateHour?: string;
      duration?: number;
      place?: string;
      link?: string;
    };

    if (!patientAppointmentId) {
      return res.status(400).json({ error: "patientAppointmentId is required" });
    }

    if (!doctorId) {
      return res.status(400).json({ error: "doctorId is required" });
    }

    if (!dateHour) {
      return res.status(400).json({ error: "dateHour (ISO string) is required" });
    }

    const updated = await Secretary.scheduleAppointment(
      patientAppointmentId,
      doctorId,
      dateHour,
      duration,
      place,
      link
    );

    res.json(updated);
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    if (error instanceof Error) {
      if (error.message === "Doctor has a conflicting appointment") {
        return res.status(409).json({ error: "Doctor has a conflicting appointment at this time" });
      }
      if (error.message === "Doctor not found") {
        return res.status(404).json({ error: "Doctor not found" });
      }
      if (error.message === "Patient appointment not found") {
        return res.status(404).json({ error: "Patient appointment not found" });
      }
      if (error.message === "Invalid dateHourISO") {
        return res.status(400).json({ error: "Invalid date format" });
      }
    }
    res.status(500).json({ error: "Failed to schedule appointment" });
  }
}

export default scheduleAppointment;

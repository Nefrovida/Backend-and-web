import { Request, Response } from "express";
import Secretary from "../../model/secretary.model";

async function getDoctorAvailability(req: Request, res: Response) {
  try {
    const { doctorId } = req.params;
    const { date } = req.query as { date?: string };

    if (!doctorId) {
      return res.status(400).json({ error: "doctorId parameter is required" });
    }

    if (!date) {
      return res.status(400).json({ error: "date query parameter is required (format: YYYY-MM-DD)" });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
    }

    const availability = await Secretary.getDoctorAvailability(doctorId, date);
    res.json(availability);
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    res.status(500).json({ error: "Failed to fetch doctor availability" });
  }
}

export default getDoctorAvailability;

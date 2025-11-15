import { Request, Response } from "express";
import Secretary from "../../model/secretary.model";

async function getAppointmentRequests(req: Request, res: Response) {
  try {
    const requests = await Secretary.getAppointmentRequests();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching appointment requests:", error);
    res.status(500).json({ error: "Failed to fetch appointment requests" });
  }
}

export default getAppointmentRequests;
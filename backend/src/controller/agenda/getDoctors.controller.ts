import { Request, Response } from "express";
import Agenda from "../../model/agenda.model";

async function getDoctors(req: Request, res: Response) {
  try {
    const doctors = await Agenda.getDoctors();
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
}

export default getDoctors;

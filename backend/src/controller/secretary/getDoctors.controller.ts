import { Request, Response } from "express";
import Secretary from "../../model/secretary.model";

async function getDoctors(req: Request, res: Response) {
  try {
    const doctors = await Secretary.getDoctors();
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
}

export default getDoctors;

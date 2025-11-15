import { Request, Response } from "express";
import * as notesService from '../../service/notes.service';

async function getPatientNotes(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({
        error: "patientId query parameter is required"
      });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(patientId as string)) {
      return res.status(400).json({
        error: "patientId must be a valid UUID"
      });
    }

    const notes = await notesService.getNotesByPatient(patientId as string);

    return res.status(200).json(notes || []);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      error: "Error fetching notes"
    });
  }
}

export default getPatientNotes;
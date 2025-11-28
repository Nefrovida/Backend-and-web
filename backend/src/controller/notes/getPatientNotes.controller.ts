import { Request, Response } from "express";
import * as notesService from "../../service/notes.service";
import z from "zod";

async function getPatientNotes(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const querySchema = z.object({
      patientId: z.string().uuid(),
      page: z.preprocess(
        (v) => Number(v ?? 0),
        z.number().int().nonnegative().default(0)
      ),
    });

    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success)
      return res.status(400).json({
        errors: parsed.error.flatten(),
      });

    const { page: pageNum, patientId } = parsed.data;

    if (!patientId) {
      return res.status(200).json([]);
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(patientId as string)) {
      return res.status(400).json({
        error: "patientId must be a valid UUID",
      });
    }

    const notes = await notesService.getNotesByPatient(
      pageNum,
      patientId as string
    );

    return res.status(200).json(notes || []);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      error: "Error fetching notes",
    });
  }
}

export default getPatientNotes;

import { type Request, type Response } from "express";
import { ZodError } from "zod";
import { createNoteSchema } from "../../validators/notes.validator";
import * as notesService from "../../service/notes.service";
import { prisma } from "../../util/prisma";
import Notes from "#/src/model/notes.model";

/**
 * Controller to create a new clinical note
 */
async function postNote(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validatedData = createNoteSchema.parse(req.body);

    // Verify that the patient belongs to the authenticated doctor
    const patientBelongsToDoctor = Notes.patientBelogsToDoctor(
      userId,
      validatedData.patientId
    );

    if (!patientBelongsToDoctor) {
      return res
        .status(403)
        .json({ error: "Forbidden: patient does not belong to this doctor" });
    }

    // Create the note using the service
    const note = await notesService.createNote({
      patient_id: validatedData.patientId,
      title: validatedData.title,
      content: validatedData.content || "",
      general_notes: validatedData.general_notes,
      ailments: validatedData.ailments,
      prescription: validatedData.prescription,
      visibility: validatedData.visibility,
    });

    return res.status(201).json(note);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating note:", error);
    return res.status(500).json({
      error: "Error creating note",
    });
  }
}

export default postNote;

import { z } from "zod";

export const createNoteSchema = z.object({
  patientId: z.string().uuid({ message: "Patient ID must be a valid UUID" }),
  patient_appointment_id: z
    .number()
    .int()
    .positive({ message: "Appointment ID must be a positive integer" })
    .optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(50, "Title must not exceed 50 characters"),
  content: z.string().max(2000).optional(),
  general_notes: z.string().max(2000).optional(),
  ailments: z.string().max(2000).optional(),
  prescription: z.string().max(2000).optional(),
  visibility: z
    .preprocess((v) => (typeof v === "string" ? v === "true" : v), z.boolean())
    .optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

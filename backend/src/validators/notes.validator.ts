import { z } from 'zod';

export const createNoteSchema = z.object({
  patientId: z.string().uuid({ message: 'Patient ID must be a valid UUID' }),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title must not exceed 50 characters')
    .trim(),
  content: z.string().optional(),
  general_notes: z.string().optional(),
  ailments: z.string().optional(),
  prescription: z.string().optional(),
  visibility: z.boolean().optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
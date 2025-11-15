import { z } from 'zod';

export const createQuestionSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500, 'Description too long').trim(),
  type: z.string().min(1, 'Type is required').max(100, 'Type too long').trim(),
});

export const updateQuestionSchema = z.object({
  description: z.string().min(1, 'Description cannot be empty').max(500, 'Description too long').trim().optional(),
  type: z.string().min(1, 'Type cannot be empty').max(100, 'Type too long').trim().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const getQuestionsQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type GetQuestionsQuery = z.infer<typeof getQuestionsQuerySchema>;

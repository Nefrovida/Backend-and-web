import { z } from 'zod';

export const createAnalysisSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  previousRequirements: z
    .string()
    .min(1, 'Previous requirements are required')
    .trim(),
  generalCost: z
    .number()
    .positive('General cost must be greater than 0')
    .finite('General cost must be a valid number'),
  communityCost: z
    .number()
    .positive('Community cost must be greater than 0')
    .finite('Community cost must be a valid number'),
});

export const updateAnalysisSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, 'Description cannot be empty')
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  previousRequirements: z
    .string()
    .min(1, 'Previous requirements cannot be empty')
    .trim()
    .optional(),
  generalCost: z
    .number()
    .positive('General cost must be greater than 0')
    .finite('General cost must be a valid number')
    .optional(),
  communityCost: z
    .number()
    .positive('Community cost must be greater than 0')
    .finite('Community cost must be a valid number')
    .optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const getAnalysesQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
});

export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>;
export type UpdateAnalysisInput = z.infer<typeof updateAnalysisSchema>;
export type GetAnalysesQuery = z.infer<typeof getAnalysesQuerySchema>;
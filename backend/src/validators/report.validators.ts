import { z } from 'zod';

/**
 * Validation schema for patient_analysis_id param
 */
export const getResultParamsSchema = z.object({
  patient_analysis_id: z
    .string()
    .regex(/^\d+$/, 'patient_analysis_id must be a number')
    .transform(Number)
    .refine((val) => val > 0, 'patient_analysis_id must be positive'),
});

/**
 * Type inference from Zod schemas
 */
export type GetResultParams = z.infer<typeof getResultParamsSchema>;
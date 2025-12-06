import { z } from 'zod';

export const patientSelfJoinParamsSchema = z.object({
  forumId: z.string().regex(/^\d+$/, 'Forum ID must be a number').transform(Number)
});
import { z } from 'zod';
import { ForumRole } from '@prisma/client';

export const addPatientToForumBodySchema = z.object({
  userId: z
    .string({
      required_error: 'userId is required',
      invalid_type_error: 'userId must be a string'
    })
    .uuid('userId must be a valid UUID'),
  
  forumRole: z
    .nativeEnum(ForumRole, {
      required_error: 'forumRole is required',
      invalid_type_error: 'forumRole must be one of: OWNER, MODERATOR, MEMBER, VIEWER'
    })
});

export const addPatientToForumParamsSchema = z.object({
  forumId: z
    .string({
      required_error: 'forumId is required',
      invalid_type_error: 'forumId must be a string'
    })
    .regex(/^\d+$/, 'forumId must be a valid number')
    .transform(Number)
});

export type AddPatientToForumBodyInput = z.infer<typeof addPatientToForumBodySchema>;
export type AddPatientToForumParamsInput = z.infer<typeof addPatientToForumParamsSchema>;
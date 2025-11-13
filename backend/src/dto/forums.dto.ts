/**
 * Forum DTOs (Data Transfer Objects)
 * 
 * Schemas de validación Zod para endpoints de foros
 */

import { z } from 'zod';

// Importar enum Visibility desde Prisma
const VisibilityEnum = z.enum(['PUBLIC', 'PRIVATE']);

/**
 * Schema para crear un foro
 * POST /api/forums
 */
export const createForumSchema = z.object({
  body: z.object({
    title: z
      .string({ message: 'El título es obligatorio y debe ser texto' })
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(200, 'El título no puede exceder 200 caracteres')
      .trim(),
    
    description: z
      .string({ message: 'La descripción debe ser texto' })
      .max(2000, 'La descripción no puede exceder 2000 caracteres')
      .trim()
      .optional(),
    
    visibility: VisibilityEnum.default('PUBLIC'),
  }),
});

/**
 * Schema para actualizar visibilidad de un foro
 * PATCH /api/forums/:id
 */
export const updateForumSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'El ID del foro es obligatorio' })
      .cuid('El ID del foro no es válido'),
  }),
  body: z.object({
    visibility: VisibilityEnum,
  }),
});

/**
 * Schema para listar foros con paginación
 * GET /api/forums
 */
export const getForumsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0, 'La página debe ser mayor a 0'),
    
    limit: z
      .string()
      .optional()
      .default('20')
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0 && val <= 100, 'El límite debe estar entre 1 y 100'),
    
    visibility: VisibilityEnum.optional(),
  }),
});

/**
 * Schema para obtener un foro por ID
 * GET /api/forums/:id
 */
export const getForumByIdSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'El ID del foro es obligatorio' })
      .cuid('El ID del foro no es válido'),
  }),
});

/**
 * Schema para eliminar un foro
 * DELETE /api/forums/:id
 */
export const deleteForumSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'El ID del foro es obligatorio' })
      .cuid('El ID del foro no es válido'),
  }),
});

// Tipos TypeScript inferidos desde los schemas
export type CreateForumInput = z.infer<typeof createForumSchema>;
export type UpdateForumInput = z.infer<typeof updateForumSchema>;
export type GetForumsInput = z.infer<typeof getForumsSchema>;
export type GetForumByIdInput = z.infer<typeof getForumByIdSchema>;
export type DeleteForumInput = z.infer<typeof deleteForumSchema>;

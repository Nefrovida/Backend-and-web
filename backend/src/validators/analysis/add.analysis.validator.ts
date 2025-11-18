import { z } from 'zod';

export const createAnalysisSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'El nombre no debe exceder 50 caracteres')
    .trim(),
  description: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .max(500, 'La descripción no debe exceder 500 caracteres')
    .trim(),
  previousRequirements: z
    .string()
    .min(1, 'Los requisitos previos son obligatorios')
    .trim(),
  generalCost: z
    .number()
    .positive('El costo general debe ser mayor que 0')
    .finite('El costo general debe ser un número válido'),
  communityCost: z
    .number()
    .positive('El costo comunitario debe ser mayor que 0')
    .finite('El costo comunitario debe ser un número válido'),
});

export const updateAnalysisSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre no puede estar vacío')
      .max(50, 'El nombre no debe exceder 50 caracteres')
      .trim()
      .optional(),
    description: z
      .string()
      .min(1, 'La descripción no puede estar vacía')
      .max(500, 'La descripción no debe exceder 500 caracteres')
      .trim()
      .optional(),
    previousRequirements: z
      .string()
      .min(1, 'Los requisitos previos no pueden estar vacíos')
      .trim()
      .optional(),
    generalCost: z
      .number()
      .positive('El costo general debe ser mayor que 0')
      .finite('El costo general debe ser un número válido')
      .optional(),
    communityCost: z
      .number()
      .positive('El costo comunitario debe ser mayor que 0')
      .finite('El costo comunitario debe ser un número válido')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes modificar al menos un campo para actualizar',
  });

export const getAnalysesQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  search: z.string().optional(),
});

export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>;
export type UpdateAnalysisInput = z.infer<typeof updateAnalysisSchema>;
export type GetAnalysesQuery = z.infer<typeof getAnalysesQuerySchema>;
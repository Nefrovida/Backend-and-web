// backend/src/validators/appointments/add.appointmentType.validator.ts
import { z } from 'zod';

const MAX_COST = 100000; // 100,000

// ==============================
// CREATE SERVICE
// ==============================
export const createAppointmentTypeSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no debe exceder 50 caracteres')
    .trim(),

  general_cost: z
    .number({
      required_error: 'El costo general es obligatorio',
      invalid_type_error: 'El costo debe ser un número',
    })
    .positive('El costo debe ser mayor que 0')
    .max(MAX_COST, `El costo no debe exceder ${MAX_COST}`),

  community_cost: z
    .number()
    .positive('El costo comunitario debe ser mayor que 0')
    .max(MAX_COST, `El costo comunitario no debe exceder ${MAX_COST}`)
    .nullable()
    .optional(),

  image_url: z
    .string()
    .url('La imagen debe ser una URL válida')
    .optional(),

  doctor_id: z
    .string({
      required_error: 'El ID del doctor es obligatorio',
    })
    .uuid('El doctor_id debe ser un UUID válido'),
});


// ==============================
// UPDATE SERVICE
// ==============================
export const updateAppointmentTypeSchema = z
  .object({
    name: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(50, 'El nombre no debe exceder 50 caracteres')
      .trim()
      .optional(),

    general_cost: z
      .number()
      .positive('El costo debe ser mayor que 0')
      .max(MAX_COST, `El costo no debe exceder ${MAX_COST}`)
      .optional(),

    community_cost: z
      .number()
      .positive('El costo comunitario debe ser mayor que 0')
      .max(MAX_COST, `El costo comunitario no debe exceder ${MAX_COST}`)
      .nullable()
      .optional(),

    image_url: z
      .string()
      .url('La imagen debe ser una URL válida')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes modificar al menos un campo para actualizar',
  });


// ==============================
// GET QUERY
// ==============================
export const getAppointmentTypesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number),
  search: z.string().optional(),
});


// ==============================
// TYPES TS
// ==============================
export type CreateAppointmentTypeInput = z.infer<typeof createAppointmentTypeSchema>;
export type UpdateAppointmentTypeInput = z.infer<typeof updateAppointmentTypeSchema>;
export type GetAppointmentTypesQuery = z.infer<typeof getAppointmentTypesQuerySchema>;
// backend/src/validators/forum.validator.ts
import { z } from "zod";

/**
 * Validation schema for forum creation (Admin)
 * 
 * User Story: "Admin: Create Forums"
 * 
 * This validator ensures that data received from the frontend complies
 * with business rules before reaching the service and database.
 * 
 * Applied validations:
 * - name: string between 3 and 100 characters (matches Prisma @db.Char(100))
 * - description: string max 255 characters (matches Prisma @db.Char(255))
 * - public_status: boolean (true = public, false = private)
 * 
 * Note: The 'created_by' field is not validated here as it's obtained from the JWT token.
 * Note: The 'active' field is handled by default in Prisma (true).
 */
export const createForumSchema = z.object({
  name: z
    .string({
      required_error: "Forum name is required",
      invalid_type_error: "Name must be a text string",
    })
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a text string",
    })
    .max(255, "Description cannot exceed 255 characters")
    .trim(),

  public_status: z.boolean({
    required_error: "Visibility status is required",
    invalid_type_error: "Visibility status must be a boolean (true/false)",
  }),
});

/**
 * Type automatically inferred from the Zod schema.
 * 
 * This type represents the ALREADY VALIDATED data at runtime that reaches the controller.
 * Equivalent to:
 * {
 *   name: string;
 *   description: string;
 *   public_status: boolean;
 * }
 */
export type CreateForumInputValidated = z.infer<typeof createForumSchema>;

/**
 * User Story: "Admin: Update Forums"
 */
export const updateForumSchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim()
    .optional(),

  description: z
    .string({
      invalid_type_error: "La descripción debe ser una cadena de texto",
    })
    .max(255, "La descripción no puede exceder 255 caracteres")
    .trim()
    .optional(),

  public_status: z.boolean({
    invalid_type_error: "El estado de visibilidad debe ser un booleano (true/false)",
  }).optional(),

  active: z.boolean({
    invalid_type_error: "El estado de actividad debe ser un booleano (true/false)",
  }).optional(),
});

/**
 * Type automatically inferred from the Zod schema.
 * 
 * This type represents the ALREADY VALIDATED data at runtime that reaches the controller.
 * Equivalent to:
 * {
 *   name?: string;
 *   description?: string;
 *   public_status?: boolean;
 *   active?: boolean;
 * }
 */
export type UpdateForumInputValidated = z.infer<typeof updateForumSchema>;

/**
 * Schema for replying to a message in a forum
 */
export const replyToMessageSchema = z.object({
  parent_message_id: z.coerce.number().int().positive({
    message: 'El ID del mensaje padre debe ser un número entero positivo'
  }),
  content: z.string()
    .min(1, { message: 'El contenido no puede estar vacío' })
    .max(5000, { message: 'El contenido no puede exceder 5000 caracteres' })
    .trim()
});

/**
 * Type automatically inferred from the Zod schema.
 */
export type ReplyToMessageInputValidated = z.infer<typeof replyToMessageSchema>;
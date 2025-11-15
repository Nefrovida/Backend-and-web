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

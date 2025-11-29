import { z } from "zod";
import { Gender } from "@prisma/client";
import { checkUsernameExists } from "../model/user.model";

export const AdminSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/, "El nombre solo puede contener letras y espacios"),
  parent_last_name: z.string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(50, "El apellido paterno debe tener máximo 50 caracteres")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/, "El apellido paterno solo puede contener letras y espacios"),
  maternal_last_name: z.string()
    .min(2, "El apellido materno debe tener al menos 2 caracteres")
    .max(50, "El apellido materno debe tener máximo 50 caracteres")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/, "El apellido materno solo puede contener letras y espacios")
    .optional()
    .or(z.literal("")), // Allow empty strings for optional fields
  username: z.string()
    .regex(/^[a-zA-Z0-9_]+$/, "El usuario solo puede contener letras, números y guiones bajos")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario debe tener máximo 20 caracteres")
    .refine(
      async (username) => {
        const exists = await checkUsernameExists(username);
        return !exists;
      },
      {
        message: "Este usuario ya está registrado",
      }
    ),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña debe tener máximo 64 caracteres"),
  phone_number: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "El teléfono debe estar en formato válido (ej: +5215511435634)")
    .optional()
    .or(z.literal("")), // Allow empty strings for optional fields
  birthday:
    z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de nacimiento debe estar en formato YYYY-MM-DD")
      .optional()
      .or(z.literal("")) // Allow empty strings for optional fields
      .refine((value) => {
        if (!value) return true;
        const year = parseInt(value.split("-")[0], 10);
        return year >= 1910 && year < 2100;
      }, {
        message: "La fecha de nacimiento debe ser entre 1910 y 2099"
      }),
  gender:
    z.nativeEnum(Gender)
      .optional(),
});

export type AdminInput = z.infer<typeof AdminSchema>;

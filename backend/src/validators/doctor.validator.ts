import { z } from "zod";
import { checkUsernameExists, checkLicenseExists } from "../model/doctor.model";

export const DoctorSchema = z.object({
  name: z.string()
    .min(2, "Name must have at least 2 characters")
    .max(50, "Name max length is 50")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/, "Name can only contain letters and spaces"),
  parent_last_name: z.string()
    .min(2, "Parent last name must have at least 2 characters")
    .max(50, "Parent last name max length is 50")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/, "Parent last name can only contain letters and spaces"),
  maternal_last_name: z.string()
    .min(2, "Maternal last name must have at least 2 characters")
    .max(50, "Maternal last name max length is 50")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/, "Maternal last name can only contain letters and spaces")
    .optional(),
  username: z.string()
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, underscores")
    .min(3, "Username must have at least 3 characters")
    .max(20, "Username max length is 20")
    .refine(
      async (username) => {
        const exists = await checkUsernameExists(username);
        return !exists;
      },
      {
        message: "Username is already taken",
      }
    ),
  password: z.string()
    .min(8, "Password must have at least 8 characters")
    .max(64, "Password max length is 64"),
  phone_number: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Phone number must be in valid E.164 format")
    .optional(),
  birthday: 
    z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format")
    .optional()
    .refine((value) => {
       if (!value) return true;
       const year = parseInt(value.split("-")[0], 10);
       return year >= 1910 && year < 2100;
      }, {
        message: "Birthday must be from year 1910 or later and before year 2100"
      }),
  gender: 
    z.enum(["MALE", "FEMALE", "OTHER"])
    .optional(),
  specialty: z.string()
    .min(3, "Specialty must have at least 3 characters")
    .max(50, "Specialty max length is 50")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/, "Specialty can only contain letters and spaces"),
  license: z.string()
    .min(5, "License must have at least 5 characters")
    .max(20, "License max length is 20")
    .regex(/^[a-zA-Z0-9-]+$/, "License can only contain letters, numbers, and hyphens")
    .refine(
      async (license) => {
        const exists = await checkLicenseExists(license);
        return !exists;
      },
      {
        message: "License is already taken",
      }
    ),
}).passthrough(); // Allow extra fields but ignore them
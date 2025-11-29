import { z } from "zod";
import { Gender } from "@prisma/client";

export const AdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parent_last_name: z.string().min(1, "Last name is required"),
  maternal_last_name: z.string().optional(),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone_number: z.string().optional(),
  birthday: z.string().optional(), // YYYY-MM-DD
  gender: z.nativeEnum(Gender).optional(),
});

export type AdminInput = z.infer<typeof AdminSchema>;

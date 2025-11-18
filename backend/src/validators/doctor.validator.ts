import { z } from "zod";

export const DoctorSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  parent_last_name: z.string().min(2, "Parent last name must have at least 2 characters"),
  maternal_last_name: z.string().optional(),
  username: z.string().min(4, "Username must have at least 4 characters"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  phone_number: z.string().optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format").optional(), // will be converted to Date in service
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  specialty: z.string().min(2, "Specialty must have at least 2 characters"),
  license: z.string().min(5, "License must have at least 5 characters").max(20, "License max length is 20"),
});
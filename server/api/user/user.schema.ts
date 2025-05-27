import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

const baseProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  profilePicture: z.string().url("Invalid URL format").optional(),
  number: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  gender: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
});

export const updateStudentProfileSchema = baseProfileSchema.extend({
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
});

export const updateTeacherProfileSchema = baseProfileSchema.extend({
  titlePrefix: z.string().optional(),
  titleSuffix: z.string().optional(),
  religion: z.string().optional(),
  unit: z.string().optional(),
});

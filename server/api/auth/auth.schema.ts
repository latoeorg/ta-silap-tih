import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["TEACHER", "STUDENT"], {
    errorMap: () => ({ message: "Role must be either TEACHER or STUDENT" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

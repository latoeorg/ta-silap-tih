import { z } from "zod";

// Common validation schemas
export const commonSchemas = {
  id: z.string().cuid(),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  name: z.string().min(2).max(100),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/)
    .optional(),
  url: z.string().url().optional(),
  date: z.string().datetime().or(z.date()),
};

// Pagination schema
export const paginationSchema = z.object({
  page: z
    .string()
    .transform((val) => Number.parseInt(val) || 1)
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .transform((val) => Number.parseInt(val) || 10)
    .pipe(z.number().min(1).max(100)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Search schema
export const searchSchema = z.object({
  q: z.string().min(1).optional(),
  filters: z.record(z.string()).optional(),
});

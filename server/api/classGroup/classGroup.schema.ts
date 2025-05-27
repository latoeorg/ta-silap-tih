import { z } from "zod";

export const classGroupCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  homeroomId: z.string(),
  studentIds: z.array(z.string()).optional(),
});

export const classGroupUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  homeroomId: z.string().optional(),
});

export const classGroupParamsSchema = z.object({
  id: z.string(),
});

export const classGroupStudentsSchema = z.object({
  studentIds: z.array(z.string()),
});

export type ClassGroupCreateInput = z.infer<typeof classGroupCreateSchema>;
export type ClassGroupUpdateInput = z.infer<typeof classGroupUpdateSchema>;
export type ClassGroupParams = z.infer<typeof classGroupParamsSchema>;
export type ClassGroupStudentsInput = z.infer<typeof classGroupStudentsSchema>;

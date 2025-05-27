import { z } from 'zod';

export const subjectCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const subjectUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const subjectParamsSchema = z.object({
  id: z.string(),
});

export type SubjectCreateInput = z.infer<typeof subjectCreateSchema>;
export type SubjectUpdateInput = z.infer<typeof subjectUpdateSchema>;
export type SubjectParams = z.infer<typeof subjectParamsSchema>;
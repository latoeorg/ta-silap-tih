import { z } from "zod";
import { ExamType } from "@prisma/client";

export const assessmentWeightCreateSchema = z.object({
  subjectId: z.string().optional(),
  courseId: z.string().optional(),
  examType: z.nativeEnum(ExamType),
  weight: z.number().min(0).max(1),
  quota: z.number().int().min(1).optional(),
});

export const assessmentWeightUpdateSchema = z.object({
  subjectId: z.string().optional(),
  courseId: z.string().optional(),
  examType: z.nativeEnum(ExamType).optional(),
  weight: z.number().min(0).max(1).optional(),
  quota: z.number().int().min(1).optional(),
});

export const assessmentWeightParamsSchema = z.object({
  id: z.string(),
});

export type AssessmentWeightCreateInput = z.infer<
  typeof assessmentWeightCreateSchema
>;
export type AssessmentWeightUpdateInput = z.infer<
  typeof assessmentWeightUpdateSchema
>;
export type AssessmentWeightParams = z.infer<
  typeof assessmentWeightParamsSchema
>;

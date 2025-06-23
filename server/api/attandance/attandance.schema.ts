import { z } from "zod";
import { AttendanceStatus } from "@prisma/client";

// Schema for attendance creation
export const attendanceCreateSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  courseId: z.string().nonempty("Course ID is required"),
  date: z
    .string()
    .or(z.date())
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    }),
  status: z.nativeEnum(AttendanceStatus, {
    errorMap: () => ({ message: "Invalid attendance status" }),
  }),
});

// Schema for batch attendance creation
export const attendanceBatchSchema = z.object({
  attendances: z.array(attendanceCreateSchema),
});

// Schema for attendance update
export const attendanceUpdateSchema = z.object({
  date: z
    .string()
    .or(z.date())
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  status: z
    .nativeEnum(AttendanceStatus, {
      errorMap: () => ({ message: "Invalid attendance status" }),
    })
    .optional(),
});

// Extract types from schemas for usage in controllers and services
export type AttendanceCreateInput = z.infer<typeof attendanceCreateSchema>;
export type AttendanceBatchInput = z.infer<typeof attendanceBatchSchema>;
export type AttendanceUpdateInput = z.infer<typeof attendanceUpdateSchema>;

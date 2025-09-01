import { AttendanceStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import * as fs from "fs";
import * as path from "path";

// Define types for the attendance service
type AttendanceCreateInput = {
  userId: string;
  courseId: string;
  date: string | Date;
  status: AttendanceStatus;
};

type AttendanceBatchInput = {
  attendances: AttendanceCreateInput[];
};

type AttendanceUpdateInput = {
  date?: string | Date;
  status?: AttendanceStatus;
};

type AttendanceQuery = {
  courseId?: string;
  userId?: string;
  date?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: AttendanceStatus;
};

export class AttendanceService {
  /**
   * Create a new attendance record
   */
  static async create(data: AttendanceCreateInput) {
    const { userId, courseId, date, status } = data;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new Error("Course not found");
    }

    // Check if attendance record for this date, user and course already exists
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        courseId,
        date: new Date(date),
      },
    });

    if (existingAttendance) {
      throw new Error(
        "Attendance record already exists for this student, course, and date"
      );
    }

    // Create the attendance record
    return prisma.attendance.create({
      data: {
        userId,
        courseId,
        date: new Date(date),
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            studentProfile: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Create multiple attendance records in batch
   */
  static async createBatch(
    data: AttendanceBatchInput
  ): Promise<{ success: number; failed: number }> {
    const { attendances } = data;
    let success = 0;
    let failed = 0;

    // Process each attendance record in a transaction
    await prisma.$transaction(async (tx) => {
      for (const attendanceData of attendances) {
        try {
          const { userId, courseId, date, status } = attendanceData;

          // Check if attendance record already exists
          const existingAttendance = await tx.attendance.findFirst({
            where: {
              userId,
              courseId,
              date: new Date(date),
            },
          });

          if (existingAttendance) {
            // Update the existing record
            await tx.attendance.update({
              where: { id: existingAttendance.id },
              data: { status },
            });
          } else {
            // Create a new record
            await tx.attendance.create({
              data: {
                userId,
                courseId,
                date: new Date(date),
                status,
              },
            });
          }
          success++;
        } catch (error) {
          console.error(`Failed to create/update attendance record:`, error);
          failed++;
        }
      }
    });

    return { success, failed };
  }

  /**
   * Find attendance records with optional filtering
   */
  static async findAll(page = 1, limit = 10, filters: AttendanceQuery = {}) {
    const { courseId, userId, date, startDate, endDate, status } = filters;
    const where: any = {};

    if (courseId) where.courseId = courseId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    // Handle date filtering
    if (date) {
      where.date = new Date(date);
    } else if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the end date
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        where.date.lt = end;
      }
    }

    const skip = (page - 1) * limit;

    const [attendances, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ date: "desc" }, { userId: "asc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              studentProfile: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      attendances,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  /**
   * Find attendance records for a specific course and date
   */
  static async findByCourseAndDate(courseId: string, date: string | Date) {
    const attendances = await prisma.attendance.findMany({
      where: {
        courseId,
        date: new Date(date),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            studentProfile: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    // Also get all students enrolled in the course who don't have attendance records
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            studentProfile: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Create a record of student IDs who have attendance records
    const attendanceStudentIds = new Set(attendances.map((a) => a.userId));

    // Filter students who don't have attendance records
    const missingStudents = course.students.filter(
      (student) => !attendanceStudentIds.has(student.id)
    );

    // Return both existing attendance records and missing students
    return {
      attendances,
      missingStudents,
    };
  }

  /**
   * Find a specific attendance record
   */
  static async findByUserAndCourse(
    userId: string,
    courseId: string,
    date: string | Date
  ) {
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        courseId,
        date: new Date(date),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            studentProfile: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    return attendance;
  }

  /**
   * Update an attendance record
   */
  static async update(
    userId: string,
    courseId: string,
    date: string | Date,
    data: AttendanceUpdateInput
  ) {
    // Find the attendance record
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        courseId,
        date: new Date(date),
      },
    });

    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    // Update the attendance record
    return prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        ...(data.date ? { date: new Date(data.date) } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            studentProfile: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Delete an attendance record
   */
  static async delete(userId: string, courseId: string, date: string | Date) {
    // Find the attendance record
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        courseId,
        date: new Date(date),
      },
    });

    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    // Delete the attendance record
    return prisma.attendance.delete({
      where: { id: attendance.id },
    });
  }

  /**
   * Get attendance summary for a student in a course
   */
  static async getStudentCourseSummary(userId: string, courseId: string) {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subject: true,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Get all attendance records for this student in this course
    const attendances = await prisma.attendance.findMany({
      where: {
        userId,
        courseId,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calculate statistics
    const presentCount = attendances.filter(
      (a) => a.status === "PRESENT"
    ).length;
    const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
    const excusedCount = attendances.filter(
      (a) => a.status === "EXCUSED"
    ).length;
    const sickCount = attendances.filter((a) => a.status === "SICK").length;
    const totalCount = attendances.length;
    const attendanceRate =
      totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

    return {
      student: {
        id: user.id,
        name: user.name,
        number: user.studentProfile?.number,
      },
      course: {
        id: course.id,
        name: course.name,
        subject: course.subject?.name,
      },
      summary: {
        total: totalCount,
        present: presentCount,
        absent: absentCount,
        excused: excusedCount,
        sick: sickCount,
        attendanceRate: attendanceRate.toFixed(2) + "%",
      },
      attendances,
    };
  }

  /**
   * Verify if a teacher has access to a course
   */
  static async verifyCourseAccess(courseId: string, teacherId: string) {
    return await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: teacherId,
      },
    });
  }
}

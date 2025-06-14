import { Course, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type CourseCreateInput = {
  name: string;
  teacherId: string;
  subjectId?: string;
};

type CourseUpdateInput = {
  name?: string;
  teacherId?: string;
  subjectId?: string;
};

type CourseStudentsInput = {
  studentIds: string[];
};

export class CourseService {
  /**
   * Create a new course
   */
  static async create(data: CourseCreateInput): Promise<Course> {
    const { name, teacherId, subjectId } = data;

    // Verify teacher exists
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Verify subject exists if provided
    if (subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
      });

      if (!subject) {
        throw new Error("Subject not found");
      }
    }

    // Create course
    return prisma.course.create({
      data: {
        name,
        teacherId,
        subjectId: subjectId || null,
      },
    });
  }

  /**
   * Get all courses with optional filtering by subject
   */
  static async findAll(
    page = 1,
    limit = 10,
    subjectId?: string
  ): Promise<{
    courses: Course[];
    meta: { total: number; page: number; limit: number };
  }> {
    const where = subjectId ? { subjectId } : {};
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          subject: true,
          students: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: { 
              students: true,
              grades: true,
              attendances: true,
            },
          },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return {
      courses,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  /**
   * Find course by ID with optional includes
   */
  static async findById(id: string, include?: string[]): Promise<Course> {
    // Build include object based on requested includes
    const includeOptions: Prisma.CourseInclude = {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      subject: true,
    };

    // Add students if requested
    if (include?.includes('students')) {
      includeOptions.students = {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          studentProfile: true,
        },
      };
    }

    // Add grades if requested
    if (include?.includes('grades')) {
      includeOptions.grades = true;
    }

    // Add attendances if requested
    if (include?.includes('attendances')) {
      includeOptions.attendances = true;
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: includeOptions,
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  }

  /**
   * Update existing course
   */
  static async update(id: string, data: CourseUpdateInput): Promise<Course> {
    const { name, teacherId, subjectId } = data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Verify teacher exists if provided
    if (teacherId) {
      const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        throw new Error("Teacher not found");
      }
    }

    // Verify subject exists if provided
    if (subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
      });

      if (!subject) {
        throw new Error("Subject not found");
      }
    }

    // Update course
    return prisma.course.update({
      where: { id },
      data: {
        name,
        teacherId,
        subjectId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        subject: true,
      },
    });
  }

  /**
   * Delete course by ID
   */
  static async delete(id: string): Promise<void> {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Delete course
    await prisma.course.delete({
      where: { id },
    });
  }

  /**
   * Update students enrolled in a course
   */
  static async updateStudents(id: string, data: CourseStudentsInput): Promise<Course> {
    const { studentIds } = data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // Check if all students exist
    if (studentIds.length > 0) {
      const students = await prisma.user.findMany({
        where: {
          id: { in: studentIds },
          role: "STUDENT",
        },
      });

      if (students.length !== studentIds.length) {
        throw new Error("One or more students not found");
      }
    }

    // Update course students (replace all existing connections)
    return prisma.course.update({
      where: { id },
      data: {
        students: {
          set: studentIds.map(id => ({ id })),
        },
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
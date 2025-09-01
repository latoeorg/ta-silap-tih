import { ExamType, Grade, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type GradeCreateInput = {
  userId: string;
  courseId: string;
  examType: ExamType;
  totalScore?: number;
  components?: {
    componentId: string;
    score: number;
  }[];
};

type GradeBatchInput = {
  grades: GradeCreateInput[];
};

type GradeUpdateInput = {
  totalScore?: number;
  components?: {
    componentId: string;
    score: number;
  }[];
};

export class GradeService {
  /**
   * Create a new grade entry
   */
  static async create(data: GradeCreateInput) {
    const { userId, courseId, examType, totalScore, components } = data;

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

    // Check if grade already exists
    const existingGrade = await prisma.grade.findFirst({
      where: {
        userId,
        courseId,
        examType,
      },
    });
    if (existingGrade) {
      throw new Error(
        "Grade already exists for this student, course, and exam type"
      );
    }

    // Create grade with components in a transaction
    return await prisma.$transaction(async (tx) => {
      // Create the grade
      const grade = await tx.grade.create({
        data: {
          userId,
          courseId,
          examType,
          totalScore,
        },
      });

      // Create components if provided
      if (components && components.length > 0) {
        await Promise.all(
          components.map((component, index) =>
            tx.gradeComponent.create({
              data: {
                gradeId: grade.id,
                score: component.score,
                index: index + 1,
              },
            })
          )
        );
      }

      // Return the created grade with components
      return tx.grade.findUnique({
        where: { id: grade.id },
        include: {
          components: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });
  }

  /**
   * Create multiple grade entries in batch
   */
  static async createBatch(
    data: GradeBatchInput
  ): Promise<{ success: number; failed: number }> {
    const { grades } = data;
    let success = 0;
    let failed = 0;

    // Process each grade in a separate transaction
    for (const gradeData of grades) {
      try {
        await this.create(gradeData);
        success++;
      } catch (error) {
        console.error(
          `Failed to create grade for user ${gradeData.userId}:`,
          error
        );
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Get grades with optional filtering
   */
  static async findAll(
    page = 1,
    limit = 10,
    filters: {
      courseId?: string;
      userId?: string;
      examType?: ExamType;
    } = {},
    includeComponents = false
  ): Promise<{
    grades: Grade[];
    meta: { total: number; page: number; limit: number };
  }> {
    const { courseId, userId, examType } = filters;
    const where: Prisma.GradeWhereInput = {};

    if (courseId) where.courseId = courseId;
    if (userId) where.userId = userId;
    if (examType) where.examType = examType;

    const skip = (page - 1) * limit;

    const [grades, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ courseId: "asc" }, { userId: "asc" }, { examType: "asc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentProfile: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              subject: true,
            },
          },
          ...(includeComponents ? { components: true } : {}),
        },
      }),
      prisma.grade.count({ where }),
    ]);

    return {
      grades,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  /**
   * Find a specific grade by student, course and exam type
   */
  static async findByKey(
    userId: string,
    courseId: string,
    examType: ExamType,
    includeComponents = false
  ): Promise<Grade> {
    const grade = await prisma.grade.findFirst({
      where: {
        userId,
        courseId,
        examType,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentProfile: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
        ...(includeComponents ? { components: true } : {}),
      },
    });

    if (!grade) {
      throw new Error("Grade not found");
    }

    return grade;
  }

  /**
   * Update a grade by student, course and exam type
   */
  static async update(
    userId: string,
    courseId: string,
    examType: ExamType,
    data: GradeUpdateInput
  ) {
    const { totalScore, components } = data;

    // Find the grade
    const grade = await prisma.grade.findFirst({
      where: {
        userId,
        courseId,
        examType,
      },
      include: {
        components: true,
      },
    });

    if (!grade) {
      throw new Error("Grade not found");
    }

    // Update grade and components in a transaction
    return await prisma.$transaction(async (tx) => {
      // Update the grade
      const updatedGrade = await tx.grade.update({
        where: { id: grade.id },
        data: {
          totalScore,
        },
      });

      // Update components if provided
      if (components) {
        // Delete existing components
        await tx.gradeComponent.deleteMany({
          where: { gradeId: grade.id },
        });

        // Create new components
        await Promise.all(
          components.map((component, index) =>
            tx.gradeComponent.create({
              data: {
                gradeId: grade.id,
                score: component.score,
                index: index + 1,
              },
            })
          )
        );
      }

      // Return the updated grade with components
      return tx.grade.findUnique({
        where: { id: grade.id },
        include: {
          components: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });
  }

  /**
   * Delete a grade by student, course and exam type
   */
  static async delete(
    userId: string,
    courseId: string,
    examType: ExamType
  ): Promise<void> {
    // Find the grade
    const grade = await prisma.grade.findFirst({
      where: {
        userId,
        courseId,
        examType,
      },
    });

    if (!grade) {
      throw new Error("Grade not found");
    }

    // Delete grade and components in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete components first due to foreign key constraints
      await tx.gradeComponent.deleteMany({
        where: { gradeId: grade.id },
      });

      // Delete the grade
      await tx.grade.delete({
        where: { id: grade.id },
      });
    });
  }

  static async getGradeEachStudnet({
    userId,
    teacherId,
  }: {
    userId: string;
    teacherId: string;
  }): Promise<Grade[]> {
    return prisma.grade.findMany({
      where: {
        ...(userId !== "all" && { userId: userId }),
        ...(teacherId !== "all" && { course: { teacherId: teacherId } }),
      },
      include: {
        components: true,
        course: {
          select: {
            id: true,
            name: true,
            subject: {
              select: {
                weights: true,
              },
            },
          },
        },
        user: {
          select: {
            studentProfile: true,
          },
        },
      },
    });
  }

  /**
   * Update a specific grade component score
   */
  static async updateGradeComponent(
    userId: string,
    courseId: string,
    examType: ExamType,
    componentIndex: number,
    score: number
  ) {
    // First, find the grade
    const grade = await prisma.grade.findFirst({
      where: {
        userId,
        courseId,
        examType,
      },
      include: {
        components: true,
      },
    });

    if (!grade) {
      // Create the grade if it doesn't exist
      const newGrade = await prisma.grade.create({
        data: {
          userId,
          courseId,
          examType,
          totalScore: 0,
        },
      });

      // Create the component
      await prisma.gradeComponent.create({
        data: {
          gradeId: newGrade.id,
          score,
          index: componentIndex,
        },
      });

      return prisma.grade.findUnique({
        where: { id: newGrade.id },
        include: {
          components: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              subject: true,
            },
          },
        },
      });
    }

    // Update or create the component
    return await prisma.$transaction(async (tx) => {
      // Find existing component
      const existingComponent = await tx.gradeComponent.findFirst({
        where: {
          gradeId: grade.id,
          index: componentIndex,
        },
      });

      if (existingComponent) {
        // Update existing component
        await tx.gradeComponent.update({
          where: { id: existingComponent.id },
          data: { score },
        });
      } else {
        // Create new component
        await tx.gradeComponent.create({
          data: {
            gradeId: grade.id,
            score,
            index: componentIndex,
          },
        });
      }

      // Recalculate total score based on all components
      const allComponents = await tx.gradeComponent.findMany({
        where: { gradeId: grade.id },
      });

      const totalScore =
        allComponents.reduce((sum, comp) => sum + comp.score, 0) /
        allComponents.length;

      // Update the grade's total score
      await tx.grade.update({
        where: { id: grade.id },
        data: { totalScore },
      });

      // Return the updated grade with components
      return tx.grade.findUnique({
        where: { id: grade.id },
        include: {
          components: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              subject: true,
            },
          },
        },
      });
    });
  }
}

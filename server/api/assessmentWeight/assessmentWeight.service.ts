import {
  PrismaClient,
  AssessmentWeight,
  Course,
  Subject,
} from "@prisma/client";
import {
  AssessmentWeightCreateInput,
  AssessmentWeightUpdateInput,
} from "./assessmentWeight.schema";
import { prisma } from "../../lib/prisma";

export class AssessmentWeightService {
  static async create(
    userId: string,
    input: AssessmentWeightCreateInput
  ): Promise<AssessmentWeight> {
    const { subjectId, courseId, examType, weight, quota } = input;

    let course = null;
    let subject = null;

    if (courseId) {
      course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { subject: true },
      });

      subject = course?.subject || null;

      if (!course) throw new Error("Course not found");
    }

    if (subjectId) {
      // Check if subject exists
      subject = await prisma.subject.findUnique({
        where: { id: subjectId },
      });

      if (!subject) throw new Error("Subject not found");
    }

    // Create assessment weight
    return prisma.assessmentWeight.create({
      data: {
        subjectId: String(subject?.id),
        courseId: course?.id || null,
        examType,
        weight,
        quota: quota || 1,
        createdById: userId,
      },
    });
  }

  static async findAll(
    page = 1,
    limit = 10,
    subjectId?: string,
    courseId?: string
  ): Promise<{
    assessmentWeights: AssessmentWeight[];
    meta: { total: number; page: number; limit: number };
  }> {
    const skip = (page - 1) * limit;

    const [assessmentWeights, total] = await Promise.all([
      prisma.assessmentWeight.findMany({
        where: {
          ...(subjectId && { subjectId: subjectId || undefined }),
          ...(courseId && { courseId: courseId || undefined }),
          isDeleted: false,
        },
        skip,
        take: limit,
        include: {
          subject: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.assessmentWeight.count({
        where: {
          ...(subjectId && { subjectId: subjectId || undefined }),
          ...(courseId && { courseId: courseId || undefined }),
          isDeleted: false,
        },
      }),
    ]);

    return {
      assessmentWeights,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  static async findById(id: string): Promise<AssessmentWeight> {
    const assessmentWeight = await prisma.assessmentWeight.findUnique({
      where: { id },
      include: {
        subject: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!assessmentWeight) throw new Error("Assessment weight not found");

    return assessmentWeight;
  }

  static async update(
    id: string,
    input: AssessmentWeightUpdateInput
  ): Promise<AssessmentWeight> {
    const { subjectId, examType, weight, quota } = input;

    // Check if assessment weight exists
    const assessmentWeight = await prisma.assessmentWeight.findUnique({
      where: { id },
    });

    if (!assessmentWeight) throw new Error("Assessment weight not found");

    // Check if subject exists if provided
    if (subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
      });

      if (!subject) throw new Error("Subject not found");
    }

    // Update assessment weight
    return prisma.assessmentWeight.update({
      where: { id },
      data: {
        subjectId,
        examType,
        weight,
        quota,
      },
      include: {
        subject: true,
        createdBy: {
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

  static async delete(id: string): Promise<void> {
    // Check if assessment weight exists
    const assessmentWeight = await prisma.assessmentWeight.findUnique({
      where: { id },
    });

    if (!assessmentWeight) throw new Error("Assessment weight not found");

    // Delete assessment weight
    await prisma.assessmentWeight.delete({
      where: { id },
    });
  }
}

import { PrismaClient, AssessmentWeight } from "@prisma/client";
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
    const { subjectId, examType, weight, quota } = input;

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) throw new Error("Subject not found");

    // Create assessment weight
    return prisma.assessmentWeight.create({
      data: {
        subjectId,
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
    subjectId?: string
  ): Promise<{
    assessmentWeights: AssessmentWeight[];
    meta: { total: number; page: number; limit: number };
  }> {
    const where = subjectId ? { subjectId } : {};
    const skip = (page - 1) * limit;
    const [assessmentWeights, total] = await Promise.all([
      prisma.assessmentWeight.findMany({
        where,
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
      prisma.assessmentWeight.count({ where }),
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

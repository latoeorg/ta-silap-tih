import { PrismaClient, Subject } from "@prisma/client";
import { SubjectCreateInput, SubjectUpdateInput } from "./subject.schema";
import { prisma } from "../../lib/prisma";

export class SubjectService {
  static async create(input: SubjectCreateInput): Promise<Subject> {
    const { name } = input;

    // Create subject
    return prisma.subject.create({
      data: { name },
    });
  }

  static async findAll(
    page = 1,
    limit = 10,
    where: { userId?: string; role?: string; search?: string } = {}
  ): Promise<{
    subjects: Subject[];
    meta: { total: number; page: number; limit: number; search?: string };
  }> {
    let condition: any = {
      isDeleted: false,
    };

    if (where.search) {
      condition.OR = [
        { name: { contains: where.search, mode: "insensitive" } },
      ];
    }

    if (where.role === "TEACHER") {
      condition = {
        courses: {
          some: {
            teacherId: where.userId,
          },
        },
      };
    }
    const skip = (page - 1) * limit;
    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where: condition,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          courses: true,
          weights: true,
        },
      }),
      prisma.subject.count(),
    ]);

    return {
      subjects,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  static async findById(id: string): Promise<Subject> {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            students: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            grades: true,
            attendances: true,
          },
        },
        weights: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!subject) throw new Error("Subject not found");

    return subject;
  }

  static async update(id: string, input: SubjectUpdateInput): Promise<Subject> {
    const { name } = input;

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) throw new Error("Subject not found");

    // Update subject
    return prisma.subject.update({
      where: { id },
      data: { name },
    });
  }

  static async delete(id: string): Promise<void> {
    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) throw new Error("Subject not found");

    // Delete subject
    await prisma.subject.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

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
    limit = 10
  ): Promise<{
    subjects: Subject[];
    meta: { total: number; page: number; limit: number };
  }> {
    const skip = (page - 1) * limit;
    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
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

    // Check if subject is used in any course
    const courseCount = await prisma.course.count({
      where: { subjectId: id },
    });

    if (courseCount > 0) {
      throw new Error("Cannot delete subject that is used in courses");
    }

    // Delete subject
    await prisma.subject.delete({
      where: { id },
    });
  }
}

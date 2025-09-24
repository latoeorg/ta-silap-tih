import { ClassGroup } from "@prisma/client";
import {
  ClassGroupCreateInput,
  ClassGroupUpdateInput,
  ClassGroupStudentsInput,
} from "./classGroup.schema";
import { prisma } from "../../lib/prisma";

export class ClassGroupService {
  static async create(input: ClassGroupCreateInput): Promise<ClassGroup> {
    const { name, homeroomId, studentIds } = input;

    // Check if homeroom teacher exists
    const teacher = await prisma.user.findUnique({
      where: { id: homeroomId },
    });

    if (!teacher) throw new Error("Homeroom teacher not found");

    // Create class group
    const classGroup = await prisma.classGroup.create({
      data: {
        name,
        homeroomId,
      },
    });

    // Add students to class if provided
    if (studentIds && studentIds.length > 0) {
      await this.updateStudents(classGroup.id, { studentIds });
    }

    return classGroup;
  }

  static async findAll(page = 1, limit = 10, where: { search?: string } = {}) {
    const skip = (page - 1) * limit;

    const condition: any = {};

    if (where.search) {
      condition.OR = [
        { name: { contains: where.search, mode: "insensitive" } },
      ];
    }

    const [classGroups, total] = await Promise.all([
      prisma.classGroup.findMany({
        where: condition,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          homeroom: {
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
        },
      }),
      prisma.classGroup.count({ where: condition }),
    ]);

    return {
      classGroups,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  static async findById(id: string): Promise<ClassGroup> {
    const classGroup = await prisma.classGroup.findUnique({
      where: { id },
      include: {
        homeroom: true,
        students: true,
      },
    });

    if (!classGroup) throw new Error("Class group not found");

    return classGroup;
  }

  static async update(
    id: string,
    input: ClassGroupUpdateInput
  ): Promise<ClassGroup> {
    const { name, homeroomId } = input;

    // Check if class group exists
    const classGroup = await prisma.classGroup.findUnique({
      where: { id },
    });

    if (!classGroup) throw new Error("Class group not found");

    // Check if homeroom teacher exists if provided
    if (homeroomId) {
      const teacher = await prisma.user.findUnique({
        where: { id: homeroomId },
      });

      if (!teacher) throw new Error("Homeroom teacher not found");
    }

    // Update class group
    return prisma.classGroup.update({
      where: { id },
      data: {
        name,
        homeroomId,
      },
      include: {
        homeroom: {
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
      },
    });
  }

  static async delete(id: string): Promise<void> {
    // Check if class group exists
    const classGroup = await prisma.classGroup.findUnique({
      where: { id },
    });

    if (!classGroup) throw new Error("Class group not found");

    // Update students to remove class group
    await prisma.user.updateMany({
      where: { classGroupId: id },
      data: { classGroupId: null },
    });

    // Delete class group
    await prisma.classGroup.delete({
      where: { id },
    });
  }

  static async deleteStudents(
    id: string,
    input: ClassGroupStudentsInput
  ): Promise<ClassGroup> {
    // Check if all students exist
    const { studentIds } = input;

    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
    });

    if (students.length !== studentIds?.length)
      throw new Error("Some students not found");

    // Remove current students from class group
    await prisma.user.updateMany({
      where: { classGroupId: id },
      data: { classGroupId: null },
    });

    return prisma.classGroup.findUnique({
      where: { id },
      include: {
        homeroom: {
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
      },
    }) as Promise<ClassGroup>;
  }

  static async getStudentIdsByClassGroupId({
    class_group_id,
  }: {
    class_group_id: string;
  }) {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        classGroupId: class_group_id,
      },
    });

    return students.map((student) => student.id);
  }

  static async updateStudents(
    id: string,
    input: ClassGroupStudentsInput
  ): Promise<ClassGroup> {
    const { studentIds } = input;

    // Check if class group exists
    const classGroup = await prisma.classGroup.findUnique({
      where: { id },
    });

    if (!classGroup) throw new Error("Class group not found");

    await prisma.user.updateMany({
      where: { classGroupId: id },
      data: { classGroupId: null },
    });

    await Promise.all(
      studentIds.map((studentId) =>
        prisma.user.update({
          where: { id: studentId },
          data: { classGroupId: id },
        })
      )
    );

    // Return updated class group
    return prisma.classGroup.findUnique({
      where: { id },
      include: {
        homeroom: {
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
      },
    }) as Promise<ClassGroup>;
  }
}

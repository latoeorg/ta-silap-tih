import { prisma } from "../../lib/prisma";
import { User, Role } from "@prisma/client";
import { hashPassword } from "../../utils/bcrypt";

export class UserService {
  static async create(data: User) {
    // If password is provided, hash it
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    console.log(data);
    return await prisma.user.create({
      data,
    });
  }
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });
  }

  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });
  }

  static async getAll(params: {
    role?: string;
    roleExclude?: string;
    search?: string;
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    classGroupId?: string;
  }) {
    const {
      role,
      roleExclude,
      search,
      page,
      pageSize,
      sortBy = "createdAt",
      sortOrder = "desc",
      classGroupId,
    } = params;

    // Prepare filters
    const where: any = {};

    // // Role filter
    if (role) {
      where.role = role;
    }

    if (classGroupId) {
      where.classGroupId = classGroupId;
    }

    // // Role exclusion filter
    // if (roleExclude) {
    //   where.role = { not: roleExclude };
    // }

    // // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get paginated data
    const users = await prisma.user.findMany({
      where,
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return { users, total };
  }

  static async update(id: string, data: Partial<User>) {
    // If password is being updated, hash it
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    return await prisma.user.update({
      where: { id },
      data,
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  static async updateStudentProfile(email: string, data: any) {
    return prisma.studentProfile.update({
      where: { email },
      data,
    });
  }

  static async updateTeacherProfile(email: string, data: any) {
    return prisma.teacherProfile.update({
      where: { email },
      data,
    });
  }
}

import { prisma } from "../../lib/prisma";
import { User, Role } from "@prisma/client";
import { hashPassword } from "../../utils/bcrypt";

export class UserService {
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
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

  static async getAll(role?: Role) {
    return await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        studentProfile: role === "STUDENT",
        teacherProfile: role === "TEACHER",
      },
    });
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

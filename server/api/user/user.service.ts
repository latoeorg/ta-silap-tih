import { prisma } from "../../lib/prisma";
import { User, Role } from "@prisma/client";
import { hashPassword } from "../../utils/bcrypt";

export class UserService {
  static async create(data: User & { profileData?: any }) {
    // If password is provided, hash it
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    // Extract profile data if provided
    const { profileData, ...userData } = data;

    // Start a transaction to create user and profile together
    return await prisma.$transaction(async (tx) => {
      // Create the user first
      const user = await tx.user.create({
        data: userData,
      });

      // Create the profile based on user role
      if (user.role === Role.STUDENT) {
        await tx.studentProfile.create({
          data: {
            email: user.email,
            role: user.role,
            name: user.name,
            // Add any additional profile data provided
            ...(profileData
              ? {
                  birthPlace: profileData.birthPlace,
                  birthDate: profileData.birthDate,
                  fatherName: profileData.fatherName,
                  motherName: profileData.motherName,
                  address: profileData.address,
                  gender: profileData.gender,
                  phone: profileData.phone,
                  number: profileData.number || null, // NIK
                  profilePicture: profileData.profilePicture || null,
                }
              : {}),
          },
        });
      } else if (user.role === Role.TEACHER) {
        await tx.teacherProfile.create({
          data: {
            email: user.email,
            role: user.role,
            name: user.name,
            // Add any additional profile data provided
            ...(profileData
              ? {
                  titlePrefix: profileData.titlePrefix,
                  titleSuffix: profileData.titleSuffix,
                  birthPlace: profileData.birthPlace,
                  birthDate: profileData.birthDate,
                  religion: profileData.religion,
                  gender: profileData.gender,
                  unit: profileData.unit,
                  address: profileData.address,
                  phone: profileData.phone,
                  number: profileData.number || null, // NIP
                  profilePicture: profileData.profilePicture || null,
                }
              : {}),
          },
        });
      }

      // Return the user with the created profile
      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          studentProfile: true,
          teacherProfile: true,
        },
      });
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
    courseId?: string;
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
      courseId,
    } = params;

    // Prepare filters
    const where: any = {};

    // Role filter
    if (role) {
      where.role = role;
    }

    if (classGroupId) {
      where.classGroupId = classGroupId;
    }

    // Filter by enrolled course
    if (courseId) {
      where.enrolledCourses = {
        some: {
          id: courseId,
        },
      };
    }

    // Role exclusion filter
    // if (roleExclude) {
    //   where.role = { not: roleExclude };
    // }

    // Search filter
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

  static async update(id: string, data: any) {
    // If password is being updated, hash it
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const { profileData, ...dataUpdate } = data;

    const result = await prisma.user.update({
      where: { id },
      data: dataUpdate,
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (data.role === Role.STUDENT) {
      delete profileData.titlePrefix;
      delete profileData.titleSuffix;
      delete profileData.religion;
      delete profileData.unit;

      await prisma.studentProfile.upsert({
        where: { email: result.email },
        create: {
          ...profileData,
          role: "STUDENT",
          name: data.name,
          email: result.email,
        },
        update: {
          ...profileData,
          role: "STUDENT",
          name: data.name,
          email: result.email,
        },
      });
    }

    if (data.role === Role.TEACHER) {
      const updateProfile = profileData;
      console.log("updateProfile", updateProfile);
      await prisma.teacherProfile.upsert({
        where: { email: result.email },
        update: {
          titlePrefix: updateProfile.titlePrefix,
          titleSuffix: updateProfile.titleSuffix,
          birthPlace: updateProfile.birthPlace,
          birthDate: updateProfile.birthDate,
          religion: updateProfile.religion,
          gender: updateProfile.gender,
          unit: updateProfile.unit,
          address: updateProfile.address,
          phone: updateProfile.phone,
          number: updateProfile.number,
        },
        create: {
          email: result.email,
          role: result.role,
          name: result.name,
          titlePrefix: updateProfile.titlePrefix,
          titleSuffix: updateProfile.titleSuffix,
          birthPlace: updateProfile.birthPlace,
          birthDate: updateProfile.birthDate,
          religion: updateProfile.religion,
          number: updateProfile.number,
        },
      });
    }

    return result;
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

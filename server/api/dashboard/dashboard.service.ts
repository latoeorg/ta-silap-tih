import { prisma } from "../../lib/prisma";
import { Role } from "@prisma/client";

export class DashboardService {
  static async getStats() {
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalAdmins,
      totalClasses,
      totalSubjects,
      totalWeights,
      totalCourses,
      totalGrades,
      totalAttendances,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.TEACHER } }),
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.classGroup.count(),
      prisma.subject.count(),
      prisma.assessmentWeight.count(),
      prisma.course.count(),
      prisma.grade.count(),
      prisma.attendance.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        teachers: totalTeachers,
        students: totalStudents,
        admins: totalAdmins,
      },
      classes: {
        total: totalClasses,
      },
      subjects: {
        total: totalSubjects,
      },
      assessmentWeights: {
        total: totalWeights,
      },
      courses: {
        total: totalCourses,
      },
      grades: {
        total: totalGrades,
      },
      attendances: {
        total: totalAttendances,
      },
    };
  }

  static async getOverview() {
    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      recentUsers,
      recentClasses,
      recentSubjects,
      recentWeights,
      activeTeachers,
      activeStudents,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.classGroup.count(),
      prisma.subject.count(),
      prisma.assessmentWeight.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.user.count({
        where: {
          role: Role.TEACHER,
          teachingCourses: {
            some: {},
          },
        },
      }),
      prisma.user.count({
        where: {
          role: Role.STUDENT,
          enrolledCourses: {
            some: {},
          },
        },
      }),
    ]);

    return {
      recent: {
        users: recentUsers,
        classes: recentClasses,
        subjects: recentSubjects,
        weights: recentWeights,
      },
      active: {
        teachers: activeTeachers,
        students: activeStudents,
      },
    };
  }

  static async getUserStats(userId: string, userRole: Role) {
    switch (userRole) {
      case Role.ADMIN:
        return this.getAdminStats();
      case Role.TEACHER:
        return this.getTeacherStats(userId);
      case Role.STUDENT:
        return this.getStudentStats(userId);
      default:
        return {};
    }
  }

  private static async getAdminStats() {
    const [
      totalUsers,
      totalClasses,
      totalSubjects,
      totalCourses,
      recentUsers,
      recentClasses,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.classGroup.count(),
      prisma.subject.count(),
      prisma.course.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      prisma.classGroup.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return {
      role: "admin",
      stats: {
        totalUsers,
        totalClasses,
        totalSubjects,
        totalCourses,
        recentUsers,
        recentClasses,
      },
    };
  }

  private static async getTeacherStats(userId: string) {
    const [
      teachingCourses,
      totalStudents,
      homeroomClass,
      createdWeights,
      totalGrades,
    ] = await Promise.all([
      prisma.course.count({
        where: { teacherId: userId },
      }),
      prisma.user.count({
        where: {
          enrolledCourses: {
            some: {
              teacherId: userId,
            },
          },
        },
      }),
      prisma.classGroup.findFirst({
        where: { homeroomId: userId },
        include: {
          students: true,
        },
      }),
      prisma.assessmentWeight.count({
        where: { createdById: userId },
      }),
      prisma.grade.count({
        where: {
          course: {
            teacherId: userId,
          },
        },
      }),
    ]);

    return {
      role: "teacher",
      stats: {
        teachingCourses,
        totalStudents,
        homeroomStudents: homeroomClass?.students.length || 0,
        createdWeights,
        totalGrades,
      },
      homeroomClass: homeroomClass
        ? {
            id: homeroomClass.id,
            name: homeroomClass.name,
            studentCount: homeroomClass.students.length,
          }
        : null,
    };
  }

  private static async getStudentStats(userId: string) {
    const [
      enrolledCourses,
      totalGrades,
      totalAttendances,
      classGroup,
      recentGrades,
    ] = await Promise.all([
      prisma.course.count({
        where: {
          students: {
            some: { id: userId },
          },
        },
      }),
      prisma.grade.count({
        where: { userId },
      }),
      prisma.attendance.count({
        where: { userId },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          classGroup: true,
        },
      }),
      prisma.grade.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          course: {
            include: {
              subject: true,
            },
          },
        },
      }),
    ]);

    return {
      role: "student",
      stats: {
        enrolledCourses,
        totalGrades,
        totalAttendances,
      },
      classGroup: classGroup?.classGroup
        ? {
            id: classGroup.classGroup.id,
            name: classGroup.classGroup.name,
          }
        : null,
      recentGrades: recentGrades.map((grade) => ({
        id: grade.id,
        examType: grade.examType,
        totalScore: grade.totalScore,
        subject: grade.course?.subject?.name || "Unknown",
        course: grade.course?.name || "Unknown",
        createdAt: grade.createdAt,
      })),
    };
  }

  static async getRecentActivity(limit = 10) {
    const [recentUsers, recentClasses, recentSubjects, recentWeights] =
      await Promise.all([
        prisma.user.findMany({
          take: Math.ceil(limit / 4),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        }),
        prisma.classGroup.findMany({
          take: Math.ceil(limit / 4),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            createdAt: true,
            homeroom: {
              select: {
                name: true,
              },
            },
          },
        }),
        prisma.subject.findMany({
          take: Math.ceil(limit / 4),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        }),
        prisma.assessmentWeight.findMany({
          take: Math.ceil(limit / 4),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            examType: true,
            weight: true,
            createdAt: true,
            subject: {
              select: {
                name: true,
              },
            },
            createdBy: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

    const activities = [
      ...recentUsers.map((user) => ({
        id: user.id,
        type: "user_created",
        title: `New ${user.role.toLowerCase()} registered`,
        description: `${user.name} (${
          user.email
        }) joined as ${user.role.toLowerCase()}`,
        createdAt: user.createdAt,
        icon: "user",
      })),
      ...recentClasses.map((classGroup) => ({
        id: classGroup.id,
        type: "class_created",
        title: "New class created",
        description: `${classGroup.name} with homeroom teacher ${classGroup.homeroom.name}`,
        createdAt: classGroup.createdAt,
        icon: "academic-cap",
      })),
      ...recentSubjects.map((subject) => ({
        id: subject.id,
        type: "subject_created",
        title: "New subject added",
        description: `${subject.name} subject was added to the system`,
        createdAt: subject.createdAt,
        icon: "book-open",
      })),
      ...recentWeights.map((weight) => ({
        id: weight.id,
        type: "weight_created",
        title: "Assessment weight configured",
        description: `${weight.examType} weight (${(
          weight.weight * 100
        ).toFixed(0)}%) set for ${weight.subject.name} by ${
          weight.createdBy.name
        }`,
        createdAt: weight.createdAt,
        icon: "scale",
      })),
    ];

    return activities
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  }
}

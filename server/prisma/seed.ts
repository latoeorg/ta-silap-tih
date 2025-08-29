// prisma/seed.ts
import { PrismaClient, Role, ExamType, AttendanceStatus } from "@prisma/client";
import * as bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

// Small helpers
async function hash(pw: string) {
  return bcryptjs.hash(pw, 10);
}

async function findOrCreateSubject(name: string) {
  const existing = await prisma.subject.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.subject.create({ data: { name } });
}

async function findOrCreateCourse(args: {
  name: string;
  subjectId?: string | null;
  teacherId: string;
}) {
  const existing = await prisma.course.findFirst({
    where: {
      name: args.name,
      teacherId: args.teacherId,
      subjectId: args.subjectId ?? undefined,
    },
  });
  if (existing) return existing;
  return prisma.course.create({
    data: {
      name: args.name,
      teacherId: args.teacherId,
      subjectId: args.subjectId ?? undefined,
    },
  });
}

async function upsertUser(u: {
  email: string;
  name: string;
  role: Role;
  password: string;
}) {
  return prisma.user.upsert({
    where: { email: u.email },
    update: {
      name: u.name,
      role: u.role,
      password: await hash(u.password),
    },
    create: {
      email: u.email,
      name: u.name,
      role: u.role,
      password: await hash(u.password),
    },
  });
}

async function ensureStudentProfile(
  userEmail: string,
  data: Partial<{
    name: string;
    number: string | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
  }>
) {
  const existing = await prisma.studentProfile.findUnique({
    where: { email: userEmail },
  });
  if (existing) return existing;
  // We need role field as per schema
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
  });
  return prisma.studentProfile.create({
    data: {
      email: userEmail,
      role: user.role,
      name: data.name ?? user.name,
      number: data.number ?? null,
      gender: data.gender ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
    },
  });
}

async function ensureTeacherProfile(
  userEmail: string,
  data: Partial<{
    name: string;
    number: string | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
    titlePrefix: string | null;
    titleSuffix: string | null;
  }>
) {
  const existing = await prisma.teacherProfile.findUnique({
    where: { email: userEmail },
  });
  if (existing) return existing;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
  });
  return prisma.teacherProfile.create({
    data: {
      email: userEmail,
      role: user.role,
      name: data.name ?? user.name,
      number: data.number ?? null,
      gender: data.gender ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      titlePrefix: data.titlePrefix ?? null,
      titleSuffix: data.titleSuffix ?? null,
    },
  });
}

async function main() {
  // --- Users (Admin, Teachers, Students) ---
  const admin = await upsertUser({
    email: "admin@gmail.com",
    name: "Admin User",
    role: Role.ADMIN,
    password: "Pass1234",
  });

  const teacher1 = await upsertUser({
    email: "teacher1@school.test",
    name: "Ahmad Santoso",
    role: Role.TEACHER,
    password: "Pass1234",
  });

  const teacher2 = await upsertUser({
    email: "teacher2@school.test",
    name: "Siti Nurhaliza",
    role: Role.TEACHER,
    password: "Pass1234",
  });

  const student1 = await upsertUser({
    email: "student1@school.test",
    name: "Budi Setiawan",
    role: Role.STUDENT,
    password: "Pass1234",
  });

  const student2 = await upsertUser({
    email: "student2@school.test",
    name: "Ayu Lestari",
    role: Role.STUDENT,
    password: "Pass1234",
  });

  const student3 = await upsertUser({
    email: "student3@school.test",
    name: "Made Wirawan",
    role: Role.STUDENT,
    password: "Pass1234",
  });

  // --- Profiles ---
  await ensureTeacherProfile(teacher1.email, { titlePrefix: "Dr." });
  await ensureTeacherProfile(teacher2.email, {});
  await ensureStudentProfile(student1.email, {});
  await ensureStudentProfile(student2.email, {});
  await ensureStudentProfile(student3.email, {});

  // --- Class Group (with homeroom teacher) ---
  // Find homeroom (use teacher1)
  const homeroom = await prisma.user.findUniqueOrThrow({
    where: { email: teacher1.email },
  });
  let classGroup = await prisma.classGroup.findFirst({
    where: { name: "Kelas 10 IPA 1", homeroomId: homeroom.id },
  });
  if (!classGroup) {
    classGroup = await prisma.classGroup.create({
      data: { name: "Kelas 10 IPA 1", homeroomId: homeroom.id },
    });
  }

  // Assign students to class group (set user.classGroupId)
  await prisma.user.updateMany({
    where: { email: { in: [student1.email, student2.email, student3.email] } },
    data: { classGroupId: classGroup.id },
  });

  // --- Subjects ---
  const math = await findOrCreateSubject("Mathematics");
  const physics = await findOrCreateSubject("Physics");
  const indonesian = await findOrCreateSubject("Bahasa Indonesia");

  // --- Assessment Weights (created by teacher1) ---
  // Example: Math Quiz 30%, Daily 20%, Mid 20%, Final 30% (quota controls number of components per exam type)
  const createdById = homeroom.id;

  async function ensureWeight(
    subjectId: string,
    examType: ExamType,
    weight: number,
    quota = 1
  ) {
    const existing = await prisma.assessmentWeight.findFirst({
      where: { subjectId, examType, createdById },
    });
    if (existing) {
      if (existing.weight !== weight || existing.quota !== quota) {
        return prisma.assessmentWeight.update({
          where: { id: existing.id },
          data: { weight, quota },
        });
      }
      return existing;
    }
    return prisma.assessmentWeight.create({
      data: { subjectId, examType, weight, quota, createdById },
    });
  }

  await ensureWeight(math.id, ExamType.QUIZ, 0.3, 3);
  await ensureWeight(math.id, ExamType.DAILY, 0.2, 2);
  await ensureWeight(math.id, ExamType.MID_TERM, 0.2, 1);
  await ensureWeight(math.id, ExamType.FINAL, 0.3, 1);

  await ensureWeight(physics.id, ExamType.QUIZ, 0.25, 2);
  await ensureWeight(physics.id, ExamType.ASSIGNMENT, 0.25, 2);
  await ensureWeight(physics.id, ExamType.MID_TERM, 0.2, 1);
  await ensureWeight(physics.id, ExamType.FINAL, 0.3, 1);

  await ensureWeight(indonesian.id, ExamType.DAILY, 0.3, 3);
  await ensureWeight(indonesian.id, ExamType.MID_TERM, 0.3, 1);
  await ensureWeight(indonesian.id, ExamType.FINAL, 0.4, 1);

  // --- Courses (link subjects & teachers) ---
  const t1 = await prisma.user.findUniqueOrThrow({
    where: { email: teacher1.email },
  });
  const t2 = await prisma.user.findUniqueOrThrow({
    where: { email: teacher2.email },
  });

  const mathCourse = await findOrCreateCourse({
    name: "Mathematics X-IPA1",
    subjectId: math.id,
    teacherId: t1.id,
  });

  const physicsCourse = await findOrCreateCourse({
    name: "Physics X-IPA1",
    subjectId: physics.id,
    teacherId: t2.id,
  });

  const indoCourse = await findOrCreateCourse({
    name: "Bahasa Indonesia X-IPA1",
    subjectId: indonesian.id,
    teacherId: t1.id,
  });

  // --- Enroll students to courses (many-to-many) ---
  const s1 = await prisma.user.findUniqueOrThrow({
    where: { email: student1.email },
  });
  const s2 = await prisma.user.findUniqueOrThrow({
    where: { email: student2.email },
  });
  const s3 = await prisma.user.findUniqueOrThrow({
    where: { email: student3.email },
  });

  async function ensureEnrollment(courseId: string, studentIds: string[]) {
    // Prisma M2M connect is idempotent: it will connect existing relations without duplicating
    await prisma.course.update({
      where: { id: courseId },
      data: { students: { connect: studentIds.map((id) => ({ id })) } },
    });
  }

  await ensureEnrollment(mathCourse.id, [s1.id, s2.id, s3.id]);
  await ensureEnrollment(physicsCourse.id, [s1.id, s2.id]);
  await ensureEnrollment(indoCourse.id, [s2.id, s3.id]);

  // --- Grades & Grade Components (sample data) ---
  // Utility to create a grade with components & total
  async function upsertGradeWithComponents(args: {
    examType: ExamType;
    courseId: string;
    userId: string;
    componentScores: number[]; // each becomes a GradeComponent with index=[1..n]
  }) {
    // We’ll consider (userId, courseId, examType) as uniqueness for seed purposes
    const existing = await prisma.grade.findFirst({
      where: {
        userId: args.userId,
        courseId: args.courseId,
        examType: args.examType,
      },
      include: { components: true },
    });
    const total =
      args.componentScores.reduce((a, b) => a + b, 0) /
      args.componentScores.length;

    if (!existing) {
      const created = await prisma.grade.create({
        data: {
          examType: args.examType,
          courseId: args.courseId,
          userId: args.userId,
          totalScore: total,
          components: {
            create: args.componentScores.map((score, i) => ({
              score,
              index: i + 1,
            })),
          },
        },
      });
      return created;
    }

    // Update components (replace for simplicity)
    await prisma.gradeComponent.deleteMany({ where: { gradeId: existing.id } });
    const updated = await prisma.grade.update({
      where: { id: existing.id },
      data: {
        totalScore: total,
        components: {
          create: args.componentScores.map((score, i) => ({
            score,
            index: i + 1,
          })),
        },
      },
    });
    return updated;
  }

  // Math: 3 quizzes for s1 and s2, 2 for s3
  await upsertGradeWithComponents({
    examType: ExamType.QUIZ,
    courseId: mathCourse.id,
    userId: s1.id,
    componentScores: [80, 85, 90],
  });
  await upsertGradeWithComponents({
    examType: ExamType.QUIZ,
    courseId: mathCourse.id,
    userId: s2.id,
    componentScores: [70, 75, 78],
  });
  await upsertGradeWithComponents({
    examType: ExamType.QUIZ,
    courseId: mathCourse.id,
    userId: s3.id,
    componentScores: [88, 92],
  });

  // Physics: assignments
  await upsertGradeWithComponents({
    examType: ExamType.ASSIGNMENT,
    courseId: physicsCourse.id,
    userId: s1.id,
    componentScores: [85, 86],
  });
  await upsertGradeWithComponents({
    examType: ExamType.ASSIGNMENT,
    courseId: physicsCourse.id,
    userId: s2.id,
    componentScores: [78, 82],
  });

  // Bahasa Indonesia: daily assessments
  await upsertGradeWithComponents({
    examType: ExamType.DAILY,
    courseId: indoCourse.id,
    userId: s2.id,
    componentScores: [80, 82, 84],
  });
  await upsertGradeWithComponents({
    examType: ExamType.DAILY,
    courseId: indoCourse.id,
    userId: s3.id,
    componentScores: [86, 87, 90],
  });

  // --- Attendance samples (last 3 days) ---
  // Helper to ensure single attendance per (userId, courseId, date)
  async function ensureAttendance(
    userId: string,
    courseId: string,
    date: Date,
    status: AttendanceStatus
  ) {
    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        courseId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
    });
    if (existing) {
      if (existing.status !== status) {
        await prisma.attendance.update({
          where: { id: existing.id },
          data: { status },
        });
      }
      return existing;
    }
    return prisma.attendance.create({
      data: { userId, courseId, date, status },
    });
  }

  const today = new Date();
  const d1 = new Date(today);
  d1.setDate(today.getDate() - 1);
  const d2 = new Date(today);
  d2.setDate(today.getDate() - 2);
  const d3 = new Date(today);
  d3.setDate(today.getDate() - 3);

  // Mark some attendance
  await ensureAttendance(s1.id, mathCourse.id, d1, AttendanceStatus.PRESENT);
  await ensureAttendance(s2.id, mathCourse.id, d1, AttendanceStatus.EXCUSED);
  await ensureAttendance(s3.id, mathCourse.id, d1, AttendanceStatus.PRESENT);

  await ensureAttendance(s1.id, physicsCourse.id, d2, AttendanceStatus.PRESENT);
  await ensureAttendance(s2.id, physicsCourse.id, d2, AttendanceStatus.SICK);

  await ensureAttendance(s2.id, indoCourse.id, d3, AttendanceStatus.PRESENT);
  await ensureAttendance(s3.id, indoCourse.id, d3, AttendanceStatus.ABSENT);

  // --- Done ---
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.classGroup.count(),
    prisma.subject.count(),
    prisma.assessmentWeight.count(),
    prisma.course.count(),
    prisma.grade.count(),
    prisma.gradeComponent.count(),
    prisma.attendance.count(),
  ]);

  console.log("Seed complete. Counts:");
  console.log({
    users: counts[0],
    studentProfiles: counts[1],
    teacherProfiles: counts[2],
    classGroups: counts[3],
    subjects: counts[4],
    assessmentWeights: counts[5],
    courses: counts[6],
    grades: counts[7],
    gradeComponents: counts[8],
    attendance: counts[9],
  });
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

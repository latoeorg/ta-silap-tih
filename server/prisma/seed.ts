// prisma/seed.ts
import { PrismaClient, Role, ExamType, AttendanceStatus } from "@prisma/client";
import * as bcryptjs from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// --- Helpers ---
async function hash(pw: string) {
  return bcryptjs.hash(pw, 10);
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

async function ensureStudentProfile(userEmail: string, name: string) {
  const existing = await prisma.studentProfile.findUnique({
    where: { email: userEmail },
  });
  if (existing) return existing;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
  });
  return prisma.studentProfile.create({
    data: {
      email: userEmail,
      role: user.role,
      name,
      number: faker.string.numeric(16),
      gender: faker.person.sexType(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
    },
  });
}

async function ensureTeacherProfile(userEmail: string, name: string) {
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
      name,
      number: faker.string.numeric(18),
      gender: faker.person.sexType(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      titlePrefix: faker.helpers.arrayElement([null, "Dr.", "Prof.", "Ir."]),
      titleSuffix: faker.helpers.arrayElement([null, "M.Pd", "S.Pd", "Ph.D"]),
    },
  });
}

async function main() {
  console.log("🌱 Start seeding...");

  // --- Admin ---
  await upsertUser({
    email: "admin@school.test",
    name: "Admin",
    role: Role.ADMIN,
    password: "Pass1234",
  });

  // --- Teachers (10) ---
  const teachers = [];
  for (let i = 1; i <= 10; i++) {
    const user = await upsertUser({
      email: `teacher${i}@school.test`,
      name: faker.person.fullName(),
      role: Role.TEACHER,
      password: "Pass1234",
    });
    await ensureTeacherProfile(user.email, user.name);
    teachers.push(user);
  }

  // --- Students (80) ---
  const students = [];
  for (let i = 1; i <= 80; i++) {
    const user = await upsertUser({
      email: `student${i}@school.test`,
      name: faker.person.fullName(),
      role: Role.STUDENT,
      password: "Pass1234",
    });
    await ensureStudentProfile(user.email, user.name);
    students.push(user);
  }

  // --- Class Groups (5) ---
  const classGroups = [];
  for (let i = 1; i <= 5; i++) {
    const homeroom = faker.helpers.arrayElement(teachers);
    const cg = await prisma.classGroup.create({
      data: {
        name: `Kelas ${10 + (i % 3)} IPA ${i}`,
        homeroomId: homeroom.id,
      },
    });
    classGroups.push(cg);

    // assign 15–20 random students
    const members = faker.helpers.arrayElements(
      students,
      faker.number.int({ min: 15, max: 20 })
    );
    for (const s of members) {
      await prisma.user.update({
        where: { id: s.id },
        data: { classGroupId: cg.id },
      });
    }
  }

  // --- Subjects ---
  const subjects = await prisma.subject.createManyAndReturn({
    data: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Bahasa Indonesia",
    ].map((n) => ({ name: n })),
    skipDuplicates: true,
  });

  // --- Courses (10) ---
  const courses = [];
  for (let i = 0; i < 10; i++) {
    const subject = faker.helpers.arrayElement(subjects);
    const teacher = faker.helpers.arrayElement(teachers);
    const classGroup = faker.helpers.arrayElement(classGroups);

    const c = await prisma.course.create({
      data: {
        name: `${subject.name} ${classGroup.name}`,
        teacherId: teacher.id,
        subjectId: subject.id,
        classGroupId: classGroup.id,
      },
    });
    courses.push(c);

    // enroll ~10 students
    const enrolled = faker.helpers.arrayElements(students, 10);
    await prisma.course.update({
      where: { id: c.id },
      data: { students: { connect: enrolled.map((s) => ({ id: s.id })) } },
    });
  }

  // --- Grades (random per student/course) ---
  for (const course of courses) {
    const enrolled = await prisma.course.findUnique({
      where: { id: course.id },
      include: { students: true },
    });
    if (!enrolled) continue;

    for (const st of enrolled.students) {
      const examType = faker.helpers.arrayElement(Object.values(ExamType));
      const scores = Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => faker.number.int({ min: 60, max: 100 })
      );
      const total = scores.reduce((a, b) => a + b, 0) / scores.length;

      const grade = await prisma.grade.create({
        data: {
          examType,
          courseId: course.id,
          userId: st.id,
          totalScore: total,
          components: {
            create: scores.map((s, i) => ({ score: s, index: i + 1 })),
          },
        },
      });
    }
  }

  // --- Attendance ---
  for (const course of courses) {
    const enrolled = await prisma.course.findUnique({
      where: { id: course.id },
      include: { students: true },
    });
    if (!enrolled) continue;

    for (const st of enrolled.students) {
      for (let d = 1; d <= 5; d++) {
        await prisma.attendance.create({
          data: {
            userId: st.id,
            courseId: course.id,
            date: faker.date.recent({ days: 30 }),
            status: faker.helpers.arrayElement(Object.values(AttendanceStatus)),
          },
        });
      }
    }
  }

  console.log("✅ Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

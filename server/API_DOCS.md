# REST API Documentation

This document describes the available REST API endpoints for the project. All endpoints are prefixed with `/api` (adjust as needed for your deployment).

---

## API Request/Response Types

Below are the main TypeScript interfaces and types for API requests and responses:

```ts
// User
export interface UpdateUserInput {
  email?: string;
  name?: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}
export interface UpdateStudentProfileInput {
  name?: string;
  profilePicture?: string;
  number?: string;
  birthPlace?: string;
  birthDate?: string | Date;
  gender?: string;
  address?: string;
  phone?: string;
  status?: string;
  fatherName?: string;
  motherName?: string;
}
export interface UpdateTeacherProfileInput {
  name?: string;
  profilePicture?: string;
  number?: string;
  birthPlace?: string;
  birthDate?: string | Date;
  gender?: string;
  address?: string;
  phone?: string;
  status?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  religion?: string;
  unit?: string;
}

// Class Group
export interface ClassGroupCreateInput {
  name: string;
  homeroomId: string;
  studentIds?: string[];
}
export interface ClassGroupUpdateInput {
  name?: string;
  homeroomId?: string;
}
export interface ClassGroupStudentsInput {
  studentIds: string[];
}

// Subject
export interface SubjectCreateInput {
  name: string;
}
export interface SubjectUpdateInput {
  name: string;
}

// Assessment Weight
import { ExamType } from "@prisma/client";
export interface AssessmentWeightCreateInput {
  subjectId: string;
  examType: ExamType;
  weight: number; // 0-1
  quota?: number;
}
export interface AssessmentWeightUpdateInput {
  subjectId?: string;
  examType?: ExamType;
  weight?: number;
  quota?: number;
}

// Grade
export interface GradeComponentInput {
  componentId: string;
  score: number;
}
export interface GradeCreateInput {
  userId: string;
  courseId: string;
  examType: ExamType;
  totalScore?: number;
  components?: GradeComponentInput[];
}
export interface GradeBatchInput {
  grades: GradeCreateInput[];
}
export interface GradeUpdateInput {
  totalScore?: number;
  components?: GradeComponentInput[];
}

// Attendance
import { AttendanceStatus } from "@prisma/client";
export interface AttendanceCreateInput {
  userId: string;
  courseId: string;
  date: string | Date;
  status: AttendanceStatus;
}
export interface AttendanceBatchInput {
  attendances: AttendanceCreateInput[];
}
export interface AttendanceUpdateInput {
  date?: string | Date;
  status?: AttendanceStatus;
}
```

---

## Table of Contents

- [User](#user)
- [Class Group](#class-group)
- [Subject](#subject)
- [Assessment Weight](#assessment-weight)
- [Dashboard](#dashboard)
- [Course](#course)
- [Grade](#grade)
- [Grade Component](#grade-component)
- [Attendance](#attendance)

---

## User

### Get all users

`GET /api/user/`

### Create user

`POST /api/user/`

### Get user by ID

`GET /api/user/:id`

### Update user

`PUT /api/user/:id`

### Update profile

`PUT /api/user/profile/update`

### Delete user

`DELETE /api/user/:id`

---

## Class Group

### Create class group

`POST /api/class-group/`

### Delete class group

`DELETE /api/class-group/:id`

### Get all class groups

`GET /api/class-group/`

### Get class group by ID

`GET /api/class-group/:id`

### Update class group

`PUT /api/class-group/:id`

### Update class group students

`PUT /api/class-group/:id/students`

### Delete class group students

`DELETE /api/class-group/:id/students`

---

## Subject

### Create subject

`POST /api/subject/`

### Update subject

`PUT /api/subject/:id`

### Delete subject

`DELETE /api/subject/:id`

### Get all subjects

`GET /api/subject/`

### Get subject by ID

`GET /api/subject/:id`

---

## Assessment Weight

### Create assessment weight

`POST /api/assessment-weight/`

### Get all assessment weights

`GET /api/assessment-weight/`

### Get assessment weight by ID

`GET /api/assessment-weight/:id`

### Update assessment weight

`PUT /api/assessment-weight/:id`

### Delete assessment weight

`DELETE /api/assessment-weight/:id`

---

## Dashboard

### Get stats

`GET /api/dashboard/stats`

### Get overview

`GET /api/dashboard/overview`

### Get user stats

`GET /api/dashboard/user-stats`

### Get recent activity

`GET /api/dashboard/recent-activity`

---

## Course

### Create course

`POST /api/course/`

### Get all courses

`GET /api/course/`

### Get course by ID

`GET /api/course/:id`

### Update course

`PUT /api/course/:id`

### Delete course

`DELETE /api/course/:id`

### Update course students

`PUT /api/course/:id/students`

---

## Grade

### Create grade

`POST /api/grade/`

### Create batch grades

`POST /api/grade/batch`

### Get all grades

`GET /api/grade/`

### Get grade components

`GET /api/grade/components`

### Get grade by key

`GET /api/grade/:userId/:courseId/:examType`

### Update grade

`PUT /api/grade/:userId/:courseId/:examType`

### Delete grade

`DELETE /api/grade/:userId/:courseId/:examType`

### Get grade for student by teacher

`GET /api/grade/student/:userId/teacher/:teacherId`

---

## Grade Component

### Get grade components

`GET /api/grade-components/`

### Define grade components

`POST /api/grade-components/define`

---

## Attendance

### Create attendance

`POST /api/attendance/`

### Create batch attendance

`POST /api/attendance/batch`

### Get all attendance

`GET /api/attendance/`

### Get attendance by course

`GET /api/attendance/course/:courseId`

### Get attendance by user and course

`GET /api/attendance/student/:userId/course/:courseId`

### Get attendance summary for student in course

`GET /api/attendance/summary/student/:userId/course/:courseId`

### Update attendance

`PUT /api/attendance/:userId/:courseId`

### Delete attendance

`DELETE /api/attendance/:userId/:courseId`

---

> **Note:** All endpoints require authentication via Bearer token unless otherwise specified. Replace `<token>` with your JWT access token.

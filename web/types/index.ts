export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  createdAt: string;
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
}

export interface StudentProfile {
  id: string;
  email: string;
  role: string;
  profilePicture?: string;
  number?: string;
  name: string;
  birthPlace?: string;
  birthDate?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  gender?: string;
  phone?: string;
  status?: string;
}

export interface TeacherProfile {
  id: string;
  email: string;
  role: string;
  profilePicture?: string;
  number?: string;
  name: string;
  titlePrefix?: string;
  titleSuffix?: string;
  birthPlace?: string;
  birthDate?: string;
  religion?: string;
  gender?: string;
  unit?: string;
  address?: string;
  phone?: string;
  status?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  homeroomId: string;
  homeroom: User;
  students: User[];
}

export interface Subject {
  id: string;
  name: string;
}

export interface AssessmentWeight {
  id: string;
  subjectId: string;
  examType: "DAILY" | "MID_TERM" | "FINAL" | "QUIZ" | "ASSIGNMENT";
  weight: number;
  quota: number;
  createdById: string;
  subject: Subject;
  createdBy: User;
}

export interface DashboardStats {
  users: {
    total: number;
    teachers: number;
    students: number;
    admins: number;
  };
  classes: {
    total: number;
  };
  subjects: {
    total: number;
  };
  assessmentWeights: {
    total: number;
  };
  courses: {
    total: number;
  };
  grades: {
    total: number;
  };
  attendances: {
    total: number;
  };
}

export interface DashboardOverview {
  recent: {
    users: number;
    classes: number;
    subjects: number;
    weights: number;
  };
  active: {
    teachers: number;
    students: number;
  };
}

export interface UserStats {
  role: string;
  stats: any;
  homeroomClass?: {
    id: string;
    name: string;
    studentCount: number;
  };
  classGroup?: {
    id: string;
    name: string;
  };
  recentGrades?: Array<{
    id: string;
    examType: string;
    totalScore: number;
    subject: string;
    course: string;
    createdAt: string;
  }>;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  icon: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

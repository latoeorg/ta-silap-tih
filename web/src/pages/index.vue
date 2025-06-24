<template>
  <div class="grades-container">
    <div class="header-section">
      <h2 class="page-title">
        Beranda
      </h2>
      <div class="student-info" v-if="user">
        <span class="student-name">{{ user.name || "Student Name" }}</span>
        <span class="student-id">ID: {{ user.id }}</span>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-container">
        <table class="grades-table">
          <thead>
            <tr>
              <th rowspan="2" class="header-main">No</th>
              <th rowspan="2" class="header-main">NIK</th>
              <th rowspan="2" class="header-main">Student Name</th>
              <th rowspan="2" class="header-main">Course Name</th>
              <th colspan="3" class="header-group assignment">
                Assignment ({{ getWeightPercent("ASSIGNMENT") }})
              </th>
              <th colspan="2" class="header-group quiz">
                Quiz ({{ getWeightPercent("QUIZ") }})
              </th>
              <th colspan="2" class="header-group daily">
                Daily Exam ({{ getWeightPercent("DAILY") }})
              </th>
              <th colspan="3" class="header-group midterm">
                Mid Term Exam ({{ getWeightPercent("MID_TERM") }})
              </th>
              <th colspan="2" class="header-group final">
                Final Exam ({{ getWeightPercent("FINAL") }})
              </th>
              <th rowspan="2" class="header-main total">Total Score</th>
              <th rowspan="2" class="header-main grade">Grade</th>
              <th rowspan="2" class="header-main status">Status</th>
            </tr>
            <tr>
              <!-- Assignment columns -->
              <th class="header-sub assignment">A1</th>
              <th class="header-sub assignment">A2</th>
              <th class="header-sub assignment">A3</th>
              <!-- Quiz columns -->
              <th class="header-sub quiz">Q1</th>
              <th class="header-sub quiz">Q2</th>
              <!-- Daily Exam columns -->
              <th class="header-sub daily">D1</th>
              <th class="header-sub daily">D2</th>
              <!-- Mid Term columns -->
              <th class="header-sub midterm">M1</th>
              <th class="header-sub midterm">M2</th>
              <th class="header-sub midterm">M3</th>
              <!-- Final Exam columns -->
              <th class="header-sub final">F1</th>
              <th class="header-sub final">F2</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="19" class="loading-cell">
                <div class="loading-spinner"></div>
                Loading grades...
              </td>
            </tr>
            <tr v-else-if="error">
              <td colspan="19" class="error-cell">
                {{ error }}
              </td>
            </tr>
            <tr v-else-if="processedGrades.length === 0">
              <td colspan="19" class="empty-cell">No grades available</td>
            </tr>
            <tr
              v-else
              v-for="(course, index) in processedGrades"
              :key="`${course.studentId}-${course.courseId}`"
              :class="{
                'row-even': index % 2 === 0,
                'row-odd': index % 2 === 1,
              }"
            >
              <td class="cell-center">{{ index + 1 }}</td>
              <td class="cell-nik">{{ course.studentNik || "-" }}</td>
              <td class="cell-student-name">{{ course.studentName || "-" }}</td>
              <td class="cell-course">{{ course.courseName }}</td>

              <!-- Assignment Scores -->
              <td
                class="cell-score assignment"
                :class="getScoreClass(course.assignment.a1)"
              >
                {{ course.assignment.a1 !== null ? course.assignment.a1 : "-" }}
              </td>
              <td
                class="cell-score assignment"
                :class="getScoreClass(course.assignment.a2)"
              >
                {{ course.assignment.a2 !== null ? course.assignment.a2 : "-" }}
              </td>
              <td
                class="cell-score assignment"
                :class="getScoreClass(course.assignment.a3)"
              >
                {{ course.assignment.a3 !== null ? course.assignment.a3 : "-" }}
              </td>

              <!-- Quiz Scores -->
              <td
                class="cell-score quiz"
                :class="getScoreClass(course.quiz.q1)"
              >
                {{ course.quiz.q1 !== null ? course.quiz.q1 : "-" }}
              </td>
              <td
                class="cell-score quiz"
                :class="getScoreClass(course.quiz.q2)"
              >
                {{ course.quiz.q2 !== null ? course.quiz.q2 : "-" }}
              </td>

              <!-- Daily Exam Scores -->
              <td
                class="cell-score daily"
                :class="getScoreClass(course.daily.d1)"
              >
                {{ course.daily.d1 !== null ? course.daily.d1 : "-" }}
              </td>
              <td
                class="cell-score daily"
                :class="getScoreClass(course.daily.d2)"
              >
                {{ course.daily.d2 !== null ? course.daily.d2 : "-" }}
              </td>

              <!-- Mid Term Exam Scores -->
              <td
                class="cell-score midterm"
                :class="getScoreClass(course.midterm.m1)"
              >
                {{ course.midterm.m1 !== null ? course.midterm.m1 : "-" }}
              </td>
              <td
                class="cell-score midterm"
                :class="getScoreClass(course.midterm.m2)"
              >
                {{ course.midterm.m2 !== null ? course.midterm.m2 : "-" }}
              </td>
              <td
                class="cell-score midterm"
                :class="getScoreClass(course.midterm.m3)"
              >
                {{ course.midterm.m3 !== null ? course.midterm.m3 : "-" }}
              </td>

              <!-- Final Exam Scores -->
              <td
                class="cell-score final"
                :class="getScoreClass(course.final.f1)"
              >
                {{ course.final.f1 !== null ? course.final.f1 : "-" }}
              </td>
              <td
                class="cell-score final"
                :class="getScoreClass(course.final.f2)"
              >
                {{ course.final.f2 !== null ? course.final.f2 : "-" }}
              </td>

              <!-- Calculated Fields -->
              <td class="cell-total" :class="getScoreClass(course.totalScore)">
                {{
                  course.totalScore !== null
                    ? course.totalScore.toFixed(1)
                    : "-"
                }}
              </td>
              <td class="cell-grade" :class="getGradeClass(course.letterGrade)">
                {{ course.letterGrade }}
              </td>
              <td class="cell-status" :class="getStatusClass(course.status)">
                {{ course.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Summary Section -->
    <div class="summary-section" v-if="processedGrades.length > 0">
      <div class="summary-card">
        <h3>Grade Summary</h3>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Total Students:</span>
            <span class="stat-value">{{ uniqueStudentsCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Courses:</span>
            <span class="stat-value">{{ uniqueCoursesCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Average Score:</span>
            <span class="stat-value">{{ overallAverage.toFixed(1) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Passed Courses:</span>
            <span class="stat-value">{{ passedCourses }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Failed Courses:</span>
            <span class="stat-value">{{ failedCourses }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosInstance from "@/utils/axios";

const store = useVuex();
const user = computed(() => store.state.app.user);

// Reactive data
const grades = ref([]);
const loading = ref(true);
const error = ref(null);
const subjectWeights = ref({});

// Computed properties
const processedGrades = computed(() => {
  if (!grades.value || grades.value.length === 0) return [];

  // Group grades by student and course combination
  const gradeMap = new Map();

  grades.value.forEach((grade) => {
    const studentId = grade.userId;
    const courseId = grade.courseId;
    const key = `${studentId}-${courseId}`;
    const courseName = grade.course?.name;
    const studentName = grade.user?.studentProfile?.name || "Unknown Student";
    const studentNik = grade.user?.studentProfile?.number || null; // Using 'number' field as NIK
    const subjectId = grade.course?.subjectId;

    if (!gradeMap.has(key)) {
      gradeMap.set(key, {
        studentId,
        courseId,
        studentName,
        studentNik,
        courseName,
        subjectId,
        assignment: { a1: null, a2: null, a3: null },
        quiz: { q1: null, q2: null },
        daily: { d1: null, d2: null },
        midterm: { m1: null, m2: null, m3: null },
        final: { f1: null, f2: null },
      });
    }

    const gradeData = gradeMap.get(key);

    // Process components based on exam type
    if (grade.examType === "ASSIGNMENT") {
      grade.components.forEach((component) => {
        if (component.index === 1) gradeData.assignment.a1 = component.score;
        if (component.index === 2) gradeData.assignment.a2 = component.score;
        if (component.index === 3) gradeData.assignment.a3 = component.score;
      });
    } else if (grade.examType === "QUIZ") {
      grade.components.forEach((component) => {
        if (component.index === 1) gradeData.quiz.q1 = component.score;
        if (component.index === 2) gradeData.quiz.q2 = component.score;
      });
    } else if (grade.examType === "DAILY") {
      grade.components.forEach((component) => {
        if (component.index === 1) gradeData.daily.d1 = component.score;
        if (component.index === 2) gradeData.daily.d2 = component.score;
      });
    } else if (grade.examType === "MID_TERM") {
      grade.components.forEach((component) => {
        if (component.index === 1) gradeData.midterm.m1 = component.score;
        if (component.index === 2) gradeData.midterm.m2 = component.score;
        if (component.index === 3) gradeData.midterm.m3 = component.score;
      });
    } else if (grade.examType === "FINAL") {
      grade.components.forEach((component) => {
        if (component.index === 1) gradeData.final.f1 = component.score;
        if (component.index === 2) gradeData.final.f2 = component.score;
      });
    }
  });

  // Calculate total scores and grades
  return Array.from(gradeMap.values()).map((gradeData) => {
    const totalScore = calculateTotalScore(gradeData);
    const letterGrade = calculateLetterGrade(totalScore);
    const status = totalScore >= 60 ? "PASS" : "FAIL";

    return {
      ...gradeData,
      totalScore,
      letterGrade,
      status,
    };
  });
});

const overallAverage = computed(() => {
  if (processedGrades.value.length === 0) return 0;
  const total = processedGrades.value.reduce(
    (sum, grade) => sum + (grade.totalScore || 0),
    0
  );
  return total / processedGrades.value.length;
});

const passedCourses = computed(() => {
  return processedGrades.value.filter((grade) => grade.status === "PASS")
    .length;
});

const failedCourses = computed(() => {
  return processedGrades.value.filter((grade) => grade.status === "FAIL")
    .length;
});

const uniqueStudentsCount = computed(() => {
  const uniqueStudents = new Set(
    processedGrades.value.map((grade) => grade.studentId)
  );
  return uniqueStudents.size;
});

const uniqueCoursesCount = computed(() => {
  const uniqueCourses = new Set(
    processedGrades.value.map((grade) => grade.courseId)
  );
  return uniqueCourses.size;
});

// Methods
const calculateTotalScore = (gradeData) => {
  // Get weights for this subject from the subjectWeights
  const weights = subjectWeights.value[gradeData.subjectId] || {
    ASSIGNMENT: 0.2,
    QUIZ: 0.2,
    DAILY: 0.2,
    MID_TERM: 0.3,
    FINAL: 0.1,
  };

  let totalScore = 0;
  let hasScores = false;

  // Assignment average (weight from API or default 20%)
  const assignmentScores = [
    gradeData.assignment.a1,
    gradeData.assignment.a2,
    gradeData.assignment.a3,
  ].filter((s) => s !== null);
  if (assignmentScores.length > 0) {
    const assignmentAvg =
      assignmentScores.reduce((a, b) => a + b, 0) / assignmentScores.length;
    totalScore += assignmentAvg * weights.ASSIGNMENT;
    hasScores = true;
  }

  // Quiz average (weight from API or default 20%)
  const quizScores = [gradeData.quiz.q1, gradeData.quiz.q2].filter(
    (s) => s !== null
  );
  if (quizScores.length > 0) {
    const quizAvg = quizScores.reduce((a, b) => a + b, 0) / quizScores.length;
    totalScore += quizAvg * weights.QUIZ;
    hasScores = true;
  }

  // Daily average (weight from API or default 20%)
  const dailyScores = [gradeData.daily.d1, gradeData.daily.d2].filter(
    (s) => s !== null
  );
  if (dailyScores.length > 0) {
    const dailyAvg =
      dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length;
    totalScore += dailyAvg * weights.DAILY;
    hasScores = true;
  }

  // Midterm average (weight from API or default 30%)
  const midtermScores = [
    gradeData.midterm.m1,
    gradeData.midterm.m2,
    gradeData.midterm.m3,
  ].filter((s) => s !== null);
  if (midtermScores.length > 0) {
    const midtermAvg =
      midtermScores.reduce((a, b) => a + b, 0) / midtermScores.length;
    totalScore += midtermAvg * weights.MID_TERM;
    hasScores = true;
  }

  // Final average (weight from API or default 10%)
  const finalScores = [gradeData.final.f1, gradeData.final.f2].filter(
    (s) => s !== null
  );
  if (finalScores.length > 0) {
    const finalAvg =
      finalScores.reduce((a, b) => a + b, 0) / finalScores.length;
    totalScore += finalAvg * weights.FINAL;
    hasScores = true;
  }

  return hasScores ? totalScore : null;
};

const calculateLetterGrade = (score) => {
  if (score === null) return "-";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const getScoreClass = (score) => {
  if (score === null) return "score-missing";
  if (score >= 90) return "score-excellent";
  if (score >= 80) return "score-good";
  if (score >= 70) return "score-average";
  if (score >= 60) return "score-below";
  return "score-fail";
};

const getGradeClass = (grade) => {
  const gradeClasses = {
    A: "grade-a",
    B: "grade-b",
    C: "grade-c",
    D: "grade-d",
    F: "grade-f",
  };
  return gradeClasses[grade] || "grade-default";
};

const getStatusClass = (status) => {
  return status === "PASS" ? "status-pass" : "status-fail";
};

// Returns the weight percentage for a given exam type (e.g., "ASSIGNMENT")
const getWeightPercent = (examType) => {
  // Use the first subject's weights as a reference (or fallback to default)
  let weights = null;
  if (processedGrades.value.length > 0) {
    const subjectId = processedGrades.value[0].subjectId;
    weights = subjectWeights.value[subjectId];
  }
  // Default weights if not found
  const defaultWeights = {
    ASSIGNMENT: 0.2,
    QUIZ: 0.2,
    DAILY: 0.2,
    MID_TERM: 0.3,
    FINAL: 0.1,
  };
  const weight = weights?.[examType] ?? defaultWeights[examType] ?? 0;
  return `${Math.round(weight * 100)}%`;
};

// Process weights from API data
const processWeights = (apiData) => {
  const weights = {};

  if (apiData && apiData.id && apiData.weights) {
    // Create weight object for this subject
    const weightObj = {};
    apiData.weights.forEach((w) => {
      weightObj[w.examType] = w.weight; // Store weight as a decimal
    });
    weights[apiData.id] = weightObj;
  }

  return weights;
};

const fetchGrades = async () => {
  if (!user.value) return;

  loading.value = true;
  error.value = null;

  try {
    let gradeResponse;

    if (user.value.role === "STUDENT") {
      gradeResponse = await axiosInstance.get(
        `/grade/student/${user.value.id}/teacher/all`
      );
    } else if (user.value.role === "TEACHER") {
      gradeResponse = await axiosInstance.get(
        `/grade/student/all/teacher/${user.value.id}`
      );
    } else if (user.value.role === "ADMIN") {
      gradeResponse = await axiosInstance.get(`/grade/student/all/teacher/all`);
    }

    if (gradeResponse?.data?.success) {
      grades.value = gradeResponse.data.data;

      // Extract subjects from the API response
      const subjects = extractSubjects(gradeResponse.data.data);

      // Fetch subject weights for each subject
      const weightsData = {};

      for (const subjectId of subjects) {
        try {
          const subjectResponse = await axiosInstance.get(
            `/subject/${subjectId}`
          );
          if (subjectResponse?.data?.success) {
            const subjectData = subjectResponse.data.data;
            // Process weights for this subject
            const subjectWeightObj = {};

            if (subjectData.weights) {
              subjectData.weights.forEach((w) => {
                subjectWeightObj[w.examType] = w.weight;
              });
              weightsData[subjectId] = subjectWeightObj;
            }
          }
        } catch (err) {
          console.error(
            `Error fetching weights for subject ${subjectId}:`,
            err
          );
        }
      }

      subjectWeights.value = weightsData;
    } else {
      error.value = gradeResponse?.data?.message || "Failed to fetch grades";
    }
  } catch (err) {
    error.value =
      "Error fetching grades: " + (err.response?.data?.message || err.message);
    console.error("Error fetching grades:", err);
  } finally {
    loading.value = false;
  }
};

// Extract unique subject IDs from grades data
const extractSubjects = (gradesData) => {
  if (!gradesData || !Array.isArray(gradesData)) return [];

  const subjectIds = new Set();
  gradesData.forEach((grade) => {
    if (grade.course?.subjectId) {
      subjectIds.add(grade.course.subjectId);
    }
  });

  return Array.from(subjectIds);
};

// Lifecycle
onMounted(() => {
  fetchGrades();
});
</script>

<style scoped>
.grades-container {
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 1600px;
}

.header-section {
  border-block-end: 2px solid #e5e7eb;
  margin-block-end: 24px;
  padding-block-end: 16px;
}

.page-title {
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin-block: 0 8px;
  margin-inline: 0;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-name {
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.student-id {
  border-radius: 4px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
  padding-block: 4px;
  padding-inline: 8px;
}

.table-wrapper {
  overflow: hidden;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%);
  margin-block-end: 24px;
}

.table-container {
  overflow-x: auto;
}

.grades-table {
  border-collapse: collapse;
  font-size: 14px;
  inline-size: 100%;
  min-inline-size: 1400px;
}

.grades-table th,
.grades-table td {
  border: 1px solid #e5e7eb;
  padding-block: 12px;
  padding-inline: 8px;
  text-align: center;
}

.header-main {
  background: #1f2937;
  color: white;
  font-weight: 600;
  vertical-align: middle;
}

.header-group {
  color: white;
  font-weight: 600;
}

.header-group.assignment {
  background: #8b5cf6;
}

.header-group.quiz {
  background: #06b6d4;
}

.header-group.daily {
  background: #10b981;
}

.header-group.midterm {
  background: #3b82f6;
}

.header-group.final {
  background: #ef4444;
}

.header-sub {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.header-sub.assignment {
  background: #7c3aed;
}

.header-sub.quiz {
  background: #0891b2;
}

.header-sub.daily {
  background: #059669;
}

.header-sub.midterm {
  background: #2563eb;
}

.header-sub.final {
  background: #dc2626;
}

.row-even {
  background: #f9fafb;
}

.row-odd {
  background: white;
}

.cell-center {
  color: #374151;
  font-weight: 600;
}

.cell-nik {
  color: #1f2937;
  font-family: monospace;
  font-weight: 500;
  min-inline-size: 120px;
  text-align: start;
}

.cell-student-name {
  color: #1f2937;
  font-weight: 600;
  min-inline-size: 150px;
  text-align: start;
}

.cell-course {
  color: #1f2937;
  font-weight: 500;
  min-inline-size: 200px;
  text-align: start;
}

.cell-score {
  font-weight: 600;
  min-inline-size: 50px;
}

.score-excellent {
  background: #d1fae5;
  color: #047857;
}

.score-good {
  background: #dbeafe;
  color: #1d4ed8;
}

.score-average {
  background: #fef3c7;
  color: #d97706;
}

.score-below {
  background: #fed7aa;
  color: #ea580c;
}

.score-fail {
  background: #fecaca;
  color: #dc2626;
}

.score-missing {
  background: #f3f4f6;
  color: #9ca3af;
}

.cell-total {
  background: #f8fafc;
  font-size: 16px;
  font-weight: 700;
}

.cell-grade {
  font-size: 16px;
  font-weight: 700;
}

.grade-a {
  color: #059669;
}

.grade-b {
  color: #2563eb;
}

.grade-c {
  color: #d97706;
}

.grade-d {
  color: #ea580c;
}

.grade-f {
  color: #dc2626;
}

.cell-status {
  font-weight: 600;
}

.status-pass {
  border-radius: 4px;
  background: #d1fae5;
  color: #047857;
}

.status-fail {
  border-radius: 4px;
  background: #fecaca;
  color: #dc2626;
}

.loading-cell,
.error-cell,
.empty-cell {
  padding: 40px;
  color: #6b7280;
  font-style: italic;
  text-align: center;
}

.loading-spinner {
  display: inline-block;
  border: 3px solid #f3f4f6;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  block-size: 20px;
  border-block-start-color: #3b82f6;
  inline-size: 20px;
  margin-inline-end: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-cell {
  background: #fef2f2;
  color: #dc2626;
}

.summary-section {
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 10%);
}

.summary-card h3 {
  color: #1f2937;
  font-size: 20px;
  font-weight: 700;
  margin-block: 0 16px;
  margin-inline: 0;
}

.summary-stats {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  background: #f8fafc;
  border-inline-start: 4px solid #3b82f6;
  padding-block: 12px;
  padding-inline: 16px;
}

.stat-label {
  color: #374151;
  font-weight: 500;
}

.stat-value {
  color: #1f2937;
  font-size: 18px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .grades-container {
    padding: 12px;
  }

  .grades-table {
    font-size: 12px;
  }

  .grades-table th,
  .grades-table td {
    padding-block: 8px;
    padding-inline: 4px;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }
}
</style>

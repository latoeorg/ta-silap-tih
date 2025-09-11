<template>
  <div>
    <!-- Page Header -->
    <VCard class="mb-6">
      <VCardText>
        <VRow align="center" no-gutters>
          <VCol cols="auto">
            <VAvatar variant="tonal" size="60" color="primary" rounded>
              <VIcon icon="tabler-certificate" size="38" />
            </VAvatar>
          </VCol>
          <VCol class="mx-4">
            <h4 class="text-h4 font-weight-medium mb-1">
              Nilai & Absensi Saya
            </h4>
            <p class="text-body-1 text-medium-emphasis">
              Lihat nilai dan kehadiran Anda untuk setiap mata pelajaran
            </p>
          </VCol>
          <VCol cols="auto">
            <VBtn
              color="primary"
              variant="tonal"
              @click="refreshData"
              :loading="loading.refresh"
            >
              <VIcon start icon="tabler-refresh" />
              Refresh
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Summary Cards -->
    <VContainer class="mb-6">
      <VRow>
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText class="text-center">
              <VAvatar size="44" color="primary" variant="tonal" class="mb-3">
                <VIcon icon="tabler-book" />
              </VAvatar>
              <h5 class="text-h5 mb-1">{{ totalCourses }}</h5>
              <p class="text-body-2 text-medium-emphasis">Mata Pelajaran</p>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText class="text-center">
              <VAvatar size="44" color="success" variant="tonal" class="mb-3">
                <VIcon icon="tabler-chart-line" />
              </VAvatar>
              <h5 class="text-h5 mb-1">{{ averageGrade }}</h5>
              <p class="text-body-2 text-medium-emphasis">Rata-rata Nilai</p>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText class="text-center">
              <VAvatar size="44" color="info" variant="tonal" class="mb-3">
                <VIcon icon="tabler-calendar-check" />
              </VAvatar>
              <h5 class="text-h5 mb-1">{{ attendanceRate }}%</h5>
              <p class="text-body-2 text-medium-emphasis">Kehadiran</p>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText class="text-center">
              <VAvatar size="44" color="warning" variant="tonal" class="mb-3">
                <VIcon icon="tabler-clock" />
              </VAvatar>
              <h5 class="text-h5 mb-1">{{ totalAbsent }}</h5>
              <p class="text-body-2 text-medium-emphasis">Total Tidak Hadir</p>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>

    <!-- Filter and Search -->
    <VCard class="mb-6">
      <VCardText>
        <VRow align="center">
          <VCol cols="12" md="4">
            <VTextField
              v-model="searchQuery"
              density="compact"
              placeholder="Cari mata pelajaran..."
              prepend-inner-icon="tabler-search"
              clearable
              @input="filterData"
            />
          </VCol>
          <VCol cols="12" md="4">
            <VSelect
              v-model="selectedSemester"
              density="compact"
              label="Semester"
              :items="semesterOptions"
              @update:model-value="filterData"
            />
          </VCol>
          <VCol cols="12" md="4">
            <VSelect
              v-model="selectedExamType"
              density="compact"
              label="Jenis Ujian"
              :items="examTypeOptions"
              @update:model-value="filterData"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Grades by Subject -->
    <VCard>
      <VCardText>
        <VRow align="center" justify="space-between" class="mb-4">
          <VCol cols="auto">
            <div>
              <h5 class="text-h5 mb-1">Nilai Per Mata Pelajaran</h5>
              <p class="text-body-2 text-medium-emphasis">
                Rincian nilai untuk setiap mata pelajaran dan jenis ujian
              </p>
            </div>
          </VCol>
          <VCol cols="auto">
            <VChip color="primary" variant="tonal">
              {{ filteredSubjects.length }} Mata Pelajaran
            </VChip>
          </VCol>
        </VRow>

        <!-- Loading State -->
        <div v-if="loading.grades" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" class="mb-4" />
          <p>Memuat data nilai...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSubjects.length === 0" class="text-center py-8">
          <VIcon size="64" color="primary" class="mb-4">tabler-notes-off</VIcon>
          <h6 class="text-h6 mb-2">Belum Ada Nilai</h6>
          <p class="text-body-2 text-medium-emphasis">
            Belum ada data nilai untuk ditampilkan
          </p>
        </div>

        <!-- Subjects List -->
        <VContainer v-else fluid>
          <VRow>
            <VCol
              v-for="subject in filteredSubjects"
              :key="subject.id"
              cols="12"
            >
              <VCard variant="outlined" :border="true">
                <VCardText>
                  <!-- Subject Header -->
                  <VRow align="center" justify="space-between" class="mb-4">
                    <VCol cols="auto">
                      <VRow align="center" no-gutters>
                        <VCol cols="auto">
                          <VAvatar size="40" color="primary" variant="tonal">
                            <VIcon icon="tabler-book" />
                          </VAvatar>
                        </VCol>
                        <VCol class="ml-3">
                          <h6 class="text-h6 mb-1">{{ subject.name }}</h6>
                          <p class="text-body-2 text-medium-emphasis">
                            {{ subject.teacher }} • Kelas
                            {{ subject.className }}
                          </p>
                        </VCol>
                      </VRow>
                    </VCol>
                    <VCol cols="auto" class="text-end">
                      <VChip
                        :color="getGradeColor(subject.averageGrade)"
                        variant="tonal"
                        class="mb-2 d-block"
                      >
                        Rata-rata: {{ subject.averageGrade || "N/A" }}
                      </VChip>
                      <VChip
                        :color="getAttendanceColor(subject.attendanceRate)"
                        variant="tonal"
                        size="small"
                      >
                        Kehadiran: {{ subject.attendanceRate }}%
                      </VChip>
                    </VCol>
                  </VRow>

                  <!-- Grades Table -->
                  <VTable density="compact" class="mb-4">
                    <thead>
                      <tr>
                        <th>Jenis Ujian</th>
                        <th>Nilai</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="grade in subject.grades"
                        :key="`${grade.examType}-${grade.id}`"
                      >
                        <td>
                          <VChip
                            size="small"
                            variant="tonal"
                            :color="getExamTypeColor(grade.examType)"
                          >
                            {{ formatExamType(grade.examType) }}
                          </VChip>
                        </td>
                        <td>
                          <span
                            class="font-weight-medium"
                            :class="getGradeTextColor(grade.totalScore)"
                          >
                            {{ grade.totalScore || "Belum dinilai" }}
                          </span>
                        </td>
                        <td>{{ formatDate(grade.updatedAt) }}</td>
                        <td>
                          <VChip
                            size="small"
                            :color="grade.totalScore ? 'success' : 'warning'"
                            variant="tonal"
                          >
                            {{ grade.totalScore ? "Selesai" : "Pending" }}
                          </VChip>
                        </td>
                      </tr>
                    </tbody>
                  </VTable>

                  <!-- Attendance Summary -->
                  <VRow align="center" class="flex-wrap">
                    <VCol cols="auto">
                      <VRow align="center" no-gutters>
                        <VCol cols="auto">
                          <VIcon size="20" color="success">tabler-check</VIcon>
                        </VCol>
                        <VCol class="ml-2">
                          <span class="text-body-2"
                            >Hadir: {{ subject.attendance.present }}</span
                          >
                        </VCol>
                      </VRow>
                    </VCol>
                    <VCol cols="auto">
                      <VRow align="center" no-gutters>
                        <VCol cols="auto">
                          <VIcon size="20" color="error">tabler-x</VIcon>
                        </VCol>
                        <VCol class="ml-2">
                          <span class="text-body-2"
                            >Tidak Hadir: {{ subject.attendance.absent }}</span
                          >
                        </VCol>
                      </VRow>
                    </VCol>
                    <VCol cols="auto">
                      <VRow align="center" no-gutters>
                        <VCol cols="auto">
                          <VIcon size="20" color="warning">tabler-clock</VIcon>
                        </VCol>
                        <VCol class="ml-2">
                          <span class="text-body-2"
                            >Izin: {{ subject.attendance.excused }}</span
                          >
                        </VCol>
                      </VRow>
                    </VCol>
                    <VCol cols="auto">
                      <VRow align="center" no-gutters>
                        <VCol cols="auto">
                          <VIcon size="20" color="info"
                            >tabler-thermometer</VIcon
                          >
                        </VCol>
                        <VCol class="ml-2">
                          <span class="text-body-2"
                            >Sakit: {{ subject.attendance.sick }}</span
                          >
                        </VCol>
                      </VRow>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const store = useVuex();

// Reactive variables
const searchQuery = ref("");
const selectedSemester = ref("");
const selectedExamType = ref("");
const subjectsData = ref([]);

// Loading states
const loading = ref({
  grades: false,
  attendance: false,
  refresh: false,
});

// Options
const semesterOptions = [
  { title: "Semua Semester", value: "" },
  { title: "Semester 1", value: "semester1" },
  { title: "Semester 2", value: "semester2" },
];

const examTypeOptions = [
  { title: "Semua Jenis", value: "" },
  { title: "Harian", value: "DAILY" },
  { title: "Kuis", value: "QUIZ" },
  { title: "UTS", value: "MID_TERM" },
  { title: "UAS", value: "FINAL" },
  { title: "Tugas", value: "ASSIGNMENT" },
];

// Computed properties
const filteredSubjects = computed(() => {
  let filtered = subjectsData.value;

  if (searchQuery.value) {
    filtered = filtered.filter((subject) =>
      subject.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedExamType.value) {
    filtered = filtered.map((subject) => ({
      ...subject,
      grades: subject.grades.filter(
        (grade) => grade.examType === selectedExamType.value
      ),
    }));
  }

  return filtered;
});

const totalCourses = computed(() => subjectsData.value.length);

const averageGrade = computed(() => {
  const allGrades = subjectsData.value.flatMap((subject) =>
    subject.grades.filter((grade) => grade.totalScore)
  );
  if (allGrades.length === 0) return "N/A";

  const total = allGrades.reduce((sum, grade) => sum + grade.totalScore, 0);
  return (total / allGrades.length).toFixed(1);
});

const attendanceRate = computed(() => {
  const totalAttendance = subjectsData.value.reduce(
    (acc, subject) => {
      acc.present += subject.attendance.present;
      acc.total += subject.attendance.total;
      return acc;
    },
    { present: 0, total: 0 }
  );

  if (totalAttendance.total === 0) return 0;
  return Math.round((totalAttendance.present / totalAttendance.total) * 100);
});

const totalAbsent = computed(() => {
  return subjectsData.value.reduce(
    (total, subject) => total + subject.attendance.absent,
    0
  );
});

// Methods
const fetchStudentGrades = async () => {
  loading.value.grades = true;
  try {
    // Fetch grades for the current student
    await store.dispatch("grade/getGrades", {
      page_size: 1000, // Get all grades
      include: "components",
    });

    const grades = store.state.grade.grades;
    await processGradesData(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
  } finally {
    loading.value.grades = false;
  }
};

const fetchStudentAttendance = async () => {
  loading.value.attendance = true;
  try {
    // Fetch attendance for all courses the student is enrolled in
    await store.dispatch("attendance/getAttendances", {
      page_size: 1000, // Get all attendance records
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
  } finally {
    loading.value.attendance = false;
  }
};

const fetchStudentCourses = async () => {
  try {
    // Fetch courses the student is enrolled in
    await store.dispatch("course/getCourses", {
      page_size: 1000,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

const processGradesData = async (grades) => {
  // Get all student courses
  await fetchStudentCourses();
  const allCourses = store.state.course.courses || [];

  // Group grades by course/subject
  const courseMap = new Map();

  // Initialize all enrolled courses (even if no grades exist yet)
  for (const course of allCourses) {
    courseMap.set(course.id, {
      id: course.id,
      name: course.subject?.name || course.name,
      teacher: course.teacher?.name || "N/A",
      className: course.classGroup?.name || "N/A",
      grades: [],
      attendance: { present: 0, absent: 0, excused: 0, sick: 0, total: 0 },
      averageGrade: null,
      attendanceRate: 0,
    });
  }

  // Add grades to their respective courses
  for (const grade of grades) {
    const courseId = grade.course.id;

    if (courseMap.has(courseId)) {
      courseMap.get(courseId).grades.push(grade);
    }
  }

  // Fetch attendance data for each course
  const attendances = store.state.attendance?.attendances || [];
  for (const [courseId, subject] of courseMap) {
    const courseAttendances = attendances.filter(
      (att) => att.courseId === courseId
    );

    subject.attendance = {
      present: courseAttendances.filter((att) => att.status === "PRESENT")
        .length,
      absent: courseAttendances.filter((att) => att.status === "ABSENT").length,
      excused: courseAttendances.filter((att) => att.status === "EXCUSED")
        .length,
      sick: courseAttendances.filter((att) => att.status === "SICK").length,
    };

    const totalAttendance =
      subject.attendance.present +
      subject.attendance.absent +
      subject.attendance.excused +
      subject.attendance.sick;
    subject.attendance.total = totalAttendance;
    subject.attendanceRate =
      totalAttendance > 0
        ? Math.round((subject.attendance.present / totalAttendance) * 100)
        : 0;
  }

  // Calculate averages
  const subjects = Array.from(courseMap.values()).map((subject) => {
    const validGrades = subject.grades.filter(
      (g) => g.totalScore !== null && g.totalScore !== undefined
    );
    subject.averageGrade =
      validGrades.length > 0
        ? (
            validGrades.reduce((sum, g) => sum + g.totalScore, 0) /
            validGrades.length
          ).toFixed(1)
        : null;

    return subject;
  });

  subjectsData.value = subjects;
};

const refreshData = async () => {
  loading.value.refresh = true;
  try {
    await Promise.all([
      fetchStudentAttendance(), // Fetch attendance first
      fetchStudentGrades(), // This will also fetch courses and process data
    ]);
  } finally {
    loading.value.refresh = false;
  }
};

const filterData = () => {
  // Trigger reactivity for filtered data
  // The computed property will handle the actual filtering
};

// Utility methods
const formatExamType = (examType) => {
  const types = {
    DAILY: "Harian",
    QUIZ: "Kuis",
    MID_TERM: "UTS",
    FINAL: "UAS",
    ASSIGNMENT: "Tugas",
  };
  return types[examType] || examType;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("id-ID");
};

const getGradeColor = (grade) => {
  if (!grade || grade === "N/A") return "secondary";
  const numGrade = parseFloat(grade);
  if (numGrade >= 85) return "success";
  if (numGrade >= 70) return "info";
  if (numGrade >= 60) return "warning";
  return "error";
};

const getGradeTextColor = (grade) => {
  if (!grade) return "text-medium-emphasis";
  if (grade >= 85) return "text-success";
  if (grade >= 70) return "text-info";
  if (grade >= 60) return "text-warning";
  return "text-error";
};

const getAttendanceColor = (rate) => {
  if (rate >= 90) return "success";
  if (rate >= 80) return "info";
  if (rate >= 70) return "warning";
  return "error";
};

const getExamTypeColor = (examType) => {
  const colors = {
    DAILY: "primary",
    QUIZ: "info",
    MID_TERM: "warning",
    FINAL: "error",
    ASSIGNMENT: "success",
  };
  return colors[examType] || "secondary";
};

// Lifecycle
onMounted(() => {
  refreshData();
});
</script>

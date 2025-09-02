<template>
  <div>
    <VCard :title="title">
      <VDivider />

      <VCardText>
        <div class="d-flex align-end justify-between flex-wrap gap-4 mb-4">
          <div class="d-flex align-center gap-4">
            <div style="inline-size: 20rem">
              <AppTextField
                v-model="searchQuery"
                density="compact"
                label="Cari siswa"
                placeholder="Cari siswa..."
                append-inner-icon="tabler-search"
              />
            </div>

            <AppSelect
              v-if="!courseId"
              v-model="selectedCourse"
              :items="courses"
              item-title="name"
              item-value="id"
              label="Pilih Kursus"
              density="compact"
              style="inline-size: 15rem"
              clearable
            />

            <AppDateTimePicker
              v-model="selectedMonth"
              type="month"
              label="Bulan"
              density="compact"
              style="inline-size: 12rem"
              :config="{ dateFormat: 'Y-m' }"
            />
          </div>

          <div class="d-flex gap-2">
            <!-- <VBtn
              v-if="!hideAddButton"
              color="secondary"
              variant="outlined"
              @click="handleBatchAttendanceEntry"
            >
              <VIcon start icon="tabler-users-plus" />
              Absensi Massal
            </VBtn> -->

            <VBtn v-if="!hideAddButton" color="primary" @click="refreshData">
              <VIcon start icon="tabler-refresh" />
              Refresh
            </VBtn>
          </div>
        </div>

        <!-- Month Summary Info -->
        <VAlert
          v-if="currentMonthInfo"
          color="info"
          variant="tonal"
          class="mb-4"
        >
          <div class="d-flex align-center">
            <VIcon icon="tabler-calendar" class="me-2" />
            <span>{{ currentMonthInfo }}</span>
          </div>
        </VAlert>
      </VCardText>

      <VDivider />

      <!-- Enhanced Attendance Table -->
      <VCardText class="px-0 pt-0">
        <div v-if="loading" class="d-flex justify-center py-8">
          <VProgressCircular indeterminate />
        </div>

        <div v-else-if="filteredStudents.length === 0" class="text-center py-8">
          <VIcon icon="tabler-users-off" size="48" color="grey" class="mb-4" />
          <p class="text-body-1 text-medium-emphasis">Tidak ada data siswa</p>
        </div>

        <div v-else class="attendance-table-container" style="overflow-x: auto">
          <table class="enhanced-attendance-table">
            <thead>
              <tr>
                <th class="sticky-column">No</th>
                <th class="sticky-column">NIK</th>
                <th class="sticky-column">Nama Siswa</th>
                <th v-if="!courseId" class="sticky-column">Kursus</th>

                <!-- Dynamic Date Headers for the Month -->
                <th
                  v-for="date in monthDates"
                  :key="date.full"
                  :class="getDateHeaderClass(date)"
                  class="date-header text-center"
                >
                  <div class="date-header-content">
                    <div class="font-weight-bold">
                      {{ date.day }}
                    </div>
                    <div class="text-caption">
                      {{ date.dayName }}
                    </div>
                  </div>
                </th>

                <th class="summary-column">Ringkasan</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(student, studentIndex) in filteredStudents"
                :key="student.id"
                :class="{ 'even-row': studentIndex % 2 === 0 }"
              >
                <td class="sticky-column text-center">
                  {{ studentIndex + 1 }}
                </td>
                <td class="sticky-column">
                  {{ student.studentProfile?.number || "-" }}
                </td>
                <td class="sticky-column">
                  <div class="d-flex align-center gap-2">
                    <VAvatar size="32">
                      <VImg
                        :src="student.avatar || '/images/avatars/avatar-1.png'"
                        :alt="student.name"
                      />
                    </VAvatar>
                    <div>
                      <div class="font-weight-medium">
                        {{ student.name }}
                      </div>
                      <div class="text-caption text-disabled">
                        {{ student.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td v-if="!courseId" class="sticky-column">
                  {{ getCurrentCourseName(student) }}
                </td>

                <!-- Attendance status for each date -->
                <td
                  v-for="date in monthDates"
                  :key="`${student.id}-${date.full}`"
                  :class="getAttendanceCellClass(date)"
                  class="attendance-cell text-center"
                  @click="editAttendance(student, date)"
                >
                  <div class="attendance-cell-content">
                    <VSelect
                      :model-value="getAttendanceStatus(student.id, date.full)"
                      :items="statusOptions"
                      item-title="title"
                      item-value="value"
                      density="compact"
                      hide-details
                      variant="plain"
                      @update:model-value="
                        updateAttendance(student.id, date.full, $event)
                      "
                      @blur="saveAttendance(student.id, date.full)"
                      style="min-width: 80px"
                    >
                      <template #selection="{ item }">
                        <VChip
                          :color="getStatusColor(item.value)"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ getStatusIcon(item.value) }}
                        </VChip>
                      </template>
                      <template #item="{ props: itemProps, item }">
                        <VListItem v-bind="itemProps">
                          <template #prepend>
                            <VIcon
                              :icon="getStatusIconFull(item.value)"
                              :color="getStatusColor(item.value)"
                            />
                          </template>
                        </VListItem>
                      </template>
                    </VSelect>
                  </div>
                </td>

                <!-- Summary -->
                <td class="summary-column text-center">
                  <div class="attendance-summary">
                    <div class="d-flex justify-center gap-1 mb-1">
                      <VChip color="success" size="x-small" variant="tonal">
                        H: {{ calculateAttendanceSummary(student.id).present }}
                      </VChip>
                      <VChip color="error" size="x-small" variant="tonal">
                        A: {{ calculateAttendanceSummary(student.id).absent }}
                      </VChip>
                    </div>
                    <div class="d-flex justify-center gap-1">
                      <VChip color="warning" size="x-small" variant="tonal">
                        I: {{ calculateAttendanceSummary(student.id).excused }}
                      </VChip>
                      <VChip color="info" size="x-small" variant="tonal">
                        S: {{ calculateAttendanceSummary(student.id).sick }}
                      </VChip>
                    </div>
                    <div class="text-caption mt-1">
                      {{ calculateAttendancePercentage(student.id) }}%
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VCardText>
    </VCard>

    <!-- Batch Attendance Entry Modal -->
    <AttendanceBatchModal
      v-if="!hideAddButton"
      :open="batchModal"
      :course-id="courseId || selectedCourse"
      :selected-date="selectedDateForBatch"
      @handle-close="handleBatchModal"
      @on-submit-success="refreshData"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import AttendanceBatchModal from "./attendance-batch-modal.vue";

const props = defineProps({
  hideAddButton: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Tabel Absensi Siswa",
  },
  courseId: {
    type: String,
    default: "",
  },
});

const store = useVuex();

// Local state
const searchQuery = ref("");
const selectedCourse = ref("");
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM format
const batchModal = ref(false);
const selectedDateForBatch = ref("");
const attendanceData = ref({}); // Store attendance data locally for editing

// Computed properties
const loading = computed(
  () =>
    store.state.attendance.loading.attendances ||
    store.state.user.loading.reports
);

const students = computed(() => store.state.user.reports || []);
const attendances = computed(() => store.state.attendance.attendances || []);
const courses = computed(() => store.state.course.reports || []);
const statusOptions = computed(
  () => store.state.attendance.statusOptions || []
);

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;

  return students.value.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.studentProfile?.number
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  );
});

const monthDates = computed(() => {
  if (!selectedMonth.value) return [];

  const year = parseInt(selectedMonth.value.split("-")[0]);
  const month = parseInt(selectedMonth.value.split("-")[1]);
  const daysInMonth = new Date(year, month, 0).getDate();
  const dates = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });

    dates.push({
      day: day.toString().padStart(2, "0"),
      dayName,
      full: `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`,
      date: date,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }

  return dates;
});

const currentMonthInfo = computed(() => {
  if (!selectedMonth.value) return "";

  const [year, month] = selectedMonth.value.split("-");
  const monthName = new Date(
    parseInt(year),
    parseInt(month) - 1,
    1
  ).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return `Menampilkan absensi untuk bulan ${monthName} (${monthDates.value.length} hari)`;
});

// Methods
const refreshData = async () => {
  await Promise.all([fetchStudents(), fetchAttendances()]);
};

const fetchStudents = async () => {
  const params = {
    role: "STUDENT",
    page_size: 100, // Get all students
    ...(props.courseId ? { course_id: props.courseId } : {}),
    ...(selectedCourse.value ? { course_id: selectedCourse.value } : {}),
  };

  await store.dispatch("user/getReports", params);
};

const fetchAttendances = async () => {
  if (!selectedMonth.value) return;

  const [year, month] = selectedMonth.value.split("-");
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-${monthDates.value.length
    .toString()
    .padStart(2, "0")}`;

  const params = {
    page_size: 1000, // Get all attendance records for the month
    ...(props.courseId ? { course_id: props.courseId } : {}),
    ...(selectedCourse.value ? { course_id: selectedCourse.value } : {}),
    start_date: startDate,
    end_date: endDate,
  };

  await store.dispatch("attendance/getAttendances", params);

  // Populate local attendance data
  populateAttendanceData();
};

const populateAttendanceData = () => {
  // Clear existing local data
  attendanceData.value = {};

  // Populate with existing attendance data
  attendances.value.forEach((attendance) => {
    const dateKey = attendance.date?.split("T")[0]; // Get YYYY-MM-DD format
    const key = `${attendance.userId}-${dateKey}`;
    attendanceData.value[key] = attendance.status;
  });
};

const getAttendanceStatus = (userId, date) => {
  const key = `${userId}-${date}`;
  return attendanceData.value[key] || "";
};

const updateAttendance = (userId, date, status) => {
  const key = `${userId}-${date}`;
  attendanceData.value[key] = status;
};

const saveAttendance = async (userId, date) => {
  const status = getAttendanceStatus(userId, date);
  if (!status) return;

  try {
    await store.dispatch("attendance/createOrUpdate", {
      userId,
      courseId: props.courseId || selectedCourse.value,
      date,
      status,
    });

    // Refresh attendance data
    await fetchAttendances();
  } catch (error) {
    console.error("Error saving attendance:", error);
  }
};

const calculateAttendanceSummary = (userId) => {
  const summary = {
    present: 0,
    absent: 0,
    excused: 0,
    sick: 0,
    total: 0,
  };

  monthDates.value.forEach((date) => {
    const status = getAttendanceStatus(userId, date.full);
    if (status) {
      summary.total++;
      switch (status) {
        case "PRESENT":
          summary.present++;
          break;
        case "ABSENT":
          summary.absent++;
          break;
        case "EXCUSED":
          summary.excused++;
          break;
        case "SICK":
          summary.sick++;
          break;
      }
    }
  });

  return summary;
};

const calculateAttendancePercentage = (userId) => {
  const summary = calculateAttendanceSummary(userId);
  if (summary.total === 0) return 0;

  return Math.round((summary.present / summary.total) * 100);
};

const editAttendance = (student, date) => {
  selectedDateForBatch.value = date.full;
  // Could open a detailed edit modal here if needed
};

const getCurrentCourseName = (student) => {
  // Implementation depends on how student-course relationship is structured
  return "Course Name"; // Placeholder
};

const handleBatchAttendanceEntry = () => {
  batchModal.value = true;
};

const handleBatchModal = () => {
  batchModal.value = false;
};

// Utility functions
const getStatusColor = (status) => {
  switch (status) {
    case "PRESENT":
      return "success";
    case "ABSENT":
      return "error";
    case "EXCUSED":
      return "warning";
    case "SICK":
      return "info";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "PRESENT":
      return "✓";
    case "ABSENT":
      return "✗";
    case "EXCUSED":
      return "I";
    case "SICK":
      return "S";
    default:
      return "-";
  }
};

const getStatusIconFull = (status) => {
  switch (status) {
    case "PRESENT":
      return "tabler-check";
    case "ABSENT":
      return "tabler-x";
    case "EXCUSED":
      return "tabler-clock-exclamation";
    case "SICK":
      return "tabler-thermometer";
    default:
      return "tabler-minus";
  }
};

const getDateHeaderClass = (date) => {
  const baseClass = "date-header";
  if (date.isWeekend) return `${baseClass} weekend-header`;
  return baseClass;
};

const getAttendanceCellClass = (date) => {
  const baseClass = "attendance-cell";
  if (date.isWeekend) return `${baseClass} weekend-cell`;
  return baseClass;
};

// Lifecycle
onMounted(() => {
  refreshData();
  if (!props.courseId) {
    store.dispatch("course/getReports");
  }
});

// Watchers
watch([() => props.courseId, selectedCourse, selectedMonth], () => {
  refreshData();
});

watch(
  attendances,
  () => {
    populateAttendanceData();
  },
  { deep: true }
);
</script>

<style scoped>
.enhanced-attendance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.enhanced-attendance-table th,
.enhanced-attendance-table td {
  border: 1px solid rgb(var(--v-theme-outline), 0.12);
  padding: 8px;
  text-align: center;
  white-space: nowrap;
}

.enhanced-attendance-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: rgb(var(--v-theme-surface));
  font-weight: 600;
}

.sticky-column {
  position: sticky;
  left: 0;
  z-index: 3;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.even-row {
  background-color: rgb(var(--v-theme-surface), 0.05);
}

/* Date Headers */
.date-header {
  min-width: 60px;
  background-color: rgb(var(--v-theme-primary), 0.1);
}

.weekend-header {
  background-color: rgb(var(--v-theme-warning), 0.1);
  color: rgb(var(--v-theme-warning));
}

.date-header-content {
  text-align: center;
}

/* Attendance Cells */
.attendance-cell {
  min-width: 60px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.attendance-cell:hover {
  background-color: rgb(var(--v-theme-primary), 0.05);
}

.weekend-cell {
  background-color: rgb(var(--v-theme-surface), 0.1);
}

.attendance-cell-content {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Summary Column */
.summary-column {
  min-width: 120px;
  background-color: rgb(var(--v-theme-info), 0.05);
}

.attendance-summary {
  padding: 4px;
}

/* Table Container */
.attendance-table-container {
  max-height: 70vh;
  overflow: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .enhanced-attendance-table {
    font-size: 0.75rem;
  }

  .enhanced-attendance-table th,
  .enhanced-attendance-table td {
    padding: 4px;
  }

  .date-header {
    min-width: 40px;
  }

  .attendance-cell {
    min-width: 40px;
  }
}
</style>

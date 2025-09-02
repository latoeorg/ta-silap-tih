<template>
  <div>
    <VCard :title="title">
      <VDivider />

      <VCardText>
        <div class="d-flex align-center justify-between flex-wrap gap-4 mb-4">
          <div class="d-flex align-center gap-4">
            <div style="inline-size: 20rem">
              <AppTextField
                v-model="searchQuery"
                density="compact"
                placeholder="Cari siswa..."
                append-inner-icon="tabler-search"
              />
            </div>

            <VSelect
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
          </div>

          <div class="d-flex gap-2">
            <!-- <VBtn
              v-if="!hideAddButton"
              color="secondary"
              variant="outlined"
              @click="handleBatchGradeEntry"
            >
              <VIcon start icon="tabler-users-plus" />
              Input Nilai Massal
            </VBtn> -->

            <VBtn v-if="!hideAddButton" color="primary" @click="refreshData">
              <VIcon start icon="tabler-refresh" />
              Refresh
            </VBtn>
          </div>
        </div>

        <!-- Assessment Weight Info -->
        <VAlert
          v-if="assessmentWeights.length > 0"
          color="info"
          variant="tonal"
          class="mb-4"
        >
          <div class="d-flex align-center">
            <VIcon icon="tabler-info-circle" class="me-2" />
            <span>Distribusi Bobot: {{ assessmentWeightsSummary }}</span>
          </div>
        </VAlert>
      </VCardText>

      <VDivider />

      <!-- Enhanced Grade Table -->
      <VCardText class="px-0 pt-0">
        <div v-if="loading" class="d-flex justify-center py-8">
          <VProgressCircular indeterminate />
        </div>

        <div v-else-if="filteredStudents.length === 0" class="text-center py-8">
          <VIcon icon="tabler-users-off" size="48" color="grey" class="mb-4" />
          <p class="text-body-1 text-medium-emphasis">Tidak ada data siswa</p>
        </div>

        <div v-else class="grade-table-container" style="overflow-x: auto">
          <table class="enhanced-grade-table">
            <thead>
              <tr>
                <th class="sticky-column">No</th>
                <th class="sticky-column">NIK</th>
                <th class="sticky-column">Nama Siswa</th>
                <th v-if="!courseId" class="sticky-column">Kursus</th>

                <!-- Dynamic Assessment Weight Headers -->
                <th
                  v-for="weight in assessmentWeights"
                  :key="weight.id"
                  :class="getWeightHeaderClass(weight.examType)"
                  :colspan="weight.quota"
                >
                  <div class="text-center">
                    <div class="font-weight-bold">
                      {{ getExamTypeText(weight.examType) }} ({{
                        weight.weight
                      }}%)
                    </div>
                    <div class="text-caption">
                      {{ weight.quota }}
                      {{ weight.quota > 1 ? "komponen" : "komponen" }}
                    </div>
                  </div>
                </th>

                <th class="total-column">Total Score</th>
                <th class="grade-column">Grade</th>
                <th class="status-column">Status</th>
              </tr>

              <!-- Sub headers for components -->
              <tr>
                <th class="sticky-column" />
                <th class="sticky-column" />
                <th class="sticky-column" />
                <th v-if="!courseId" class="sticky-column" />

                <template
                  v-for="weight in assessmentWeights"
                  :key="`${weight.id}-sub`"
                >
                  <th
                    v-for="index in weight.quota"
                    :key="`${weight.id}-${index}`"
                    :class="getComponentHeaderClass(weight.examType)"
                  >
                    {{ getComponentLabel(weight.examType, index) }}
                  </th>
                </template>

                <th class="total-column" />
                <th class="grade-column" />
                <th class="status-column" />
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

                <!-- Grade components for each assessment weight -->
                <template
                  v-for="weight in assessmentWeights"
                  :key="`${student.id}-${weight.id}`"
                >
                  <td
                    v-for="componentIndex in weight.quota"
                    :key="`${student.id}-${weight.id}-${componentIndex}`"
                    :class="getComponentCellClass(weight.examType)"
                    @click="editGradeComponent(student, weight, componentIndex)"
                  >
                    <div class="grade-component-cell">
                      <VTextField
                        :model-value="
                          getGradeComponent(
                            student.id,
                            weight.examType,
                            componentIndex
                          )
                        "
                        density="compact"
                        type="number"
                        min="0"
                        max="100"
                        hide-details
                        @update:model-value="
                          updateGradeComponent(
                            student.id,
                            weight.examType,
                            componentIndex,
                            $event
                          )
                        "
                        @blur="
                          saveGradeComponent(
                            student.id,
                            weight.examType,
                            componentIndex
                          )
                        "
                      />
                    </div>
                  </td>
                </template>

                <!-- Total Score -->
                <td class="total-column text-center">
                  <VChip
                    :color="getScoreColor(calculateTotalScore(student.id))"
                    size="small"
                    variant="tonal"
                  >
                    {{ calculateTotalScore(student.id).toFixed(1) }}
                  </VChip>
                </td>

                <!-- Grade -->
                <td class="grade-column text-center">
                  <VChip
                    :color="getGradeColor(calculateLetterGrade(student.id))"
                    size="small"
                    variant="elevated"
                  >
                    {{ calculateLetterGrade(student.id) }}
                  </VChip>
                </td>

                <!-- Status -->
                <td class="status-column text-center">
                  <VChip
                    :color="getStatusColor(calculateLetterGrade(student.id))"
                    size="small"
                    variant="tonal"
                  >
                    {{ getStatusText(calculateLetterGrade(student.id)) }}
                  </VChip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VCardText>
    </VCard>

    <!-- Batch Grade Entry Modal -->
    <GradeBatchModal
      v-if="!hideAddButton"
      :open="batchModal"
      :course-id="courseId || selectedCourse"
      @handle-close="handleBatchModal"
      @on-submit-success="refreshData"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import GradeBatchModal from "./grade-batch-modal.vue";

const props = defineProps({
  hideAddButton: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Tabel Nilai Siswa",
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
const batchModal = ref(false);
const gradeComponents = ref({}); // Store grade components locally for editing

// Computed properties
const loading = computed(
  () =>
    store.state.grade.loading.grades ||
    store.state.assessmentWeight.loading.reports ||
    store.state.user.loading.reports
);

const students = computed(() => store.state.user.reports || []);
const assessmentWeights = computed(
  () => store.state.assessmentWeight.reports || []
);
const grades = computed(() => store.state.grade.grades || []);
const courses = computed(() => store.state.course.reports || []);

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

const assessmentWeightsSummary = computed(() => {
  return assessmentWeights.value
    .map((w) => `${getExamTypeText(w.examType)} ${w.weight}%`)
    .join(", ");
});

// Methods
const refreshData = async () => {
  await Promise.all([fetchStudents(), fetchAssessmentWeights(), fetchGrades()]);
};

const fetchStudents = async () => {
  const params = {
    role: "STUDENT",
    ...(props.courseId ? { course_id: props.courseId } : {}),
    ...(selectedCourse.value ? { course_id: selectedCourse.value } : {}),
  };

  await store.dispatch("user/getReports", params);
};

const fetchAssessmentWeights = async () => {
  const params = {};
  if (props.courseId) {
    params.courseId = props.courseId;
  } else if (selectedCourse.value) {
    params.courseId = selectedCourse.value;
  }
  await store.dispatch("assessmentWeight/getReports", params);
};

const fetchGrades = async () => {
  const params = {};
  if (props.courseId) {
    params.course_id = props.courseId;
  } else if (selectedCourse.value) {
    params.course_id = selectedCourse.value;
  }
  await store.dispatch("grade/getGrades", params);

  // Populate local gradeComponents with existing data
  populateGradeComponents();
};

const populateGradeComponents = () => {
  // Clear existing local data
  gradeComponents.value = {};

  // Populate with existing grade data
  grades.value.forEach((grade) => {
    if (grade.components && Array.isArray(grade.components)) {
      grade.components.forEach((component) => {
        const key = `${grade.userId}-${grade.examType}-${component.index}`;
        gradeComponents.value[key] = component.score;
      });
    }
  });
};

const getGradeComponent = (userId, examType, componentIndex) => {
  const key = `${userId}-${examType}-${componentIndex}`;

  return gradeComponents.value[key] || "";
};

const updateGradeComponent = (userId, examType, componentIndex, value) => {
  const key = `${userId}-${examType}-${componentIndex}`;

  gradeComponents.value[key] = value;
};

const saveGradeComponent = async (userId, examType, componentIndex) => {
  const key = `${userId}-${examType}-${componentIndex}`;
  const score = gradeComponents.value[key];

  if (!score || isNaN(parseFloat(score))) return;

  try {
    await store.dispatch("grade/updateComponent", {
      userId,
      courseId: props.courseId || selectedCourse.value,
      examType,
      componentIndex,
      score: parseFloat(score),
    });

    // Refresh grades after saving
    await fetchGrades();
  } catch (error) {
    console.error("Error saving grade component:", error);
  }
};

const calculateTotalScore = (userId) => {
  let totalScore = 0;

  assessmentWeights.value.forEach((weight) => {
    let examTypeAverage = 0;
    let componentCount = 0;

    for (let i = 1; i <= weight.quota; i++) {
      const componentScore = getGradeComponent(userId, weight.examType, i);
      if (componentScore && !isNaN(parseFloat(componentScore))) {
        examTypeAverage += parseFloat(componentScore);
        componentCount++;
      }
    }

    if (componentCount > 0) {
      examTypeAverage = examTypeAverage / componentCount;
      totalScore += (examTypeAverage * weight.weight) / 100;
    }
  });

  return totalScore;
};

const calculateLetterGrade = (userId) => {
  const totalScore = calculateTotalScore(userId);

  if (totalScore >= 90) return "A";
  if (totalScore >= 80) return "B";
  if (totalScore >= 70) return "C";
  if (totalScore >= 60) return "D";

  return "F";
};

const getCurrentCourseName = (student) => {
  // Implementation depends on how student-course relationship is structured
  return "Course Name"; // Placeholder
};

const handleBatchGradeEntry = () => {
  batchModal.value = true;
};

const handleBatchModal = () => {
  batchModal.value = false;
};

// Utility functions
const getExamTypeText = (examType) => {
  switch (examType) {
    case "DAILY":
      return "Harian";
    case "QUIZ":
      return "Kuis";
    case "MID_TERM":
      return "UTS";
    case "FINAL":
      return "UAS";
    case "ASSIGNMENT":
      return "Tugas";
    default:
      return examType;
  }
};

const getComponentLabel = (examType, index) => {
  const prefix =
    {
      DAILY: "D",
      QUIZ: "Q",
      MID_TERM: "M",
      FINAL: "F",
      ASSIGNMENT: "A",
    }[examType] || "X";

  return `${prefix}${index}`;
};

const getWeightHeaderClass = (examType) => {
  const baseClass = "weight-header text-center";
  switch (examType) {
    case "ASSIGNMENT":
      return `${baseClass} assignment-header`;
    case "QUIZ":
      return `${baseClass} quiz-header`;
    case "DAILY":
      return `${baseClass} daily-header`;
    case "MID_TERM":
      return `${baseClass} midterm-header`;
    case "FINAL":
      return `${baseClass} final-header`;
    default:
      return baseClass;
  }
};

const getComponentHeaderClass = (examType) => {
  const baseClass = "component-header text-center";
  switch (examType) {
    case "ASSIGNMENT":
      return `${baseClass} assignment-component`;
    case "QUIZ":
      return `${baseClass} quiz-component`;
    case "DAILY":
      return `${baseClass} daily-component`;
    case "MID_TERM":
      return `${baseClass} midterm-component`;
    case "FINAL":
      return `${baseClass} final-component`;
    default:
      return baseClass;
  }
};

const getComponentCellClass = (examType) => {
  const baseClass = "component-cell";
  switch (examType) {
    case "ASSIGNMENT":
      return `${baseClass} assignment-cell`;
    case "QUIZ":
      return `${baseClass} quiz-cell`;
    case "DAILY":
      return `${baseClass} daily-cell`;
    case "MID_TERM":
      return `${baseClass} midterm-cell`;
    case "FINAL":
      return `${baseClass} final-cell`;
    default:
      return baseClass;
  }
};

const getScoreColor = (score) => {
  if (score >= 90) return "success";
  if (score >= 80) return "info";
  if (score >= 70) return "warning";
  if (score >= 60) return "error";

  return "error";
};

const getGradeColor = (grade) => {
  switch (grade) {
    case "A":
      return "success";
    case "B":
      return "info";
    case "C":
      return "warning";
    case "D":
      return "error";
    case "F":
      return "error";
    default:
      return "default";
  }
};

const getStatusColor = (grade) => {
  return grade === "F" ? "error" : "success";
};

const getStatusText = (grade) => {
  return grade === "F" ? "FAIL" : "PASS";
};

// Watchers
watch(selectedCourse, () => {
  if (selectedCourse.value) {
    refreshData();
  }
});

// Initialize grade components from existing grades
watch(
  grades,
  (newGrades) => {
    newGrades.forEach((grade) => {
      if (grade.components) {
        grade.components.forEach((component) => {
          const key = `${grade.userId}-${grade.examType}-${component.index}`;

          gradeComponents.value[key] = component.score;
        });
      }
    });
  },
  { immediate: true, deep: true }
);

// Lifecycle
onMounted(() => {
  refreshData();
  if (!props.courseId) {
    store.dispatch("course/getReports");
  }
});

// Watch for changes in grades data and update local components
watch(
  grades,
  () => {
    populateGradeComponents();
  },
  { deep: true }
);

// Watch for course changes
watch([() => props.courseId, selectedCourse], () => {
  refreshData();
});
</script>

<style scoped>
.enhanced-grade-table {
  border-collapse: collapse;
  font-size: 0.875rem;
  inline-size: 100%;
}

.enhanced-grade-table th,
.enhanced-grade-table td {
  padding: 8px;
  border: 1px solid rgb(var(--v-border-color));
  text-align: center;
  white-space: nowrap;
}

.enhanced-grade-table th {
  position: sticky;
  z-index: 2;
  background-color: rgb(var(--v-theme-surface));
  font-weight: 600;
  inset-block-start: 0;
}

.sticky-column {
  position: sticky;
  z-index: 3;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 2px 0 4px rgba(0, 0, 0, 10%);
  inset-inline-start: 0;
}

.even-row {
  background-color: rgb(var(--v-theme-surface), 0.05);
}

/* Assessment Weight Headers */
.assignment-header {
  background-color: rgb(139, 69, 19, 10%);
  color: rgb(139, 69, 19);
}

.quiz-header {
  background-color: rgb(0, 123, 255, 10%);
  color: rgb(0, 123, 255);
}

.daily-header {
  background-color: rgb(40, 167, 69, 10%);
  color: rgb(40, 167, 69);
}

.midterm-header {
  background-color: rgb(255, 193, 7, 10%);
  color: rgb(255, 193, 7);
}

.final-header {
  background-color: rgb(220, 53, 69, 10%);
  color: rgb(220, 53, 69);
}

/* Component Headers */
.assignment-component,
.assignment-cell {
  background-color: rgb(139, 69, 19, 5%);
}

.quiz-component,
.quiz-cell {
  background-color: rgb(0, 123, 255, 5%);
}

.daily-component,
.daily-cell {
  background-color: rgb(40, 167, 69, 5%);
}

.midterm-component,
.midterm-cell {
  background-color: rgb(255, 193, 7, 5%);
}

.final-component,
.final-cell {
  background-color: rgb(220, 53, 69, 5%);
}

.total-column,
.grade-column,
.status-column {
  background-color: rgb(var(--v-theme-primary), 0.1);
  font-weight: 600;
}

.grade-component-cell {
  inline-size: 80px;
}

.grade-component-cell .v-text-field {
  inline-size: 100%;
}

.grade-table-container {
  overflow: auto;
  max-block-size: 70vh;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .enhanced-grade-table {
    font-size: 0.75rem;
  }

  .enhanced-grade-table th,
  .enhanced-grade-table td {
    padding: 4px;
  }

  .grade-component-cell {
    inline-size: 60px;
  }
}
</style>

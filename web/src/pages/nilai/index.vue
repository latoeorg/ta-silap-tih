<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="tabler-award" size="24" class="me-3" />
            Nilai Saya
            <VSpacer />
          </VCardTitle>

          <VCardText>
            <!-- Filters -->
            <VRow class="mb-4">
              <VCol cols="12" md="4">
                <AppSelect
                  v-model="selectedCourse"
                  :items="courseOptions"
                  item-title="text"
                  item-value="value"
                  label="Mata Pelajaran"
                  clearable
                  @update:model-value="fetchGrades"
                />
              </VCol>

              <VCol cols="12" md="4">
                <AppSelect
                  v-model="selectedExamType"
                  :items="examTypeOptions"
                  item-title="title"
                  item-value="value"
                  label="Jenis Ujian"
                  clearable
                  @update:model-value="fetchGrades"
                />
              </VCol>
            </VRow>

            <!-- Grades Table -->
            <VDataTableServer
              v-model:items-per-page="itemsPerPage"
              v-model:page="page"
              :headers="headers"
              :items="grades"
              :items-length="totalItems"
              :loading="loading"
              class="text-no-wrap"
              @update:options="fetchGrades"
            >
              <!-- Subject -->
              <template #item.course.subject.name="{ item }">
                <div class="d-flex align-center">
                  <VIcon icon="tabler-book" size="20" class="me-2" />
                  {{ item.course?.subject?.name || "-" }}
                </div>
              </template>

              <!-- Course -->
              <template #item.course.name="{ item }">
                {{ item.course?.name || "-" }}
              </template>

              <!-- Exam Type -->
              <template #item.examType="{ item }">
                <VChip
                  :color="getExamTypeColor(item.examType)"
                  size="small"
                  variant="tonal"
                >
                  {{ getExamTypeName(item.examType) }}
                </VChip>
              </template>

              <!-- Total Score -->
              <template #item.totalScore="{ item }">
                <div class="d-flex align-center">
                  <VChip
                    :color="getScoreColor(item.totalScore)"
                    size="small"
                    variant="tonal"
                  >
                    {{ item.totalScore || "-" }}
                  </VChip>
                </div>
              </template>

              <!-- Components -->
              <template #item.components="{ item }">
                <div v-if="item.components && item.components.length > 0">
                  <VChip
                    v-for="(component, index) in item.components"
                    :key="index"
                    size="small"
                    variant="outlined"
                    class="me-1 mb-1"
                  >
                    {{ component.score }}
                  </VChip>
                </div>
                <span v-else class="text-body-2 text-disabled">
                  Tidak ada komponen
                </span>
              </template>

              <!-- Teacher -->
              <template #item.course.teacher.name="{ item }">
                <div class="d-flex align-center">
                  <VAvatar size="32" class="me-2">
                    <VIcon icon="tabler-user" />
                  </VAvatar>
                  {{ item.course?.teacher?.name || "-" }}
                </div>
              </template>

              <!-- Actions -->
              <template #item.actions="{ item }">
                <VBtn
                  icon
                  size="small"
                  color="primary"
                  variant="text"
                  @click="viewGradeDetails(item)"
                >
                  <VIcon icon="tabler-eye" />
                  <VTooltip activator="parent" location="top">
                    Lihat Detail
                  </VTooltip>
                </VBtn>
              </template>

              <!-- Empty state -->
              <template #no-data>
                <div class="text-center pa-4">
                  <VIcon
                    icon="tabler-award-off"
                    size="64"
                    class="text-disabled"
                  />
                  <div class="text-h6 mt-2">Belum ada nilai</div>
                  <div class="text-body-2 text-disabled">
                    Nilai akan muncul setelah guru memasukkan penilaian
                  </div>
                </div>
              </template>
            </VDataTableServer>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Grade Details Dialog -->
    <VDialog v-model="detailDialog" max-width="600">
      <VCard v-if="selectedGrade">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="tabler-award" size="24" class="me-3" />
          Detail Nilai
        </VCardTitle>

        <VCardText>
          <VRow>
            <VCol cols="12">
              <div class="text-h6 mb-4">
                {{ selectedGrade.course?.subject?.name }} -
                {{ selectedGrade.course?.name }}
              </div>
            </VCol>

            <VCol cols="6" md="4">
              <div class="text-body-2 text-disabled">Jenis Ujian</div>
              <VChip
                :color="getExamTypeColor(selectedGrade.examType)"
                size="small"
                variant="tonal"
              >
                {{ getExamTypeName(selectedGrade.examType) }}
              </VChip>
            </VCol>

            <VCol cols="6" md="4">
              <div class="text-body-2 text-disabled">Nilai Total</div>
              <div class="text-h6">
                <VChip
                  :color="getScoreColor(selectedGrade.totalScore)"
                  size="small"
                  variant="tonal"
                >
                  {{ selectedGrade.totalScore || "-" }}
                </VChip>
              </div>
            </VCol>

            <VCol cols="12" md="4">
              <div class="text-body-2 text-disabled">Guru</div>
              <div>{{ selectedGrade.course?.teacher?.name || "-" }}</div>
            </VCol>

            <VCol
              v-if="
                selectedGrade.components && selectedGrade.components.length > 0
              "
              cols="12"
            >
              <div class="text-body-2 text-disabled mb-2">Komponen Nilai</div>
              <div class="d-flex flex-wrap ga-2">
                <VChip
                  v-for="(component, index) in selectedGrade.components"
                  :key="index"
                  size="small"
                  variant="outlined"
                >
                  Komponen {{ component.index }}: {{ component.score }}
                </VChip>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn color="primary" variant="text" @click="detailDialog = false">
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

// Reactive data
const page = ref(1);
const itemsPerPage = ref(10);
const selectedCourse = ref(null);
const selectedExamType = ref(null);
const detailDialog = ref(false);
const selectedGrade = ref(null);

// Table headers
const headers = [
  { title: "Mata Pelajaran", key: "course.subject.name", sortable: false },
  { title: "Kelas", key: "course.name", sortable: false },
  { title: "Jenis Ujian", key: "examType", sortable: false },
  { title: "Nilai Total", key: "totalScore", sortable: false },
  { title: "Komponen", key: "components", sortable: false },
  { title: "Guru", key: "course.teacher.name", sortable: false },
  { title: "Aksi", key: "actions", sortable: false, align: "center" },
];

// Computed properties
const grades = computed(() => store.state.grade.grades);
const loading = computed(() => store.state.grade.loading.grades);
const totalItems = computed(() => store.state.grade.table_options.total_items);
const examTypeOptions = computed(() => store.state.grade.examTypeOptions);

const courseOptions = computed(() => {
  const uniqueCourses = new Map();

  grades.value.forEach((grade) => {
    if (grade.course && grade.course.subject) {
      const key = grade.course.id;
      if (!uniqueCourses.has(key)) {
        uniqueCourses.set(key, {
          value: grade.course.id,
          text: `${grade.course.subject.name} - ${grade.course.name}`,
        });
      }
    }
  });

  return Array.from(uniqueCourses.values());
});

// Methods
const fetchGrades = async () => {
  const params = {};

  if (selectedCourse.value) {
    params.course_id = selectedCourse.value;
  }

  if (selectedExamType.value) {
    params.examType = selectedExamType.value;
  }

  await store.dispatch("grade/getMyGrades", params);
};

const getExamTypeName = (examType) => {
  const option = examTypeOptions.value.find((opt) => opt.value === examType);

  return option ? option.title : examType;
};

const getExamTypeColor = (examType) => {
  const colors = {
    DAILY: "info",
    QUIZ: "warning",
    MID_TERM: "primary",
    FINAL: "error",
    ASSIGNMENT: "success",
  };

  return colors[examType] || "default";
};

const getScoreColor = (score) => {
  if (!score) return "default";
  if (score >= 85) return "success";
  if (score >= 70) return "info";
  if (score >= 60) return "warning";

  return "error";
};

const viewGradeDetails = (grade) => {
  selectedGrade.value = grade;
  detailDialog.value = true;
};

// Watch for page changes
watch([page, itemsPerPage], () => {
  store.commit("grade/SET_TABLE_OPTIONS", {
    page: page.value,
    page_size: itemsPerPage.value,
  });
  fetchGrades();
});

// Initial load
onMounted(() => {
  fetchGrades();
});
</script>

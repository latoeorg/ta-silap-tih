<template>
  <VDialog v-model="dialogModel" max-width="1000px" persistent>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Kelola Nilai: {{ courseName }}</span>
        <VBtn variant="text" icon="tabler-x" @click="closeDialog" />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="loading" class="d-flex justify-center py-8">
          <VProgressCircular indeterminate />
        </div>
        <div v-else>
          <!-- Header with exam type selection -->
          <div
            class="d-flex flex-wrap justify-space-between align-center mb-4 gap-3"
          >
            <div class="d-flex align-center gap-3">
              <h4 class="text-h6 mb-0">Nilai Siswa</h4>

              <VSelect
                v-model="selectedExamType"
                :items="examTypes"
                density="comfortable"
                label="Jenis Ujian"
                variant="outlined"
                style="min-width: 200px"
                @update:model-value="loadGrades"
              />

            </div>

            <div class="d-flex gap-2">
              <VBtn
                prepend-icon="tabler-file-export"
                color="secondary"
                variant="tonal"
                :loading="exportLoading"
                @click="exportGrades"
              >
                Ekspor
              </VBtn>
              <VBtn
                prepend-icon="tabler-plus"
                color="primary"
                @click="openCreateGradeForm"
              >
                Tambah Nilai
              </VBtn>
            </div>
          </div>

          <!-- Grade summary cards -->
          <div class="d-flex flex-wrap gap-4 mb-6">
            <VCard
              width="240"
              color="primary"
              variant="tonal"
              class="flex-grow-1"
            >
              <VCardItem>
                <template #prepend>
                  <VAvatar rounded="lg" color="primary" variant="flat">
                    <VIcon icon="tabler-users" />
                  </VAvatar>
                </template>
                <VCardTitle>{{ courseStudents.length }}</VCardTitle>
                <VCardSubtitle>Total Siswa</VCardSubtitle>
              </VCardItem>
            </VCard>

            <VCard
              width="240"
              color="success"
              variant="tonal"
              class="flex-grow-1"
            >
              <VCardItem>
                <template #prepend>
                  <VAvatar rounded="lg" color="success" variant="flat">
                    <VIcon icon="tabler-check" />
                  </VAvatar>
                </template>
                <VCardTitle>{{ gradedStudentCount }}</VCardTitle>
                <VCardSubtitle>Siswa Dinilai</VCardSubtitle>
              </VCardItem>
            </VCard>

            <VCard width="240" color="info" variant="tonal" class="flex-grow-1">
              <VCardItem>
                <template #prepend>
                  <VAvatar rounded="lg" color="info" variant="flat">
                    <VIcon icon="tabler-chart-bar" />
                  </VAvatar>
                </template>
                <VCardTitle>{{ averageGrade.toFixed(1) }}</VCardTitle>
                <VCardSubtitle>Nilai Rata-rata</VCardSubtitle>
              </VCardItem>
            </VCard>
          </div>

          <!-- Grades Distribution Chart -->
          <VCard class="mb-6" border>
            <VCardTitle class="d-flex justify-space-between align-center pt-4 px-4 pb-0">
              <span class="text-subtitle-1">Distribusi Nilai</span>
              <div class="d-flex align-center">
                <span class="text-caption text-medium-emphasis me-2">Siswa: {{ gradedStudentCount }}</span>
                <VChip size="small" color="primary" label>{{ selectedExamType }}</VChip>
              </div>
            </VCardTitle>
            <VCardText class="pa-4">
              <div class="grade-distribution">
                <div class="grade-bars">
                  <div 
                    v-for="(count, range) in gradeDistribution" 
                    :key="range"
                    class="grade-bar-container"
                  >
                    <div class="grade-bar-label">{{ range }}</div>
                    <div class="grade-bar-wrapper">
                      <div 
                        class="grade-bar" 
                        :class="getGradeRangeClass(range)"
                        :style="{ width: `${(count / Math.max(...Object.values(gradeDistribution), 1)) * 100}%` }"
                      ></div>
                    </div>
                    <div class="grade-bar-count">{{ count }}</div>
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>

          <!-- Grades Table -->
          <VCard v-if="courseStudents.length > 0" border>
            <VCardText class="pa-4">
              <div class="d-flex justify-space-between align-center mb-4">
                <VTextField
                  v-model="search"
                  prepend-inner-icon="tabler-search"
                  label="Cari Siswa"
                  hide-details
                  density="compact"
                  variant="outlined"
                  class="max-width-320"
                />
                
                <div class="d-flex align-center gap-2">
                  <VBtn
                    size="small"
                    variant="tonal"
                    color="secondary"
                    prepend-icon="tabler-filter"
                    @click="showFilters = !showFilters"
                  >
                    {{ showFilters ? 'Sembunyikan' : 'Tampilkan' }} Filter
                  </VBtn>
                  
                  <VSelect
                    v-model="itemsPerPage"
                    :items="[5, 10, 15, 25, 50]"
                    label="Item per halaman"
                    density="compact"
                    variant="outlined"
                    hide-details
                    class="max-width-120"
                  />
                </div>
              </div>
              
              <!-- Filters section -->
              <div v-if="showFilters" class="filter-section pa-3 mb-4 bg-surface-100 rounded">
                <div class="d-flex flex-wrap gap-4">
                  <VSelect
                    v-model="gradeFilter"
                    :items="['Semua', 'Sudah Dinilai', 'Belum Dinilai']"
                    label="Status Nilai"
                    density="compact"
                    variant="outlined"
                    hide-details
                    class="max-width-200"
                  />
                  
                  <VRangeSlider
                    v-model="scoreRange"
                    :max="100"
                    :min="0"
                    :step="5"
                    label="Rentang Nilai"
                    thumb-label="always"
                    color="primary"
                    class="max-width-300 mt-2"
                  />
                  
                  <VSpacer />
                  
                  <VBtn
                    color="primary"
                    variant="tonal"
                    size="small"
                    prepend-icon="tabler-refresh"
                    @click="resetFilters"
                    class="align-self-center"
                  >
                    Reset Filter
                  </VBtn>
                </div>
              </div>

              <VDataTable
                :headers="gradeHeaders"
                :items="filteredStudents"
                :search="search"
                density="comfortable"
                :items-per-page="itemsPerPage"
                class="elevation-0"
              >
                <!-- Student Name -->
                <template #item.name="{ item }">
                  <div class="d-flex align-center">
                    <VAvatar
                      size="32"
                      color="primary"
                      variant="tonal"
                      class="me-2"
                    >
                      <VIcon size="16" icon="tabler-user" />
                    </VAvatar>
                    <div>
                      <div class="font-weight-medium">{{ item.name }}</div>
                      <div class="text-caption text-disabled">
                        {{ item.email }}
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Status -->
                <template #item.status="{ item }">
                  <VChip
                    :color="item.grade ? 'success' : 'warning'"
                    size="small"
                    label
                  >
                    {{ item.grade ? "Sudah Dinilai" : "Belum Dinilai" }}
                  </VChip>
                </template>
                
                <!-- Components -->
                <template #item.components="{ item }">
                  <div v-if="item.grade && item.grade.components && item.grade.components.length > 0">
                    <VTooltip location="top">
                      <template #activator="{ props }">
                        <div class="d-flex gap-1" v-bind="props">
                          <VChip
                            v-if="item.grade.components.length > 2"
                            size="x-small"
                            label
                            variant="tonal"
                            color="secondary"
                            class="text-caption"
                          >
                            +{{ item.grade.components.length - 2 }} lainnya
                          </VChip>
                        </div>
                      </template>
                     
                    </VTooltip>
                  </div>
                  <span v-else>-</span>
                </template>

                <!-- Total Score -->
                <template #item.totalScore="{ item }">
                  <template v-if="item.grade">
                    <div
                      class="font-weight-bold"
                      :class="getScoreColorClass(item.grade.totalScore)"
                    >
                      {{ item.grade.totalScore?.toFixed(1) || "-" }}
                    </div>
                  </template>
                  <div v-else>-</div>
                </template>

                <!-- Actions -->
                <template #item.actions="{ item }">
                  <div class="d-flex gap-2 justify-end">
                    <IconBtn @click="editGrade(item)">
                      <VIcon icon="tabler-pencil" />
                      <VTooltip activator="parent">Beri Nilai</VTooltip>
                    </IconBtn>
                    
                    <IconBtn v-if="item.grade" @click="viewGradeDetails(item)">
                      <VIcon icon="tabler-eye" />
                      <VTooltip activator="parent">Lihat Detail</VTooltip>
                    </IconBtn>
                  </div>
                </template>
              </VDataTable>
            </VCardText>
          </VCard>

          <VAlert v-else type="info" class="mt-4" variant="tonal">
            <div class="d-flex align-center">
              <VIcon icon="tabler-users-off" class="me-2" />
              <span>Tidak ada siswa yang terdaftar dalam mata pelajaran ini.</span>
            </div>
            <div class="mt-2">Silakan tambahkan siswa ke mata pelajaran terlebih dahulu.</div>
          </VAlert>
        </div>
      </VCardText>

      <VDivider />
      
      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn
          color="secondary"
          variant="tonal"
          @click="closeDialog"
        >
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Grade Form Dialog -->
  <VDialog v-model="gradeFormDialog" max-width="700px" persistent>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>{{
          selectedStudent ? `Nilai: ${selectedStudent.name}` : "Penilaian Massal"
        }}</span>
        <VBtn variant="text" icon="tabler-x" @click="closeGradeForm" />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <VForm ref="gradeFormRef">
          <!-- Exam Type Selection (only for new grades) -->
          <VSelect
            v-if="!editingGrade"
            v-model="gradeForm.examType"
            :items="examTypes"
            label="Jenis Ujian"
            density="comfortable"
            variant="outlined"
            :rules="[(v) => !!v || 'Jenis ujian wajib dipilih']"
            class="mb-4"
          />

          <!-- Student Selection (only for batch grading and not when editing) -->
          <div v-if="!selectedStudent && !editingGrade" class="mb-4">
            <VSelect
              v-model="gradeForm.selectedStudents"
              :items="courseStudents"
              item-title="name"
              item-value="id"
              label="Pilih Siswa"
              density="comfortable"
              variant="outlined"
              multiple
              chips
              closable-chips
              :rules="[(v) => v.length > 0 || 'Pilih minimal satu siswa']"
            >
              <template #selection="{ item }">
                <VChip closable>
                  {{ item.raw.name }}
                </VChip>
              </template>
            </VSelect>
          </div>

          <!-- Show selected student when editing -->
          <div v-else-if="selectedStudent" class="mb-4">
            <div class="d-flex align-center py-2">
              <VAvatar
                size="36"
                color="primary"
                variant="tonal"
                class="me-3"
              >
                <VIcon icon="tabler-user" />
              </VAvatar>
              <div>
                <div class="font-weight-medium">{{ selectedStudent.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ selectedStudent.email }}</div>
              </div>
            </div>
          </div>

          <!-- Grade Components -->
          <h5 class="text-h6 mb-3">Komponen Nilai</h5>

          <div
            v-if="gradeComponentDefinitions.length === 0"
            class="text-center pa-4 bg-surface-100 rounded mb-4"
          >
            <VIcon
              icon="tabler-scale-outline"
              size="32"
              class="mb-2"
              color="warning"
            />
            <p class="text-medium-emphasis">
              Tidak ada komponen nilai yang ditentukan untuk jenis ujian ini
            </p>
            <p class="text-caption">
              Silakan tentukan komponen atau masukkan nilai total langsung
            </p>
          </div>

          <div v-else class="mb-4 pb-2">
            <div
              v-for="component in gradeComponentDefinitions"
              :key="component.id"
              class="d-flex gap-3 align-center mb-3"
            >
              <div style="flex: 2">
                <div>
                  Bobot: {{ (component.weight * 100).toFixed(0) }}%
                </div>
              </div>

              <VTextField
                v-model.number="gradeForm.components[component.id]"
                :label="`Nilai (maks: ${component.maxScore})`"
                type="number"
                density="comfortable"
                variant="outlined"
                style="flex: 1"
                :rules="[
                  (v) => v !== null || 'Nilai wajib diisi',
                  (v) =>
                    (v >= 0 && v <= component.maxScore) ||
                    `Nilai harus antara 0 dan ${component.maxScore}`,
                ]"
                :min="0"
                :max="component.maxScore"
                hide-spin-buttons
              />
            </div>
          </div>

          <!-- Total Score (manual override or shown as calculated) -->
          <div class="d-flex flex-column gap-2">
            <VDivider class="mb-3" />

            <!-- Manual Score Override -->
            <div class="d-flex align-center justify-space-between">
              <div class="text-subtitle-1 font-weight-bold">Nilai Total:</div>
              <div
                v-if="gradeComponentDefinitions.length > 0"
                class="d-flex align-center"
              >
                <div class="me-3 text-h6 font-weight-bold">
                  {{ calculatedTotalScore.toFixed(1) }}
                </div>
                <VSwitch
                  v-model="overrideTotal"
                  color="warning"
                  label="Ganti"
                  density="comfortable"
                  hide-details
                />
              </div>
            </div>

            <VTextField
              v-if="overrideTotal || gradeComponentDefinitions.length === 0"
              v-model.number="gradeForm.totalScore"
              label="Nilai Total"
              type="number"
              density="comfortable"
              variant="outlined"
              :rules="[
                (v) => v !== null || 'Nilai total wajib diisi',
                (v) =>
                  (v >= 0 && v <= 100) || 'Nilai harus antara 0 dan 100',
              ]"
              :min="0"
              :max="100"
              class="mt-2"
            />
          </div>
        </VForm>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn variant="text" color="secondary" @click="closeGradeForm">
          Batal
        </VBtn>
        <VBtn color="primary" :loading="savingGrade" @click="saveGrade">
          {{ editingGrade ? "Perbarui" : "Simpan" }} Nilai
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Grade Details Dialog -->
  <VDialog v-model="gradeDetailsDialog" max-width="700px">
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Detail Nilai</span>
        <VBtn variant="text" icon="tabler-x" @click="gradeDetailsDialog = false" />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="selectedGrade && selectedStudent" class="pa-2">
          <!-- Student info -->
          <div class="d-flex align-center mb-4">
            <VAvatar
              size="48"
              color="primary"
              variant="tonal"
              class="me-3"
            >
              <VIcon size="24" icon="tabler-user" />
            </VAvatar>
            <div>
              <div class="text-h6">{{ selectedStudent.name }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ selectedStudent.email }}</div>
            </div>
          </div>

          <!-- Grade summary -->
          <VCard variant="outlined" class="mb-4">
            <VCardItem>
              <template #prepend>
                <VAvatar rounded color="primary" variant="tonal">
                  <VIcon icon="tabler-license" />
                </VAvatar>
              </template>

              <VCardTitle>{{ selectedExamType }}</VCardTitle>
              <VCardSubtitle>Jenis Ujian</VCardSubtitle>
            </VCardItem>

            <VDivider />

            <VCardText>
              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-subtitle-1">Nilai Total</span>
                <VChip
                  size="large"
                  :color="getScoreColorClass(selectedGrade.totalScore).replace('text-', '')"
                  variant="tonal"
                >
                  <span class="text-h6">{{ selectedGrade.totalScore.toFixed(1) }}</span>
                </VChip>
              </div>

              <div class="text-caption text-medium-emphasis">
                Terakhir diperbarui: {{ formatDate(selectedGrade.updatedAt || selectedGrade.createdAt) }}
              </div>
            </VCardText>
          </VCard>

          <!-- Component scores -->
          <h6 class="text-subtitle-1 mb-3">Komponen Nilai</h6>

          <div v-if="selectedGrade.components && selectedGrade.components.length > 0">
            <VTable density="compact" class="mb-4">
              <thead>
                <tr>
                  <th>Nilai</th>
                  <th>Maks</th>
                  <th>Bobot</th>
                  <th>Tertimbang</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comp in selectedGrade.components" :key="comp.id">
                  <td>{{ comp.score }}</td>
                  <td>{{ getComponentMaxScore(comp.id) }}</td>
                  <td>{{ getComponentWeight(comp.id) }}%</td>
                  <td>
                    {{ calculateWeightedScore(comp.score, comp.id).toFixed(1) }}
                  </td>
                </tr>
              </tbody>
            </VTable>
            
            <!-- Score visualization -->
            <VCard variant="flat" class="mb-4 pa-3 bg-surface-100 rounded">
              <div class="grade-visualization">
                <h6 class="text-subtitle-2 mb-3">Distribusi Nilai</h6>
                <div class="component-bars">
                  <div v-for="comp in selectedGrade.components" :key="comp.id" class="component-bar-container mb-2">
                    <div class="d-flex justify-space-between mb-1">
                      <span class="text-caption">{{ comp.score }} / {{ getComponentMaxScore(comp.id) }}</span>
                    </div>
                    <div class="progress-container">
                      <div 
                        class="progress-bar" 
                        :style="{ 
                          width: `${(comp.score / getComponentMaxScore(comp.id)) * 100}%`,
                          backgroundColor: getScoreBarColor(comp.score / getComponentMaxScore(comp.id))
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </VCard>
          </div>
          <VAlert v-else type="info" variant="tonal" density="compact">
            Tidak ada nilai komponen tersedia
          </VAlert>
          
          <!-- Grade history (placeholder for future feature) -->
          <div class="mt-4">
            <h6 class="text-subtitle-1 mb-2">Riwayat Nilai</h6>
            <VCard variant="outlined">
              <VList lines="two">
                <VListItem
                  prepend-icon="tabler-history"
                  title="Nilai awal tercatat"
                  :subtitle="`Nilai: ${selectedGrade.totalScore.toFixed(1)}`"
                >
                  <template #append>
                    <div class="text-caption">
                      {{ formatDate(selectedGrade.createdAt) }}
                    </div>
                  </template>
                </VListItem>
                
                <!-- If we have update history, we could show it here -->
                <VListItem
                  v-if="selectedGrade.updatedAt && selectedGrade.updatedAt !== selectedGrade.createdAt"
                  prepend-icon="tabler-pencil"
                  title="Nilai diperbarui"
                  :subtitle="`Nilai saat ini: ${selectedGrade.totalScore.toFixed(1)}`"
                >
                  <template #append>
                    <div class="text-caption">
                      {{ formatDate(selectedGrade.updatedAt) }}
                    </div>
                  </template>
                </VListItem>
              </VList>
            </VCard>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn
          variant="tonal" 
          color="secondary"
          @click="gradeDetailsDialog = false"
        >
          Tutup
        </VBtn>
        <VBtn
          color="primary"
          @click="editGrade(selectedStudent)"
        >
          Edit Nilai
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Grade Component Modal -->
  <GradeComponentModal
    v-model="componentsModalOpen"
    :exam-type="selectedExamType"
    @update:exam-type="selectedExamType = $event"
    @save="loadGradeComponentDefinitions"
  />
</template>

<script setup>
import axiosInstance from "@/utils/axios";
import GradeComponentModal from "./grade-component-modal.vue";

import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

// Props and emits
const props = defineProps({
  courseId: { type: String, required: true },
  courseName: { type: String, default: "Course" },
  open: { type: Boolean, default: false },
});
const emit = defineEmits(["update:open", "refresh"]);

// Dialog state
const dialogModel = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});
const closeDialog = () => {
  emit("update:open", false);
};

// UI state
const loading = ref(false);
const exportLoading = ref(false);
const search = ref("");
const selectedExamType = ref(null);
const itemsPerPage = ref(10);
const showFilters = ref(false);

// Filters
const gradeFilter = ref("All");
const scoreRange = ref([0, 100]);

// Grade UI state
const gradeFormDialog = ref(false);
const gradeDetailsDialog = ref(false);
const savingGrade = ref(false);
const selectedStudent = ref(null);
const selectedGrade = ref(null);
const editingGrade = ref(false);
const overrideTotal = ref(false);
const componentsModalOpen = ref(false);

// Data collections
const courseStudents = ref([]);
const grades = ref([]);
const examTypes = ref([
  "DAILY",
  "MID_TERM",
  "FINAL",
  "ASSIGNMENT",
  "QUIZ",
]);
const gradeComponentDefinitions = ref([]);

// Form for creating/editing grades
const gradeFormRef = ref(null);
const gradeForm = ref({
  examType: null,
  components: {},
  totalScore: null,
  selectedStudents: [],
});

// Table headers for grades
const gradeHeaders = computed(() => {
  const baseHeaders = [
    { title: "Student", key: "name", sortable: true },
    { title: "Status", key: "status", sortable: true },
    { title: "Components", key: "components", sortable: false },
  ];


  const endHeaders = [
    { title: "Total Score", key: "totalScore", sortable: true },
    { title: "Actions", key: "actions", align: "end", sortable: false },
  ];

  return [...baseHeaders, ...endHeaders];
});

// Computed values for summary stats
const gradedStudentCount = computed(() => {
  return courseStudents.value.filter((student) =>
    grades.value.some(
      (grade) =>
        grade.userId === student.id && grade.examType === selectedExamType.value
    )
  ).length;
});

const averageGrade = computed(() => {
  const studentGrades = grades.value.filter(
    (grade) =>
      grade.examType === selectedExamType.value && grade.totalScore !== null
  );

  if (studentGrades.length === 0) return 0;

  const total = studentGrades.reduce(
    (sum, grade) => sum + (grade.totalScore || 0),
    0
  );
  return total / studentGrades.length;
});

// Grade distribution
const gradeDistribution = computed(() => {
  const distribution = {
    '91-100': 0,
    '81-90': 0,
    '71-80': 0,
    '61-70': 0,
    '51-60': 0,
    '0-50': 0,
  };

  grades.value.forEach(grade => {
    if (grade.examType !== selectedExamType.value || grade.totalScore === null) return;
    
    const score = grade.totalScore;
    
    if (score > 90) distribution['91-100']++;
    else if (score > 80) distribution['81-90']++;
    else if (score > 70) distribution['71-80']++;
    else if (score > 60) distribution['61-70']++;
    else if (score > 50) distribution['51-60']++;
    else distribution['0-50']++;
  });
  
  return distribution;
});

// Filtered students with grades
const filteredStudents = computed(() => {
  let students = courseStudents.value.map((student) => {
    const studentGrade = grades.value.find(
      (grade) =>
        grade.userId === student.id && grade.examType === selectedExamType.value
    );

    return {
      ...student,
      grade: studentGrade || null,
    };
  });

  // Apply filters
  if (gradeFilter.value === 'Graded') {
    students = students.filter(student => student.grade);
  } else if (gradeFilter.value === 'Not Graded') {
    students = students.filter(student => !student.grade);
  }

  // Apply score range filter
  if (gradeFilter.value === 'Graded') {
    students = students.filter(student => {
      const score = student.grade?.totalScore || 0;
      return score >= scoreRange.value[0] && score <= scoreRange.value[1];
    });
  }

  return students;
});

// Calculate total score based on components
const calculatedTotalScore = computed(() => {
  if (!gradeComponentDefinitions.value.length) return 0;

  let total = 0;
  let weightTotal = 0;

  for (const component of gradeComponentDefinitions.value) {
    const score = gradeForm.value.components[component.id];
    if (score !== undefined && score !== null) {
      // Calculate weighted score based on component weight
      const weightedScore =
        (score / component.maxScore) * component.weight * 100;
      total += weightedScore;
      weightTotal += component.weight;
    }
  }

  // Normalize by total weight if not 1.0
  return weightTotal > 0 ? total / weightTotal : 0;
});

// Reset filters
const resetFilters = () => {
  gradeFilter.value = "All";
  scoreRange.value = [0, 100];
  search.value = "";
};

// API operations with unified error handling
const apiOperation = async (
  method,
  url,
  data = null,
  params = null,
  successMsg = ""
) => {
  try {
    const config = { method, url };
    if (data) config.data = data;
    if (params) config.params = params;

    const result = await axiosInstance(config);

    if (successMsg) toast.success(successMsg);
    return result.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      `Failed to ${method.toLowerCase()} resource`;
    toast.error(errorMsg);
    throw error;
  }
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Load data
const loadData = async () => {
  loading.value = true;

  try {
    // Fetch course with its students
    const result = await apiOperation(
      "GET",
      `/course/${props.courseId}`,
      null,
      { include: "students" }
    );
    courseStudents.value = result.data?.students || [];

    // Set default exam type if not already set
    if (!selectedExamType.value && examTypes.value.length > 0) {
      selectedExamType.value = examTypes.value[0];
    }

    // Load grade components for the default exam type
    await loadGradeComponentDefinitions();

    // Load grades
    await loadGrades();
  } catch (error) {
    console.error("Error loading course data:", error);
  } finally {
    loading.value = false;
  }
};

const loadGradeComponentDefinitions = async () => {
  try {
    // Get the subject ID from the course
    const courseResult = await apiOperation("GET", `/course/${props.courseId}`, null, {});
    const subjectId = courseResult.data?.subjectId;
    
    if (!subjectId) {
      console.error("No subject ID found for this course");
      gradeComponentDefinitions.value = [];
      return;
    }

    // Fetch assessment weights from API based on subject ID and exam type
    const result = await apiOperation("GET", "/assessment-weight", null, {
      subjectId: subjectId,
      examType: selectedExamType.value,
    });

    if (result.data && result.data.length > 0) {
      // Find the assessment weight for the current exam type
      const assessmentWeight = result.data.find(w => w.examType === selectedExamType.value);
      
      if (assessmentWeight) {
        // Create component definitions based on the quota from assessment weight
        const quota = assessmentWeight.quota || 1;
        const componentWeight = assessmentWeight.weight || 1;
        
        // Generate component definitions based on quota
        gradeComponentDefinitions.value = Array.from({ length: quota }, (_, i) => ({
          id: `${selectedExamType.value.toLowerCase()}_${i+1}`,
          name: `Komponen ${i+1}`,
          weight: componentWeight / quota, 
          maxScore: 100,
          index: i + 1,
        }));
      } else {
        // Fallback if no matching assessment weight found
        gradeComponentDefinitions.value = [
          {
            id: `${selectedExamType.value.toLowerCase()}_1`,
            name: "Komponen 1",
            weight: 1,
            maxScore: 100,
            index: 1,
          }
        ];
      }
    } else {
      // Fallback to a single component if no assessment weights
      gradeComponentDefinitions.value = [
        {
          id: `${selectedExamType.value.toLowerCase()}_1`,
          name: "Komponen 1",
          weight: 1,
          maxScore: 100,
          index: 1,
        }
      ];
    }
  } catch (error) {
    console.error("Error loading assessment weights:", error);
    gradeComponentDefinitions.value = [];
  }
};

const loadGrades = async () => {
  if (!props.courseId || !selectedExamType.value) return;

  try {
    // Fetch grades for this course and exam type
    const result = await apiOperation("GET", "/grade", null, {
      courseId: props.courseId,
      examType: selectedExamType.value,
      include: "components",
    });

    grades.value = result.data || [];
  } catch (error) {
    console.error("Error loading grades:", error);
    grades.value = [];
  }
};

// Export grades
const exportGrades = async () => {
  exportLoading.value = true;

  try {
    await apiOperation(
      "GET",
      `/export/grades/${props.courseId}`,
      null,
      {
        examType: selectedExamType.value,
      },
      "Grades exported successfully"
    );

    // Handle file download - typically the API would return a file URL
    // For now, let's just show a success message
    toast.success("Export completed. Check your downloads folder.");
  } catch (error) {
    console.error("Error exporting grades:", error);
  } finally {
    exportLoading.value = false;
  }
};

// Grade form
const resetGradeForm = () => {
  gradeForm.value = {
    examType: selectedExamType.value,
    components: {},
    totalScore: null,
    selectedStudents: [],
  };

  overrideTotal.value = false;
  editingGrade.value = false;
  selectedGrade.value = null;

  // Reset validation
  if (gradeFormRef.value) {
    gradeFormRef.value.resetValidation();
  }
};

const openCreateGradeForm = () => {
  resetGradeForm();
  selectedStudent.value = null;
  gradeFormDialog.value = true;
};

const editGrade = (student) => {
  // Make sure we have the complete student object
  selectedStudent.value = student;
  
  const existingGrade = grades.value.find(
    (grade) => grade.userId === student.id && grade.examType === selectedExamType.value
  );

  resetGradeForm();

  if (existingGrade) {
    editingGrade.value = true;
    gradeForm.value.examType = existingGrade.examType;
    gradeForm.value.totalScore = existingGrade.totalScore;

    // Load component scores
    if (existingGrade.components && existingGrade.components.length > 0) {
      existingGrade.components.forEach((component) => {
        gradeForm.value.components[component.componentId] = component.score;
      });

      // If the grade has components but calculated total is different,
      // assume it was manually overridden
      if (Math.abs(calculatedTotalScore.value - existingGrade.totalScore) > 0.1) {
        overrideTotal.value = true;
      }
    } else {
      // If no components exist, assume manual total
      overrideTotal.value = true;
    }
  } else {
    // For new grades for an existing student
    editingGrade.value = false;
    gradeForm.value.examType = selectedExamType.value;
  }

  // Close the details dialog if it's open
  gradeDetailsDialog.value = false;
  
  // Open the grade form dialog
  gradeFormDialog.value = true;
};

const closeGradeForm = () => {
  gradeFormDialog.value = false;
  resetGradeForm();
  selectedStudent.value = null;
};

const saveGrade = async () => {
  if (!gradeFormRef.value) return;

  const { valid } = await gradeFormRef.value.validate();
  if (!valid) return;

  savingGrade.value = true;

  try {
    // Prepare component data
    const components = [];

    Object.entries(gradeForm.value.components).forEach(
      ([componentId, score], idx) => {
        if (score !== null && score !== undefined) {
          const componentDef = gradeComponentDefinitions.value.find(
            (c) => c.id === componentId
          );

          components.push({
            componentId, 
            score: parseFloat(score),
            index: componentDef?.index || idx + 1,
          });
        }
      }
    );

    // Calculate the final score (round to 1 decimal place to avoid floating point issues)
    const totalScore = (overrideTotal.value || components.length === 0)
      ? parseFloat(parseFloat(gradeForm.value.totalScore).toFixed(1))
      : parseFloat(calculatedTotalScore.value.toFixed(1));

    if (editingGrade.value && selectedStudent.value) {
      // Update an existing grade
      await apiOperation(
        "PUT",
        `/grade/${selectedStudent.value.id}/${props.courseId}/${selectedExamType.value}`,
        {
          totalScore,
          components
        },
        null,
        "Grade updated successfully"
      );
    } else if (selectedStudent.value) {
      // Create a new grade for a single student
      await apiOperation(
        "POST",
        "/grade",
        {
          userId: selectedStudent.value.id,
          courseId: props.courseId,
          examType: gradeForm.value.examType || selectedExamType.value,
          totalScore,
          components
        },
        null,
        "Grade created successfully"
      );
    } else {
      // Batch update for multiple students
      await apiOperation(
        "POST",
        "/grade/batch",
        {
          grades: gradeForm.value.selectedStudents.map((studentId) => ({
            userId: studentId,
            courseId: props.courseId,
            examType: gradeForm.value.examType || selectedExamType.value,
            totalScore,
            components
          })),
        },
        null,
        "Grades created successfully"
      );
    }

    // Close form and reload data
    closeGradeForm();
    await loadGrades();
    
    // Emit refresh event to notify parent component
    emit("refresh");
  } catch (error) {
    console.error("Error saving grade:", error);
  } finally {
    savingGrade.value = false;
  }
};

// Grade details
const viewGradeDetails = (student) => {
  selectedStudent.value = student;
  selectedGrade.value = grades.value.find(
    (grade) =>
      grade.userId === student.id && grade.examType === selectedExamType.value
  );

  if (selectedGrade.value) {
    gradeDetailsDialog.value = true;
  } else {
    toast.error("Grade details not found");
  }
};

// Open grade components modal
const openComponentsModal = () => {
  if (!selectedExamType.value) {
    toast.error("Please select an exam type first");
    return;
  }
  componentsModalOpen.value = true;
};

// Helper functions
const findComponentScore = (components, componentDef) => {
  if (!components) return "-";

  const component = components.find((c) => c.componentId === componentDef.id);
  return component ? component.score.toFixed(1) : "-";
};

const getScoreColorClass = (score) => {
  if (score === null || score === undefined) return "";
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
};

const getGradeRangeClass = (range) => {
  const rangeStart = parseInt(range.split('-')[0]);
  if (rangeStart >= 80) return "grade-bar-a";
  if (rangeStart >= 70) return "grade-bar-b";
  if (rangeStart >= 60) return "grade-bar-c";
  if (rangeStart >= 50) return "grade-bar-d";
  return "grade-bar-f";
};

const getScoreBarColor = (percentage) => {
  if (percentage >= 0.9) return '#4caf50';
  if (percentage >= 0.8) return '#8bc34a';
  if (percentage >= 0.7) return '#cddc39';
  if (percentage >= 0.6) return '#ffc107';
  if (percentage >= 0.5) return '#ff9800';
  return '#f44336';
};

const getComponentMaxScore = (componentId) => {
  const component = gradeComponentDefinitions.value.find(
    (comp) => comp.id === componentId
  );
  return component ? component.maxScore : 0;
};

const getComponentWeight = (componentId) => {
  const component = gradeComponentDefinitions.value.find(
    (comp) => comp.id === componentId
  );
  return component ? (component.weight * 100).toFixed(0) : 0;
};

const calculateWeightedScore = (score, componentId) => {
  const component = gradeComponentDefinitions.value.find(
    (comp) => comp.id === componentId
  );
  if (!component) return 0;
  
  return (score / component.maxScore) * component.weight * 100;
};

// Watchers
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      loadData();
    }
  }
);

watch([() => selectedExamType.value], () => {
  if (selectedExamType.value) {
    loadGradeComponentDefinitions();
    loadGrades();
  }
});
</script>

<style scoped>
.max-width-120 {
  max-width: 120px;
}

.max-width-200 {
  max-width: 200px;
}

.max-width-300 {
  max-width: 300px;
}

.max-width-320 {
  max-width: 320px;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: scale(1.01);
}

.text-success {
  color: #4caf50 !important;
}

.text-warning {
  color: #ff9800 !important;
}

.text-danger {
  color: #f44336 !important;
}

/* Grade distribution styling */
.grade-distribution {
  padding: 10px 0;
}

.grade-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grade-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.grade-bar-label {
  width: 60px;
  font-size: 0.875rem;
  text-align: right;
}

.grade-bar-wrapper {
  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  height: 20px;
  overflow: hidden;
}

.grade-bar {
  height: 100%;
  min-width: 2%;
  transition: width 0.5s ease;
}

.grade-bar-count {
  width: 30px;
  text-align: right;
  font-weight: bold;
}

.grade-bar-a {
  background-color: #4caf50;
}

.grade-bar-b {
  background-color: #8bc34a;
}

.grade-bar-c {
  background-color: #ffc107;
}

.grade-bar-d {
  background-color: #ff9800;
}

.grade-bar-f {
  background-color: #f44336;
}

/* Filter section */
.filter-section {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* Component visualization */
.component-bar-container {
  width: 100%;
}

.progress-container {
  width: 100%;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  min-width: 2%;
  transition: width 0.3s ease;
}
</style>

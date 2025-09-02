<template>
  <div>
    <VCard :title="title">
      <VDivider />

      <VCardText>
        <div class="d-flex align-center justify-between flex-wrap gap-4">
          <div class="d-flex align-center gap-4">
            <div style="inline-size: 20rem;">
              <AppTextField
                v-model="table_options.search"
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
              style="inline-size: 15rem;"
              clearable
            />
            
            <VSelect
              v-model="selectedExamType"
              :items="examTypeOptions"
              item-title="title"
              item-value="value"
              label="Jenis Ujian"
              density="compact"
              style="inline-size: 12rem;"
              clearable
            />
          </div>

          <div class="d-flex gap-2">
            <VBtn
              v-if="!hideAddButton"
              color="secondary"
              variant="outlined"
              @click="handleBatchForm"
            >
              <VIcon
                start
                icon="tabler-users-plus"
              />
              Nilai Massal
            </VBtn>
            
            <VBtn
              v-if="!hideAddButton"
              @click="handleDrawerForm(true)"
            >
              <VIcon
                start
                icon="tabler-plus"
              />
              Tambah Nilai
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="px-0 pt-0">
        <VDataTableServer
          v-model:options="table_options"
          v-model:items-per-page="table_options.page_size"
          v-model:page="table_options.page"
          :items-length="table_options.total_items"
          :search="table_options.search"
          :headers="headers"
          :items="grades"
          :loading="loading"
          class="text-no-wrap"
          @update:options="refetch"
        >
          <template #item.user="{ item }">
            <div class="d-flex align-center gap-3">
              <VAvatar size="32">
                <VImg
                  :src="item.user?.avatar || '/images/avatars/avatar-1.png'"
                  :alt="item.user?.name"
                />
              </VAvatar>
              <div>
                <div class="text-body-1 font-weight-medium">
                  {{ item.user?.name }}
                </div>
                <div class="text-caption text-disabled">
                  {{ item.user?.email }}
                </div>
              </div>
            </div>
          </template>

          <template #item.course="{ item }">
            <div>
              <div class="text-body-1 font-weight-medium">
                {{ item.course?.name }}
              </div>
              <div class="text-caption text-disabled">
                {{ item.course?.subject?.name }}
              </div>
            </div>
          </template>

          <template #item.examType="{ item }">
            <VChip
              :color="getExamTypeColor(item.examType)"
              size="small"
              variant="tonal"
            >
              {{ getExamTypeText(item.examType) }}
            </VChip>
          </template>

          <template #item.totalScore="{ item }">
            <div class="text-center">
              <VChip
                :color="getScoreColor(item.totalScore)"
                size="small"
                variant="tonal"
              >
                {{ item.totalScore }}
              </VChip>
            </div>
          </template>

          <template #item.grade="{ item }">
            <div class="text-center font-weight-bold">
              {{ calculateGrade(item.totalScore) }}
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1 justify-end">
              <IconBtn @click="handleUpdate(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="handleDelete(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <!-- Single Grade Form -->
    <GradeFormDrawer
      v-if="!hideAddButton"
      :open="drawerForm"
      :course-id="courseId"
      @handle-close="handleDrawerForm"
      @on-submit-success="refetch"
    />

    <!-- Batch Grade Form -->
    <GradeBatchModal
      v-if="!hideAddButton"
      :open="batchModal"
      :course-id="courseId || selectedCourse"
      @handle-close="handleBatchForm"
      @on-submit-success="refetch"
    />
  </div>
</template>

<script setup>
import { SwalDelete } from '@/utils/sweetalert'
import { computed, onMounted, ref, watch } from 'vue'
import GradeBatchModal from './grade-batch-modal.vue'
import GradeFormDrawer from './grade-form-drawer.vue'

const props = defineProps({
  hideAddButton: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Pengurusan Nilai',
  },
  courseId: {
    type: String,
    default: '',
  },
})

const store = useVuex()

// Local state
const drawerForm = ref(false)
const batchModal = ref(false)
const selectedCourse = ref('')
const selectedExamType = ref('')

// Computed properties
const loading = computed(() => store.state.grade.loading.grades)
const grades = computed(() => store.state.grade.grades)
const courses = computed(() => store.state.grade.list_courses)
const examTypeOptions = computed(() => store.state.grade.examTypeOptions)

const table_options = computed({
  get: () => store.state.grade.table_options,
  set: val => store.commit('grade/SET_TABLE_OPTIONS', val),
})

// Table headers
const headers = ref([
  { title: 'Siswa', key: 'user', sortable: false },
  { title: 'Kursus', key: 'course', sortable: false },
  { title: 'Jenis Ujian', key: 'examType' },
  { title: 'Nilai', key: 'totalScore', align: 'center' },
  { title: 'Grade', key: 'grade', align: 'center' },
  { title: 'Tindakan', key: 'actions', align: 'end', sortable: false },
].filter(h => !(props.courseId && h.key === 'course')))

// Methods
const refetch = async () => {
  const params = {
    ...(props.courseId ? { course_id: props.courseId } : {}),
    ...(selectedCourse.value ? { course_id: selectedCourse.value } : {}),
    ...(selectedExamType.value ? { exam_type: selectedExamType.value } : {}),
  }
  
  await store.dispatch('grade/getGrades', params)
}

const handleDrawerForm = value => {
  if (value) {
    store.dispatch('grade/fetchPrerequisites')
  }
  drawerForm.value = value
}

const handleBatchForm = () => {
  batchModal.value = !batchModal.value
}

const handleUpdate = async item => {
  await store.dispatch('grade/setFormUpdate', {
    userId: item.userId,
    courseId: item.courseId,
    examType: item.examType,
    grade: item,
  })
  handleDrawerForm(true)
}

const handleDelete = async item => {
  const confirm = await SwalDelete()
  if (confirm) {
    const success = await store.dispatch("grade/delete", {
      userId: item.userId,
      courseId: item.courseId,
      examType: item.examType,
    })
    
    if (success) {
      refetch()
    }
  }
}

// Utility functions
const getExamTypeColor = examType => {
  switch (examType) {
  case 'DAILY': return 'primary'
  case 'QUIZ': return 'info'
  case 'MIDTERM': return 'warning'
  case 'FINAL': return 'error'
  case 'ASSIGNMENT': return 'success'
  case 'PROJECT': return 'secondary'
  default: return 'default'
  }
}

const getExamTypeText = examType => {
  switch (examType) {
  case 'DAILY': return 'Harian'
  case 'QUIZ': return 'Kuis'
  case 'MIDTERM': return 'UTS'
  case 'FINAL': return 'UAS'
  case 'ASSIGNMENT': return 'Tugas'
  case 'PROJECT': return 'Proyek'
  default: return examType
  }
}

const getScoreColor = score => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'info'
  if (score >= 70) return 'warning'
  if (score >= 60) return 'error'

  return 'error'
}

const calculateGrade = score => {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'

  return 'F'
}

// Watchers
watch([selectedCourse, selectedExamType], () => {
  refetch()
}, { deep: true })

// Lifecycle
onMounted(() => {
  refetch()
  store.dispatch('grade/fetchPrerequisites')
})
</script>

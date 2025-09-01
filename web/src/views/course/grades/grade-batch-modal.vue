<template>
  <VDialog
    v-model="isOpen"
    max-width="1000"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-users-plus" />
        Nilai Massal
        <VSpacer />
        <IconBtn @click="handleClose">
          <VIcon icon="tabler-x" />
        </IconBtn>
      </VCardTitle>

      <VDivider />

      <VCardText>
        <VForm ref="refForm">
          <VRow class="mb-4">
            <VCol
              v-if="!courseId"
              cols="12"
              md="6"
            >
              <VSelect
                v-model="batchForm.courseId"
                :items="list_courses"
                item-title="name"
                item-value="id"
                label="Kursus *"
                :rules="[requiredValidator]"
                placeholder="Pilih kursus"
                :loading="loading.batch"
                @update:model-value="handleCourseChange"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="batchForm.examType"
                :items="examTypeOptions"
                item-title="title"
                item-value="value"
                label="Jenis Ujian *"
                :rules="[requiredValidator]"
                placeholder="Pilih jenis ujian"
                @update:model-value="handleExamTypeChange"
              />
            </VCol>
          </VRow>

          <VDivider class="mb-4" />

          <div v-if="batchForm.grades.length > 0">
            <div class="d-flex align-center justify-between mb-4">
              <h6 class="text-h6">
                Daftar Siswa ({{ batchForm.grades.length }})
              </h6>
              <div class="d-flex gap-2 align-center">
                <AppTextField
                  v-model.number="bulkScore"
                  type="number"
                  label="Nilai Massal"
                  density="compact"
                  style="inline-size: 8rem;"
                  min="0"
                  max="100"
                  placeholder="0-100"
                />
                <VBtn
                  size="small"
                  variant="outlined"
                  @click="applyBulkScore"
                >
                  Terapkan
                </VBtn>
              </div>
            </div>

            <VRow>
              <VCol
                v-for="(grade, index) in batchForm.grades"
                :key="grade.userId"
                cols="12"
                md="4"
                lg="3"
              >
                <VCard
                  variant="outlined"
                  class="pa-3"
                >
                  <div class="d-flex align-center gap-3 mb-3">
                    <VAvatar size="32">
                      <VImg
                        :src="grade.avatar || '/images/avatars/avatar-1.png'"
                        :alt="grade.userName"
                      />
                    </VAvatar>
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">
                        {{ grade.userName }}
                      </div>
                    </div>
                  </div>
                  
                  <AppTextField
                    :model-value="grade.totalScore"
                    type="number"
                    label="Nilai"
                    density="compact"
                    min="0"
                    max="100"
                    hide-details
                    @update:model-value="updateGradeScore(index, $event)"
                  />
                  
                  <div class="d-flex align-center justify-center gap-2 mt-2">
                    <VIcon
                      :icon="getGradeIcon(grade.totalScore)"
                      :color="getGradeColor(grade.totalScore)"
                      size="16"
                    />
                    <span
                      class="text-caption font-weight-bold"
                      :class="`text-${getGradeColor(grade.totalScore)}`"
                    >
                      {{ calculateGrade(grade.totalScore) }}
                    </span>
                  </div>
                </VCard>
              </VCol>
            </VRow>
          </div>
          
          <div
            v-else-if="!loading.batch"
            class="text-center py-8"
          >
            <VIcon
              icon="tabler-users-off"
              size="48"
              class="text-disabled mb-2"
            />
            <div class="text-h6 text-disabled">
              Belum ada siswa terdaftar
            </div>
            <div class="text-body-2 text-disabled">
              {{ courseId || batchForm.courseId ? 'Pilih kursus yang memiliki siswa' : 'Pilih kursus dan jenis ujian terlebih dahulu' }}
            </div>
          </div>

          <div
            v-if="loading.batch"
            class="text-center py-8"
          >
            <VProgressCircular
              indeterminate
              color="primary"
            />
            <div class="mt-2 text-body-2 text-disabled">
              Memuat data siswa...
            </div>
          </div>
        </VForm>
      </VCardText>

      <VDivider />

      <VCardActions class="justify-end gap-2">
        <VBtn
          color="secondary"
          variant="outlined"
          @click="handleClose"
        >
          Batal
        </VBtn>
        <VBtn
          :disabled="batchForm.grades.length === 0 || !batchForm.examType"
          :loading="loading.batch"
          @click="handleSubmit"
        >
          Simpan Nilai
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { computed, ref, watch } from 'vue'
import { toast } from "vue-sonner"

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  courseId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['handleClose', 'onSubmitSuccess'])

const store = useVuex()
const refForm = ref()
const bulkScore = ref(0)

// Computed properties
const isOpen = computed({
  get: () => props.open,
  set: () => emit('handleClose'),
})

const batchForm = computed(() => store.state.grade.batchForm)
const loading = computed(() => store.state.grade.loading)
const list_courses = computed(() => store.state.grade.list_courses)
const examTypeOptions = computed(() => store.state.grade.examTypeOptions)

// Methods
const handleSubmit = async () => {
  const { valid } = await refForm.value?.validate()
  if (!valid) return

  if (batchForm.value.grades.length === 0) {
    toast.error('Tidak ada siswa untuk dinilai')

    return
  }

  if (!batchForm.value.examType) {
    toast.error('Pilih jenis ujian terlebih dahulu')

    return
  }

  const success = await store.dispatch('grade/batchCreate')
  if (success) {
    handleClose()
    emit('onSubmitSuccess')
  }
}

const handleClose = () => {
  store.commit('grade/RESET_BATCH_FORM')
  bulkScore.value = 0
  emit('handleClose')
}

const handleCourseChange = async courseId => {
  if (courseId && batchForm.value.examType) {
    await store.dispatch('grade/prepareBatchForm', { 
      courseId,
      examType: batchForm.value.examType,
    })
  }
}

const handleExamTypeChange = async examType => {
  if (examType && (props.courseId || batchForm.value.courseId)) {
    await store.dispatch('grade/prepareBatchForm', { 
      courseId: props.courseId || batchForm.value.courseId,
      examType,
    })
  }
}

const updateGradeScore = (index, score) => {
  const numScore = Number(score) || 0

  store.commit('grade/SET_BATCH_GRADE', { index, key: 'totalScore', value: numScore })
}

const applyBulkScore = () => {
  if (bulkScore.value < 0 || bulkScore.value > 100) {
    toast.error('Nilai harus antara 0-100')

    return
  }
  
  batchForm.value.grades.forEach((_, index) => {
    updateGradeScore(index, bulkScore.value)
  })
}

// Utility functions
const calculateGrade = score => {
  if (!score && score !== 0) return '-'
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'

  return 'F'
}

const getGradeColor = score => {
  if (!score && score !== 0) return 'default'
  if (score >= 90) return 'success'
  if (score >= 80) return 'info'
  if (score >= 70) return 'warning'
  if (score >= 60) return 'error'

  return 'error'
}

const getGradeIcon = score => {
  if (!score && score !== 0) return 'tabler-minus'
  if (score >= 90) return 'tabler-star'
  if (score >= 80) return 'tabler-thumb-up'
  if (score >= 70) return 'tabler-check'
  if (score >= 60) return 'tabler-alert-triangle'

  return 'tabler-x'
}

// Watch for courseId prop changes
watch(() => props.courseId, newCourseId => {
  if (newCourseId) {
    store.commit('grade/SET_BATCH_FORM', { key: 'courseId', value: newCourseId })
    if (batchForm.value.examType) {
      handleCourseChange(newCourseId)
    }
  }
}, { immediate: true })

// Watch for open changes
watch(() => props.open, isOpen => {
  if (isOpen && props.courseId) {
    handleCourseChange(props.courseId)
  }
})
</script>

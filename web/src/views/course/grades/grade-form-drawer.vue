<template>
  <VNavigationDrawer
    v-model="isOpen"
    temporary
    location="end"
    width="400"
  >
    <VCard class="h-100">
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-certificate" />
        {{ is_update ? 'Edit Nilai' : 'Tambah Nilai' }}
        <VSpacer />
        <IconBtn @click="handleClose">
          <VIcon icon="tabler-x" />
        </IconBtn>
      </VCardTitle>

      <VDivider />

      <VCardText>
        <VForm
          ref="refForm"
          @submit.prevent="handleSubmit"
        >
          <VRow>
            <VCol
              v-if="!courseId"
              cols="12"
            >
              <VSelect
                v-model="form.courseId"
                :items="list_courses"
                item-title="name"
                item-value="id"
                label="Kursus *"
                :rules="[requiredValidator]"
                placeholder="Pilih kursus"
                :loading="loading.form"
              />
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="form.userId"
                :items="filteredStudents"
                item-title="fullName"
                item-value="id"
                label="Siswa *"
                :rules="[requiredValidator]"
                placeholder="Pilih siswa"
                :loading="loading.form"
              >
                <template #item="{ props: itemProps, item }">
                  <VListItem v-bind="itemProps">
                    <template #prepend>
                      <VAvatar size="32">
                        <VImg
                          :src="item.raw.avatar || '/images/avatars/avatar-1.png'"
                          :alt="item.raw.name"
                        />
                      </VAvatar>
                    </template>
                    <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
                    <VListItemSubtitle>{{ item.raw.email }}</VListItemSubtitle>
                  </VListItem>
                </template>
              </VSelect>
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="form.examType"
                :items="examTypeOptions"
                item-title="title"
                item-value="value"
                label="Jenis Ujian *"
                :rules="[requiredValidator]"
                placeholder="Pilih jenis ujian"
              />
            </VCol>

            <VCol cols="12">
              <AppTextField
                v-model.number="form.totalScore"
                type="number"
                label="Nilai Total *"
                :rules="[requiredValidator, scoreValidator]"
                placeholder="Masukkan nilai (0-100)"
                min="0"
                max="100"
              />
            </VCol>

            <VCol cols="12">
              <div class="d-flex align-center gap-2">
                <VIcon
                  :icon="getGradeIcon(form.totalScore)"
                  :color="getGradeColor(form.totalScore)"
                />
                <span class="text-h6 font-weight-bold">
                  Grade: {{ calculateGrade(form.totalScore) }}
                </span>
              </div>
            </VCol>
          </VRow>
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
          :loading="loading.form"
          @click="handleSubmit"
        >
          {{ is_update ? 'Perbarui' : 'Simpan' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VNavigationDrawer>
</template>

<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { computed, watch } from 'vue'

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

// Computed properties
const isOpen = computed({
  get: () => props.open,
  set: () => emit('handleClose'),
})

const form = computed(() => store.state.grade.form)
const loading = computed(() => store.state.grade.loading)
const is_update = computed(() => store.state.grade.is_update)
const list_courses = computed(() => store.state.grade.list_courses)
const list_students = computed(() => store.state.grade.list_students)
const examTypeOptions = computed(() => store.state.grade.examTypeOptions)

// Filter students based on selected course
const filteredStudents = computed(() => {
  if (!form.value.courseId && !props.courseId) return list_students.value
  
  const targetCourseId = props.courseId || form.value.courseId
  
  return list_students.value
    .filter(student => {
      if (student.courses && Array.isArray(student.courses)) {
        return student.courses.some(course => course.id === targetCourseId)
      }
      
      return true
    })
    .map(student => ({
      ...student,
      fullName: `${student.name}`,
    }))
})

// Validation rules
const scoreValidator = value => {
  if (value < 0 || value > 100) return 'Nilai harus antara 0-100'
  
  return true
}

// Methods
const handleSubmit = async () => {
  const { valid } = await refForm.value?.validate()
  if (!valid) return

  // Set courseId from prop if available
  if (props.courseId) {
    store.commit('grade/SET_FORM', { key: 'courseId', value: props.courseId })
  }

  let success = false
  if (is_update.value) {
    success = await store.dispatch('grade/update', {
      userId: is_update.value.userId,
      courseId: is_update.value.courseId,
      examType: is_update.value.examType,
    })
  } else {
    success = await store.dispatch('grade/create')
  }

  if (success) {
    handleClose()
    emit('onSubmitSuccess')
  }
}

const handleClose = () => {
  store.commit('grade/RESET_FORM')
  store.commit('grade/SET_IS_UPDATE', false)
  emit('handleClose')
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
    store.commit('grade/SET_FORM', { key: 'courseId', value: newCourseId })
  }
}, { immediate: true })
</script>

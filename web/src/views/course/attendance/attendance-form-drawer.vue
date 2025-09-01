<template>
  <VNavigationDrawer
    v-model="isOpen"
    temporary
    location="end"
    width="400"
  >
    <VCard class="h-100">
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-calendar-check" />
        {{ is_update ? 'Edit Absensi' : 'Tambah Absensi' }}
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
            <VCol cols="12">
              <AppDateTimePicker
                v-model="form.date"
                label="Tanggal *"
                :rules="[requiredValidator]"
                placeholder="Pilih tanggal"
              />
            </VCol>

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
                v-model="form.status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                label="Status Kehadiran *"
                :rules="[requiredValidator]"
                placeholder="Pilih status"
              />
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

const form = computed(() => store.state.attendance.form)
const loading = computed(() => store.state.attendance.loading)
const is_update = computed(() => store.state.attendance.is_update)
const list_courses = computed(() => store.state.attendance.list_courses)
const list_students = computed(() => store.state.attendance.list_students)
const statusOptions = computed(() => store.state.attendance.statusOptions)

// Filter students based on selected course
const filteredStudents = computed(() => {
  if (!form.value.courseId && !props.courseId) return list_students.value
  
  // If we have a courseId prop, filter students for that course
  const targetCourseId = props.courseId || form.value.courseId
  
  return list_students.value
    .filter(student => {
      // If student has courses array, check if target course is included
      if (student.courses && Array.isArray(student.courses)) {
        return student.courses.some(course => course.id === targetCourseId)
      }
      
      return true // If no course filtering info, show all students
    })
    .map(student => ({
      ...student,
      fullName: `${student.name}`,
    }))
})

// Methods
const handleSubmit = async () => {
  const { valid } = await refForm.value?.validate()
  if (!valid) return

  // Set courseId from prop if available
  if (props.courseId) {
    store.commit('attendance/SET_FORM', { key: 'courseId', value: props.courseId })
  }

  let success = false
  if (is_update.value) {
    success = await store.dispatch('attendance/update', {
      userId: is_update.value.userId,
      courseId: is_update.value.courseId,
    })
  } else {
    success = await store.dispatch('attendance/create')
  }

  if (success) {
    handleClose()
    emit('onSubmitSuccess')
  }
}

const handleClose = () => {
  store.commit('attendance/RESET_FORM')
  store.commit('attendance/SET_IS_UPDATE', false)
  emit('handleClose')
}

// Watch for courseId prop changes
watch(() => props.courseId, newCourseId => {
  if (newCourseId) {
    store.commit('attendance/SET_FORM', { key: 'courseId', value: newCourseId })
  }
}, { immediate: true })

// Set today's date as default
watch(() => props.open, isOpen => {
  if (isOpen && !form.value.date) {
    const today = new Date().toISOString().split('T')[0]

    store.commit('attendance/SET_FORM', { key: 'date', value: today })
  }
})
</script>

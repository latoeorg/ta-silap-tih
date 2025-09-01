<template>
  <VDialog
    v-model="isOpen"
    max-width="800"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-users-plus" />
        Absensi Massal
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
              cols="12"
              md="6"
            >
              <AppDateTimePicker
                v-model="batchForm.date"
                label="Tanggal *"
                :rules="[requiredValidator]"
                placeholder="Pilih tanggal"
              />
            </VCol>

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
          </VRow>

          <VDivider class="mb-4" />

          <div v-if="batchForm.attendances.length > 0">
            <div class="d-flex align-center justify-space-between mb-4">
              <h6 class="text-h6">
                Daftar Siswa ({{ batchForm.attendances.length }})
              </h6>
              <div class="d-flex gap-2">
                <VBtn
                  size="small"
                  variant="outlined"
                  @click="setAllStatus('PRESENT')"
                >
                  Semua Hadir
                </VBtn>
                <VBtn
                  size="small"
                  variant="outlined"
                  @click="setAllStatus('ABSENT')"
                >
                  Semua Tidak Hadir
                </VBtn>
              </div>
            </div>

            <VRow>
              <VCol
                v-for="(attendance, index) in batchForm.attendances"
                :key="attendance.userId"
                cols="12"
                md="6"
              >
                <VCard
                  variant="outlined"
                  class="pa-3"
                >
                  <div class="d-flex align-center gap-3">
                    <VAvatar size="40">
                      <VImg
                        :src="attendance.avatar || '/images/avatars/avatar-1.png'"
                        :alt="attendance.userName"
                      />
                    </VAvatar>
                    <div class="flex-grow-1">
                      <div class="text-body-1 font-weight-medium">
                        {{ attendance.userName }}
                      </div>
                      <VSelect
                        :model-value="attendance.status"
                        :items="statusOptions"
                        item-title="title"
                        item-value="value"
                        density="compact"
                        hide-details
                        @update:model-value="updateAttendanceStatus(index, $event)"
                      />
                    </div>
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
              {{ courseId || batchForm.courseId ? 'Pilih kursus yang memiliki siswa' : 'Pilih kursus terlebih dahulu' }}
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
          :disabled="batchForm.attendances.length === 0"
          :loading="loading.batch"
          @click="handleSubmit"
        >
          Simpan Absensi
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { computed, watch } from 'vue'
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

// Computed properties
const isOpen = computed({
  get: () => props.open,
  set: () => emit('handleClose'),
})

const batchForm = computed(() => store.state.attendance.batchForm)
const loading = computed(() => store.state.attendance.loading)
const list_courses = computed(() => store.state.attendance.list_courses)
const statusOptions = computed(() => store.state.attendance.statusOptions)

// Methods
const handleSubmit = async () => {
  const { valid } = await refForm.value?.validate()
  if (!valid) return

  if (batchForm.value.attendances.length === 0) {
    toast.error('Tidak ada siswa untuk diabsen')
    
    return
  }

  const success = await store.dispatch('attendance/batchCreate')
  if (success) {
    handleClose()
    emit('onSubmitSuccess')
  }
}

const handleClose = () => {
  store.commit('attendance/RESET_BATCH_FORM')
  emit('handleClose')
}

const handleCourseChange = async courseId => {
  if (courseId) {
    await store.dispatch('attendance/prepareBatchForm', { courseId })
  }
}

const updateAttendanceStatus = (index, status) => {
  store.commit('attendance/SET_BATCH_ATTENDANCE', { index, key: 'status', value: status })
}

const setAllStatus = status => {
  batchForm.value.attendances.forEach((_, index) => {
    updateAttendanceStatus(index, status)
  })
}

// Watch for courseId prop changes
watch(() => props.courseId, newCourseId => {
  if (newCourseId) {
    store.commit('attendance/SET_BATCH_FORM', { key: 'courseId', value: newCourseId })
    handleCourseChange(newCourseId)
  }
}, { immediate: true })

// Set today's date as default
watch(() => props.open, isOpen => {
  if (isOpen) {
    if (!batchForm.value.date) {
      const today = new Date().toISOString().split('T')[0]

      store.commit('attendance/SET_BATCH_FORM', { key: 'date', value: today })
    }
    
    // If courseId is provided, prepare the form
    if (props.courseId) {
      handleCourseChange(props.courseId)
    }
  }
})
</script>

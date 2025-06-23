# @format

<template>
  <VDialog v-model="dialogModel" max-width="1000px" persistent>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Absensi: {{ courseName }}</span>
        <VBtn variant="text" icon="tabler-x" @click="closeDialog" />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="loading" class="d-flex justify-center py-8">
          <VProgressCircular indeterminate />
        </div>
        <div v-else>
          <!-- Header with date picker -->
          <div class="d-flex flex-wrap justify-space-between align-center mb-4 gap-3">
            <div class="d-flex align-center gap-3">
              <h4 class="text-h6 mb-0">Absensi Siswa</h4>

              <VTextField
                v-model="selectedDate"
                type="date"
                density="comfortable"
                variant="outlined"
                style="min-width: 200px"
                :max="getCurrentDate()"
                @update:model-value="handleDateChange"
              />
            </div>

            <div class="d-flex gap-2">
              <VBtn
                prepend-icon="tabler-file-export"
                color="secondary"
                variant="tonal"
                :loading="exportLoading"
                @click="exportAttendance"
              >
                Ekspor
              </VBtn>
              <VBtn
                prepend-icon="tabler-plus"
                color="primary"
                @click="openCreateAttendanceForm"
              >
                Input Absensi
              </VBtn>
            </div>
          </div>

          <!-- Attendance summary cards -->
          <div class="d-flex flex-wrap gap-4 mb-6">
            <VCard width="240" color="primary" variant="tonal" class="flex-grow-1">
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

            <VCard width="240" color="success" variant="tonal" class="flex-grow-1">
              <VCardItem>
                <template #prepend>
                  <VAvatar rounded="lg" color="success" variant="flat">
                    <VIcon icon="tabler-check" />
                  </VAvatar>
                </template>
                <VCardTitle>{{ presentCount }}</VCardTitle>
                <VCardSubtitle>Hadir</VCardSubtitle>
              </VCardItem>
            </VCard>

            <VCard width="240" color="warning" variant="tonal" class="flex-grow-1">
              <VCardItem>
                <template #prepend>
                  <VAvatar rounded="lg" color="warning" variant="flat">
                    <VIcon icon="tabler-alert-triangle" />
                  </VAvatar>
                </template>
                <VCardTitle>{{ absentCount }}</VCardTitle>
                <VCardSubtitle>Tidak Hadir</VCardSubtitle>
              </VCardItem>
            </VCard>
          </div>

          <!-- Attendance Table -->
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

              <VDataTable
                :headers="attendanceHeaders"
                :items="filteredStudents"
                :search="search"
                density="comfortable"
                :items-per-page="itemsPerPage"
                class="elevation-0"
              >
                <!-- Student Name -->
                <template #item.name="{ item }">
                  <div class="d-flex align-center">
                    <VAvatar size="32" color="primary" variant="tonal" class="me-2">
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
                    :color="getStatusColor(item.attendance?.status)"
                    size="small"
                    label
                  >
                    {{ formatStatus(item.attendance?.status) }}
                  </VChip>
                </template>

                <!-- Actions -->
                <template #item.actions="{ item }">
                  <div class="d-flex gap-2 justify-end">
                    <IconBtn @click="editAttendance(item)">
                      <VIcon icon="tabler-pencil" />
                      <VTooltip activator="parent">Edit Absensi</VTooltip>
                    </IconBtn>
                  </div>
                </template>
              </VDataTable>
            </VCardText>
          </VCard>
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Attendance Form Dialog -->
  <VDialog v-model="attendanceFormDialog" max-width="700px" persistent>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>{{ selectedStudent ? `Absensi: ${selectedStudent.name}` : "Input Absensi Massal" }}</span>
        <VBtn variant="text" icon="tabler-x" @click="closeAttendanceForm" />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <VForm ref="attendanceFormRef">
          <!-- Student Selection (only for batch attendance) -->
          <div v-if="!selectedStudent" class="mb-4">
            <VSelect
              v-model="attendanceForm.selectedStudents"
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
              <VAvatar size="36" color="primary" variant="tonal" class="me-3">
                <VIcon icon="tabler-user" />
              </VAvatar>
              <div>
                <div class="font-weight-medium">{{ selectedStudent.name }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ selectedStudent.email }}
                </div>
              </div>
            </div>
          </div>

          <!-- Date -->
          <VTextField
            v-model="attendanceForm.date"
            type="date"
            label="Tanggal"
            density="comfortable"
            variant="outlined"
            :rules="[(v) => !!v || 'Tanggal wajib diisi']"
            :max="getCurrentDate()"
            class="mb-4"
          />

          <!-- Status -->
          <VSelect
            v-model="attendanceForm.status"
            :items="attendanceStatuses"
            label="Status Kehadiran"
            density="comfortable"
            variant="outlined"
            :rules="[(v) => !!v || 'Status kehadiran wajib dipilih']"
          />
        </VForm>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn variant="text" color="secondary" @click="closeAttendanceForm">
          Batal
        </VBtn>
        <VBtn color="primary" :loading="savingAttendance" @click="saveAttendance">
          {{ editingAttendance ? "Perbarui" : "Simpan" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import axiosInstance from '@/utils/axios'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

// Props and emits
const props = defineProps({
  courseId: { type: String, required: true },
  courseName: { type: String, default: 'Course' },
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['update:open', 'refresh'])

// Dialog state
const dialogModel = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})
// Helper functions
const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}
// UI state
const loading = ref(false)
const exportLoading = ref(false)
const search = ref('')
const selectedDate = ref(getCurrentDate())
const itemsPerPage = ref(10)

// Attendance form state
const attendanceFormDialog = ref(false)
const attendanceFormRef = ref(null)
const savingAttendance = ref(false)
const selectedStudent = ref(null)
const editingAttendance = ref(false)

// Data collections
const courseStudents = ref([])
const attendances = ref([])
const attendanceStatuses = [
  { title: 'Hadir', value: 'PRESENT' },
  { title: 'Tidak Hadir', value: 'ABSENT' },
  { title: 'Izin', value: 'EXCUSED' },
  { title: 'Sakit', value: 'SICK' },
]

// Attendance form
const attendanceForm = ref({
  date: getCurrentDate(),
  status: null,
  selectedStudents: [],
})

// Table headers
const attendanceHeaders = [
  { title: 'Siswa', key: 'name', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Aksi', key: 'actions', align: 'end', sortable: false },
]

// Computed values
const presentCount = computed(() => {
  return attendances.value.filter(a => a.status === 'PRESENT').length
})

const absentCount = computed(() => {
  return attendances.value.filter(a => ['ABSENT', 'EXCUSED', 'SICK'].includes(a.status)).length
})

const filteredStudents = computed(() => {
  return courseStudents.value.map(student => {
    const attendance = attendances.value.find(
      a => a.userId === student.id
    )
    return {
      ...student,
      attendance: attendance || null,
    }
  })
})



const formatStatus = (status) => {
  const statusMap = {
    'PRESENT': 'Hadir',
    'ABSENT': 'Tidak Hadir',
    'EXCUSED': 'Izin',
    'SICK': 'Sakit',
  }
  return statusMap[status] || 'Belum Diisi'
}

const getStatusColor = (status) => {
  const colorMap = {
    'PRESENT': 'success',
    'ABSENT': 'error',
    'EXCUSED': 'warning',
    'SICK': 'info',
  }
  return colorMap[status] || 'grey'
}

// API operations with unified error handling
const apiOperation = async (method, url, data = null, params = null, successMsg = '') => {
  try {
    const config = { method, url }
    if (data) config.data = data
    if (params) config.params = params

    const result = await axiosInstance(config)
    if (successMsg) toast.success(successMsg)
    return result.data
  } catch (error) {
    const errorMsg = error.response?.data?.message || `Failed to ${method.toLowerCase()} resource`
    toast.error(errorMsg)
    throw error
  }
}

// Load data
const loadData = async () => {
  loading.value = true
  try {
    // Fetch course with its students
    const result = await apiOperation('GET', `/course/${props.courseId}`, null, { include: 'students' })
    courseStudents.value = result.data?.students || []

    // Load attendances for the selected date
    await loadAttendances()
  } catch (error) {
    console.error('Error loading course data:', error)
  } finally {
    loading.value = false
  }
}

const loadAttendances = async () => {
  try {
    const result = await apiOperation('GET', '/attendance', null, {
      courseId: props.courseId,
      date: selectedDate.value,
    })
    attendances.value = result.data || []
  } catch (error) {
    console.error('Error loading attendances:', error)
  }
}

// Form management
const resetAttendanceForm = () => {
  attendanceForm.value = {
    date: selectedDate.value,
    status: null,
    selectedStudents: [],
  }
  selectedStudent.value = null
  editingAttendance.value = false
  if (attendanceFormRef.value) {
    attendanceFormRef.value.resetValidation()
  }
}

const openCreateAttendanceForm = () => {
  resetAttendanceForm()
  attendanceFormDialog.value = true
}

const closeAttendanceForm = () => {
  attendanceFormDialog.value = false
  resetAttendanceForm()
}

const editAttendance = (student) => {
  selectedStudent.value = student
  editingAttendance.value = true

  const existingAttendance = student.attendance
  if (existingAttendance) {
    attendanceForm.value = {
      date: selectedDate.value,
      status: existingAttendance.status,
      selectedStudents: [],
    }
  } else {
    resetAttendanceForm()
  }

  attendanceFormDialog.value = true
}

const saveAttendance = async () => {
  if (!attendanceFormRef.value) return

  const { valid } = await attendanceFormRef.value.validate()
  if (!valid) return

  savingAttendance.value = true

  try {
    if (editingAttendance.value && selectedStudent.value) {
      // Update existing attendance
      await apiOperation(
        'PUT',
        `/attendance/${selectedStudent.value.id}/${props.courseId}`,
        {
          date: attendanceForm.value.date,
          status: attendanceForm.value.status,
        },
        null,
        'Attendance updated successfully'
      )
    } else if (selectedStudent.value) {
      // Create new attendance for single student
      await apiOperation(
        'POST',
        '/attendance',
        {
          userId: selectedStudent.value.id,
          courseId: props.courseId,
          date: attendanceForm.value.date,
          status: attendanceForm.value.status,
        },
        null,
        'Attendance created successfully'
      )
    } else {
      // Batch create/update for multiple students
      await apiOperation(
        'POST',
        '/attendance/batch',
        {
          attendances: attendanceForm.value.selectedStudents.map(studentId => ({
            userId: studentId,
            courseId: props.courseId,
            date: attendanceForm.value.date,
            status: attendanceForm.value.status,
          })),
        },
        null,
        'Attendances created successfully'
      )
    }

    closeAttendanceForm()
    await loadAttendances()
    emit('refresh')
  } catch (error) {
    console.error('Error saving attendance:', error)
  } finally {
    savingAttendance.value = false
  }
}

const exportAttendance = async () => {
  exportLoading.value = true
  try {
    await apiOperation(
      'GET',
      `/export/attendance/${props.courseId}`,
      null,
      { date: selectedDate.value },
      'Attendance exported successfully'
    )
    toast.success('Export completed. Check your downloads folder.')
  } catch (error) {
    console.error('Error exporting attendance:', error)
  } finally {
    exportLoading.value = false
  }
}

const closeDialog = () => {
  emit('update:open', false)
}

const handleDateChange = async () => {
  await loadAttendances()
}

// Watch for dialog open
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      loadData()
    }
  }
)
</script>

<style scoped>
.max-width-120 {
  max-width: 120px;
}

.max-width-320 {
  max-width: 320px;
}
</style>

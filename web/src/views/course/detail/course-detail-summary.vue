<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardTitle>
            <VIcon
              icon="tabler-book"
              class="me-2"
            />
            Informasi Kursus
          </VCardTitle>
          
          <VDivider />
          
          <VCardText>
            <div
              v-if="loading"
              class="d-flex justify-center py-8"
            >
              <VProgressCircular indeterminate />
            </div>
            
            <div
              v-else-if="course"
              class="pa-2"
            >
              <VList density="compact">
                <VListItem>
                  <template #prepend>
                    <VIcon
                      icon="tabler-signature"
                      class="me-3"
                      color="primary"
                    />
                  </template>
                  <VListItemTitle class="font-weight-medium">
                    Nama Kursus
                  </VListItemTitle>
                  <VListItemSubtitle class="text-high-emphasis">
                    {{ course.name }}
                  </VListItemSubtitle>
                </VListItem>
                
                <VDivider class="my-2" />
                
                <VListItem>
                  <template #prepend>
                    <VIcon
                      icon="tabler-book-2"
                      class="me-3"
                      color="info"
                    />
                  </template>
                  <VListItemTitle class="font-weight-medium">
                    Mata Pelajaran
                  </VListItemTitle>
                  <VListItemSubtitle class="text-high-emphasis">
                    {{ course.subject?.name }}
                  </VListItemSubtitle>
                </VListItem>
                
                <VDivider class="my-2" />
                
                <VListItem>
                  <template #prepend>
                    <VIcon
                      icon="tabler-user"
                      class="me-3"
                      color="success"
                    />
                  </template>
                  <VListItemTitle class="font-weight-medium">
                    Guru Pengajar
                  </VListItemTitle>
                  <VListItemSubtitle class="text-high-emphasis">
                    {{ course.teacher?.name }}
                  </VListItemSubtitle>
                </VListItem>
                
                <VDivider class="my-2" />
                
                <VListItem>
                  <template #prepend>
                    <VIcon
                      icon="tabler-calendar"
                      class="me-3"
                      color="warning"
                    />
                  </template>
                  <VListItemTitle class="font-weight-medium">
                    Tanggal Dibuat
                  </VListItemTitle>
                  <VListItemSubtitle class="text-high-emphasis">
                    {{ formatDate(course.createdAt) }}
                  </VListItemSubtitle>
                </VListItem>
                
                <VDivider class="my-2" />
                
                <VListItem>
                  <template #prepend>
                    <VIcon
                      icon="tabler-edit"
                      class="me-3"
                      color="secondary"
                    />
                  </template>
                  <VListItemTitle class="font-weight-medium">
                    Terakhir Diperbarui
                  </VListItemTitle>
                  <VListItemSubtitle class="text-high-emphasis">
                    {{ formatDate(course.updatedAt) }}
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </div>
            
            <div
              v-else
              class="text-center py-8"
            >
              <VIcon
                icon="tabler-info-circle"
                size="48"
                color="warning"
                class="mb-4"
              />
              <p class="text-body-1 text-medium-emphasis">
                Data kursus tidak ditemukan
              </p>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      
      <VCol
        cols="12"
        md="4"
      >
        <VCard class="mb-6">
          <VCardTitle>
            <VIcon
              icon="tabler-chart-pie"
              class="me-2"
            />
            Statistik Kursus
          </VCardTitle>
          
          <VDivider />
          
          <VCardText>
            <div
              v-if="loading"
              class="d-flex justify-center py-4"
            >
              <VProgressCircular
                indeterminate
                size="small"
              />
            </div>
            
            <div v-else>
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="text-body-2 text-medium-emphasis">
                  Total Siswa
                </div>
                <VChip
                  color="primary"
                  variant="tonal"
                  size="small"
                >
                  {{ statistics.totalStudents }}
                </VChip>
              </div>
              
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="text-body-2 text-medium-emphasis">
                  Total Absensi
                </div>
                <VChip
                  color="info"
                  variant="tonal"
                  size="small"
                >
                  {{ statistics.totalAttendance }}
                </VChip>
              </div>
              
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="text-body-2 text-medium-emphasis">
                  Total Nilai
                </div>
                <VChip
                  color="success"
                  variant="tonal"
                  size="small"
                >
                  {{ statistics.totalGrades }}
                </VChip>
              </div>
              
              <div class="d-flex justify-space-between align-center">
                <div class="text-body-2 text-medium-emphasis">
                  Rata-rata Kehadiran
                </div>
                <VChip
                  :color="getAttendanceRateColor(statistics.attendanceRate)"
                  variant="tonal"
                  size="small"
                >
                  {{ statistics.attendanceRate }}%
                </VChip>
              </div>
            </div>
          </VCardText>
        </VCard>
        
        <VCard>
          <VCardTitle>
            <VIcon
              icon="tabler-clock"
              class="me-2"
            />
            Aktivitas Terbaru
          </VCardTitle>
          
          <VDivider />
          
          <VCardText>
            <div
              v-if="loading"
              class="d-flex justify-center py-4"
            >
              <VProgressCircular
                indeterminate
                size="small"
              />
            </div>
            
            <div v-else>
              <VTimeline
                density="compact"
                align="start"
              >
                <VTimelineItem
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :dot-color="activity.color"
                  size="small"
                >
                  <template #opposite>
                    <span class="text-caption text-medium-emphasis">
                      {{ formatRelativeTime(activity.date) }}
                    </span>
                  </template>
                  
                  <div class="text-body-2">
                    {{ activity.title }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ activity.description }}
                  </div>
                </VTimelineItem>
              </VTimeline>
              
              <div
                v-if="recentActivities.length === 0"
                class="text-center py-4"
              >
                <VIcon
                  icon="tabler-clock-off"
                  size="32"
                  color="grey"
                  class="mb-2"
                />
                <p class="text-body-2 text-medium-emphasis">
                  Belum ada aktivitas
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { formatDate, formatRelativeTime } from '@/utils/utils'
import { onMounted, ref } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  courseId: {
    type: String,
    required: true,
  },
})

const store = useVuex()

// Statistics
const statistics = ref({
  totalStudents: 0,
  totalAttendance: 0,
  totalGrades: 0,
  attendanceRate: 0,
})

// Recent activities
const recentActivities = ref([])

// Methods
const getAttendanceRateColor = rate => {
  if (rate >= 80) return 'success'
  if (rate >= 60) return 'warning'
  
  return 'error'
}

const fetchStatistics = async () => {
  try {
    // Fetch students count
    await store.dispatch('user/getReports', {
      role: 'STUDENT',
      course_id: props.courseId,
    })
    statistics.value.totalStudents = store.state.user.reports.length

    // Fetch attendance count
    await store.dispatch('attendance/getReports', {
      course_id: props.courseId,
    })

    const attendanceRecords = store.state.attendance.reports

    statistics.value.totalAttendance = attendanceRecords.length
    
    // Calculate attendance rate
    const presentCount = attendanceRecords.filter(record => record.status === 'PRESENT').length

    statistics.value.attendanceRate = attendanceRecords.length > 0 
      ? Math.round((presentCount / attendanceRecords.length) * 100)
      : 0

    // Fetch grades count
    await store.dispatch('grade/getReports', {
      course_id: props.courseId,
    })
    statistics.value.totalGrades = store.state.grade.reports.length

    // Generate recent activities
    generateRecentActivities(attendanceRecords, store.state.grade.reports)
  } catch (error) {
    console.error('Error fetching course statistics:', error)
  }
}

const generateRecentActivities = (attendanceRecords, gradeRecords) => {
  const activities = []

  // Add recent attendance activities
  const recentAttendance = attendanceRecords
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  recentAttendance.forEach(record => {
    activities.push({
      id: `attendance-${record.id}`,
      title: 'Absensi Dicatat',
      description: `${record.student?.name || 'Siswa'} - ${getStatusText(record.status)}`,
      date: record.createdAt || record.date,
      color: getStatusColor(record.status),
    })
  })

  // Add recent grade activities
  const recentGrades = gradeRecords
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  recentGrades.forEach(record => {
    activities.push({
      id: `grade-${record.id}`,
      title: 'Nilai Diinput',
      description: `${record.student?.name || 'Siswa'} - ${getExamTypeText(record.examType)} (${record.grade})`,
      date: record.createdAt,
      color: getGradeColor(record.grade),
    })
  })

  // Sort all activities by date
  recentActivities.value = activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
}

const getStatusText = status => {
  switch (status) {
  case 'PRESENT': return 'Hadir'
  case 'ABSENT': return 'Tidak Hadir'
  case 'EXCUSED': return 'Izin'
  case 'SICK': return 'Sakit'
  default: return status
  }
}

const getStatusColor = status => {
  switch (status) {
  case 'PRESENT': return 'success'
  case 'ABSENT': return 'error'
  case 'EXCUSED': return 'warning'
  case 'SICK': return 'info'
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

const getGradeColor = grade => {
  if (['A', 'A-'].includes(grade)) return 'success'
  if (['B+', 'B', 'B-'].includes(grade)) return 'info'
  if (['C+', 'C', 'C-'].includes(grade)) return 'warning'
  
  return 'error'
}

// Watchers
watch(() => props.courseId, newCourseId => {
  if (newCourseId) {
    fetchStatistics()
  }
})

onMounted(() => {
  if (props.courseId) {
    fetchStatistics()
  }
})
</script>

<style scoped>
.v-timeline-item {
  padding-block-end: 8px;
}
</style>

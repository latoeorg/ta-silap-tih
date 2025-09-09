<template>
  <VCard class="logistics-card-statistics cursor-pointer">
    <VCardText>
      <div class="d-flex align-center gap-x-4 mb-2">
        <VAvatar
          variant="tonal"
          size="60"
          color="primary"
          rounded
        >
          <VIcon
            icon="tabler-book"
            size="38"
          />
        </VAvatar>
        <div class="flex-grow-1">
          <h5 class="text-h5 font-weight-medium">
            {{ report?.name || "Loading..." }}
          </h5>
          <div class="text-disabled">
            {{ report?.subject?.name || "" }}
            <span v-if="report?.teacher?.name">
              • Pengajar: {{ report.teacher.name }}
            </span>
          </div>
          <div class="text-disabled text-caption">
            Terakhir diperbarui: {{ formatCalendar(report?.updatedAt) }}
          </div>
        </div>
        <div v-if="!loading">
          <VChip
            color="success"
            variant="tonal"
            size="small"
          >
            <VIcon
              icon="tabler-check"
              size="16"
              class="me-1"
            />
            Aktif
          </VChip>
        </div>
      </div>
    </VCardText>
  </VCard>

  <CourseDetailNavigation />

  <div class="mt-5">
    <div v-if="activeTab == CourseDetailTab.summary">
      <CourseDetailSummary
        :course="report"
        :loading="loading"
        :course-id="courseId"
      />
    </div>
    <div v-else-if="activeTab == CourseDetailTab.students && canViewStudents">
      <UserDataTable
        title="Daftar Siswa"
        :course-id="courseId"
        hide-add-button
        hide-actions
      />
    </div>
    <div v-else-if="activeTab == CourseDetailTab.attendance">
      <AttendanceEnhancedTable
        title="Tabel Absensi Siswa"
        :course-id="courseId"
      />
    </div>
    <div v-else-if="activeTab == CourseDetailTab.grades">
      <GradeEnhancedTable
        title="Tabel Nilai Siswa"
        :course-id="courseId"
      />
    </div>
    <div
      v-else-if="
        activeTab == CourseDetailTab.assessmentWeight && canViewAssessmentWeight
      "
    >
      <AssessmentWeightDataTable :course-id="courseId" />
    </div>
    <!-- Unauthorized access message -->
    <div
      v-else-if="
        activeTab == CourseDetailTab.students ||
          activeTab == CourseDetailTab.assessmentWeight
      "
    >
      <VCard>
        <VCardText class="text-center py-8">
          <VIcon
            size="48"
            color="warning"
            class="mb-4"
          >
            tabler-shield-x
          </VIcon>
          <h4 class="text-h4 mb-2">
            Akses Terbatas
          </h4>
          <p class="text-body-1 text-medium-emphasis">
            Anda tidak memiliki izin untuk mengakses bagian ini.
          </p>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { formatCalendar } from "@/utils/utils"
import AssessmentWeightDataTable from "@/views/assessment-weight/assessment-weight-data-table.vue"
import AttendanceEnhancedTable from "@/views/course/attendance/attendance-enhanced-table.vue"
import { CourseDetailTab } from "@/views/course/detail/course-detail-navigation"
import CourseDetailNavigation from "@/views/course/detail/course-detail-navigation.vue"
import CourseDetailSummary from "@/views/course/detail/course-detail-summary.vue"
import GradeEnhancedTable from "@/views/course/grades/grade-enhanced-table.vue"
import UserDataTable from "@/views/user/user-data-table.vue"

const store = useVuex()
const route = useRoute()
const courseId = ref(route.params.id)

const activeTab = computed(() => route.query.tab || CourseDetailTab.summary)

const loading = computed(() => store.state.course.loading.report)
const report = computed(() => store.state.course.course)
const user = computed(() => store.state.app.user)

// Role-based access control
const canViewStudents = computed(() => {
  return user.value?.role === "TEACHER" || user.value?.role === "ADMIN"
})

const canViewAssessmentWeight = computed(() => {
  return user.value?.role === "TEACHER" || user.value?.role === "ADMIN"
})

const refetch = () => store.dispatch("course/getCourse", courseId.value)

onMounted(() => refetch())
</script>

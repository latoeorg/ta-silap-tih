<template>
  <VRow v-if="loading">
    <VCol
      v-for="i in 4"
      :key="i"
      cols="12"
      sm="6"
      md="3"
    >
      <VSkeletonLoader type="card-avatar" />
    </VCol>
    <VCol cols="12">
      <VSkeletonLoader type="list-item-avatar-three-line" />
    </VCol>
  </VRow>

  <VRow v-else>
    <VCol
      v-for="stat in summaryStats"
      :key="stat.title"
      cols="12"
      sm="6"
      md="3"
    >
      <VCard>
        <VCardText>
          <div class="d-flex align-center gap-x-4">
            <VAvatar
              :color="stat.color"
              variant="tonal"
              rounded
              size="40"
            >
              <VIcon
                :icon="stat.icon"
                size="24"
              />
            </VAvatar>
            <div>
              <h6 class="text-h6">
                {{ stat.value }}
              </h6>
              <span class="text-sm text-disabled">{{ stat.title }}</span>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="12"
    >
      <VCard title="Daftar Guru Pengajar">
        <VCardText>
          <VList class="card-list">
            <VListItem
              v-for="teacher in uniqueTeachers"
              :key="teacher.id"
            >
              <template #prepend>
                <VAvatar
                  color="primary"
                  variant="tonal"
                  size="40"
                >
                  <VIcon icon="tabler-user" />
                </VAvatar>
              </template>
              <VListItemTitle class="font-weight-medium">
                {{ teacher.name }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ teacher.email }}
              </VListItemSubtitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { computed } from 'vue'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

// Define the props this component accepts
const props = defineProps({
  report: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// All the logic is now self-contained and uses the 'report' prop
const summaryStats = computed(() => {
  if (!props.report || !props.report.courses) {
    return []
  }

  const courses = props.report.courses
  const teacherIds = new Set(courses.map(c => c.teacher.id))
  const studentIds = new Set(courses.flatMap(c => c.students.map(s => s.id)))
  const allGrades = courses.flatMap(c => c.grades)
  const totalScore = allGrades.reduce((sum, grade) => sum + grade.totalScore, 0)
  const average = allGrades.length > 0 ? (totalScore / allGrades.length).toFixed(2) : 'N/A'

  return [
    { title: 'Total Kelas', value: courses.length, icon: 'tabler-book', color: 'primary' },
    { title: 'Total Guru', value: teacherIds.size, icon: 'tabler-user', color: 'success' },
    { title: 'Total Siswa', value: studentIds.size, icon: 'tabler-users', color: 'warning' },
    { title: 'Rata-rata Nilai', value: average, icon: 'tabler-chart-bar', color: 'info' },
  ]
})

const uniqueTeachers = computed(() => {
  if (!props.report || !props.report.courses) {
    return []
  }
  const teacherMap = new Map()

  props.report.courses.forEach(course => {
    if (course.teacher) {
      teacherMap.set(course.teacher.id, course.teacher)
    }
  })
  
  return Array.from(teacherMap.values())
})
</script>

<style lang="scss" scoped>
.card-list .v-list-item {
  &:not(:last-child) {
    border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  }
}
</style>

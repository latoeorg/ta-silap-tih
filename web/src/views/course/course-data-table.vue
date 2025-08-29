<template>
  <div class="course-management">
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Pengurusan Kursus
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Kelola kursus, pengajar, dan siswa dalam satu tempat
        </p>
      </div>
      <VBtn 
        color="primary"
        size="large"
        elevation="2"
        @click="handleDrawerForm(true)"
      >
        <VIcon
          start
          icon="tabler-plus"
        />
        Tambah Kursus Baru
      </VBtn>
    </div>

    <!-- Stats Cards -->
    <VRow class="mb-6">
      <VCol
        cols="12"
        md="3"
      >
        <VCard class="h-100">
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar 
                color="primary" 
                variant="tonal" 
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-book" />
              </VAvatar>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ reports.length }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total Kursus
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VCard class="h-100">
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar 
                color="success" 
                variant="tonal" 
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-users" />
              </VAvatar>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ totalStudents }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total Siswa
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VCard class="h-100">
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar 
                color="warning" 
                variant="tonal" 
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-school" />
              </VAvatar>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ uniqueTeachers }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Pengajar Aktif
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VCard class="h-100">
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar 
                color="info" 
                variant="tonal" 
                size="48"
                class="me-4"
              >
                <VIcon icon="tabler-clipboard-check" />
              </VAvatar>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ totalGrades }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total Penilaian
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Main Content Card -->
    <VCard
      elevation="2"
      class="overflow-hidden"
    >
      <!-- Toolbar -->
      <VToolbar
        flat
        color="surface"
      >
        <VToolbarTitle class="text-h6 font-weight-semibold">
          Daftar Kursus
        </VToolbarTitle>
        <VSpacer />
        
        <!-- Search and Filters -->
        <div class="d-flex align-center gap-4">
          <VTextField
            v-model="table_options.search"
            density="compact"
            variant="outlined"
            placeholder="Cari kursus, pengajar, atau mata pelajaran..."
            prepend-inner-icon="tabler-search"
            hide-details
            style="min-inline-size: 320px;"
            clearable
          />
          
          <VBtn
            variant="outlined"
            icon="tabler-filter"
            size="small"
          />
          
          <VBtn
            variant="outlined"
            icon="tabler-refresh"
            size="small"
            @click="refetch"
          />
        </div>
      </VToolbar>

      <VDivider />

      <!-- Enhanced Data Table -->
      <VDataTableServer
        v-model:options="table_options"
        v-model:items-per-page="table_options.page_size"
        v-model:page="table_options.page"
        :items-length="table_options.total_items"
        :search="table_options.search"
        :headers="enhancedHeaders"
        :items="reports"
        :loading="loading"
        hover
        class="course-table"
        @update:options="refetch"
      >
        <!-- Course Info -->
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2">
            <VAvatar 
              :color="getSubjectColor(item.subject.name)"
              variant="tonal"
              size="40"
              class="me-3"
            >
              <VIcon :icon="getSubjectIcon(item.subject.name)" />
            </VAvatar>
            <div>
              <div class="text-subtitle-2 font-weight-semibold">
                {{ item.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.subject.name }}
              </div>
            </div>
          </div>
        </template>

        <!-- Teacher Info -->
        <template #item.teacher="{ item }">
          <div class="d-flex align-center">
            <VAvatar 
              color="primary"
              size="32"
              class="me-2"
            >
              <span class="text-caption font-weight-bold">
                {{ getInitials(item.teacher.name) }}
              </span>
            </VAvatar>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ item.teacher.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.teacher.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- Statistics -->
        <template #item.stats="{ item }">
          <div class="d-flex align-center gap-4">
            <VTooltip text="Jumlah Siswa">
              <template #activator="{ tooltipProps }">
                <VChip 
                  v-bind="tooltipProps"
                  color="success" 
                  variant="tonal" 
                  size="small"
                >
                  <VIcon
                    start
                    icon="tabler-users"
                    size="16"
                  />
                  {{ item._count.students }}
                </VChip>
              </template>
            </VTooltip>
            
            <VTooltip text="Penilaian">
              <template #activator="{ tooltipProps }">
                <VChip 
                  v-bind="tooltipProps"
                  color="info" 
                  variant="tonal" 
                  size="small"
                >
                  <VIcon
                    start
                    icon="tabler-clipboard-check"
                    size="16"
                  />
                  {{ item._count.grades }}
                </VChip>
              </template>
            </VTooltip>
            
            <VTooltip text="Kehadiran">
              <template #activator="{ tooltipProps }">
                <VChip 
                  v-bind="tooltipProps"
                  color="warning" 
                  variant="tonal" 
                  size="small"
                >
                  <VIcon
                    start
                    icon="tabler-calendar-check"
                    size="16"
                  />
                  {{ item._count.attendances }}
                </VChip>
              </template>
            </VTooltip>
          </div>
        </template>

        <!-- Created Date -->
        <template #item.createdAt="{ item }">
          <div class="text-body-2">
            {{ formatDate(item.createdAt) }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ formatTimeAgo(item.createdAt) }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <VTooltip text="Lihat Detail">
              <template #activator="{ tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  icon="tabler-eye"
                  variant="text"
                  size="small"
                  color="info"
                  @click="handleView(item)"
                />
              </template>
            </VTooltip>
            
            <VTooltip text="Edit Kursus">
              <template #activator="{ tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  icon="tabler-edit"
                  variant="text"
                  size="small"
                  color="primary"
                  @click="handleUpdate(item.id)"
                />
              </template>
            </VTooltip>
            
            <VTooltip text="Hapus Kursus">
              <template #activator="{ tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  icon="tabler-trash"
                  variant="text"
                  size="small"
                  color="error"
                  @click="handleDelete(item.id)"
                />
              </template>
            </VTooltip>
          </div>
        </template>

        <!-- Loading -->
        <template #loading>
          <VSkeletonLoader
            v-for="i in 5" 
            :key="i"
            type="table-row"
          />
        </template>

        <!-- No Data -->
        <template #no-data>
          <div class="text-center pa-8">
            <VIcon 
              icon="tabler-folder-x" 
              size="64" 
              color="disabled" 
              class="mb-4"
            />
            <div class="text-h6 mb-2">
              Tidak ada kursus
            </div>
            <div class="text-body-2 text-medium-emphasis mb-4">
              Belum ada kursus yang terdaftar. Mulai dengan menambah kursus baru.
            </div>
            <VBtn 
              color="primary"
              variant="tonal"
              @click="handleDrawerForm(true)"
            >
              <VIcon
                start
                icon="tabler-plus"
              />
              Tambah Kursus
            </VBtn>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- Course Form Drawer (commented as in original) -->
    
    <CourseFormDrawer
      :open="drawerForm"
      :subject-id="subjectId"
      @handle-close="handleDrawerForm"
    />
  </div>
</template>

<script setup>
import CourseFormDrawer from '@/views/course/couse-form-drawer.vue'

const props = defineProps({
  subjectId: {
    type: String,
    required: true,
  },
})

// Enhanced headers with better structure
const enhancedHeaders = ref([
  { 
    title: 'Kursus & Mata Pelajaran', 
    key: 'name',
    width: '25%',
    sortable: true,
  },
  { 
    title: 'Pengajar', 
    key: 'teacher',
    width: '25%',
    sortable: false,
  },
  { 
    title: 'Statistik', 
    key: 'stats',
    width: '25%',
    sortable: false,
    align: 'center',
  },
  { 
    title: 'Dibuat', 
    key: 'createdAt',
    width: '15%',
    sortable: true,
  },
  { 
    title: 'Tindakan', 
    key: 'actions', 
    width: '10%',
    sortable: false,
    align: 'end',
  },
])

const drawerForm = ref(false)
const store = useVuex()

// Computed properties for statistics
const totalStudents = computed(() => 
  reports.value.reduce((sum, course) => sum + course._count.students, 0),
)

const totalGrades = computed(() => 
  reports.value.reduce((sum, course) => sum + course._count.grades, 0),
)

const uniqueTeachers = computed(() => {
  const teacherIds = new Set(reports.value.map(course => course.teacherId))
  
  return teacherIds.size
})

// Utility functions
const getSubjectColor = subjectName => {
  const colors = {
    'Mathematics': 'blue',
    'Physics': 'green',
    'Chemistry': 'orange',
    'Biology': 'teal',
    'English': 'purple',
    'Indonesian': 'red',
  }

  
  return colors[subjectName] || 'grey'
}

const getSubjectIcon = subjectName => {
  const icons = {
    'Mathematics': 'tabler-math-symbols',
    'Physics': 'tabler-atom',
    'Chemistry': 'tabler-flask',
    'Biology': 'tabler-dna',
    'English': 'tabler-language',
    'Indonesian': 'tabler-book',
  }

  
  return icons[subjectName] || 'tabler-book'
}

const getInitials = name => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatTimeAgo = dateString => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hari ini'
  if (diffInDays === 1) return 'Kemarin'
  if (diffInDays < 7) return `${diffInDays} hari lalu`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`
  
  return `${Math.floor(diffInDays / 30)} bulan lalu`
}

// Event handlers
const handleDrawerForm = value => {
  if(value) store.dispatch('course/fetchBeforeForm')
  drawerForm.value = value
}

const handleView = item => {
  // Navigate to course detail page or open detail dialog
  console.log('View course:', item)
}

const handleUpdate = async id => {
  await store.dispatch('course/setFormUpdate', id)
  handleDrawerForm(true)
}

const handleDelete = async id => {
  const confirm = await SwalDelete()
  if(confirm) await store.dispatch("course/delete", id).then(res => {
    if(res) refetch()
  })
}

// Computed properties
const loading = computed(() => store.state.course.loading.reports)
const reports = computed(() => store.state.course.reports)

const table_options = computed({
  get: () => store.state.course.table_options,
  set: value => store.commit('course/SET_TABLE_OPTIONS', value),
})

const refetch = () => store.dispatch('course/getReports', {
  ...(props.subjectId ? { subjectId: props.subjectId } : {}),
})

onMounted(() => refetch())
</script>



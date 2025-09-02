<template>
  <div class="course-table-wrapper">
    <VCard class="course-table-card">
      <VCardTitle class="card-header">
        <div class="header-content">
          <div class="header-info">
            <VIcon 
              icon="tabler-school" 
              size="24" 
              color="primary" 
              class="me-4"
            />
            <div>
              <h2 class="header-title">
                Manajemen Penilaian
              </h2>
              <p class="header-subtitle text-body-1">
                Kelola Penilaian, subjek, dan pengajar
              </p>
            </div>
          </div>
          
          <div class="header-stats">
            <VChip
              variant="tonal"
              color="primary"
              prepend-icon="tabler-book"
            >
              {{ courses.length }} Penilaian
            </VChip>
          </div>
        </div>
      </VCardTitle>

      <VDivider />

      <VCardText class="search-section">
        <div class="search-controls">
          <div class="search-field">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Cari berdasarkan nama Penilaian, subjek, atau pengajar..."
              prepend-inner-icon="tabler-search"
              clearable
              class="search-input"
            />
          </div>

          <div class="action-buttons">
            <VBtn
              color="primary"
              prepend-icon="tabler-plus"
              @click="handleDrawerForm(true)"
            >
              Tambah Penilaian
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="table-section">
        <VDataTableServer
          v-model:options="table_options"
          v-model:items-per-page="table_options.page_size"
          v-model:page="table_options.page"
          :items-length="table_options.total_items"
          :search="table_options.search"
          :headers="headers"
          :items="courses"
          :loading="loading"
          class="course-data-table"
          hover
          @click:row="onRowClick"
          @update:options="refetch"
        >
          <!-- Course Name Column -->
          <template #item.name="{ item }">
            <div class="course-name-cell">
              <div class="course-name-content">
                <h4 class="course-title">
                  {{ item.name }}
                </h4>
                <div class="course-meta">
                  <VIcon 
                    icon="tabler-calendar" 
                    size="12" 
                    class="me-1"
                  />
                  <span class="text-caption">
                    Dibuat {{ formatDate(item.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- Subject Column -->
          <template #item.subject="{ item }">
            <div class="subject-cell">
              <VChip
                v-if="item.subject"
                variant="tonal"
                color="info"
                size="small"
                prepend-icon="tabler-book-2"
              >
                {{ item.subject.name }}
              </VChip>
              <span
                v-else
                class="text-disabled"
              >-</span>
            </div>
          </template>

          <!-- Teacher Column -->
          <template #item.teacher="{ item }">
            <div class="teacher-cell">
              <CardUser
                v-if="item.teacher"
                :user="item.teacher"
                show-email
              />
              <div
                v-else
                class="no-teacher"
              >
                <VIcon 
                  icon="tabler-user-x" 
                  size="16" 
                  color="disabled"
                />
                <span class="text-disabled ms-1">Belum ditentukan</span>
              </div>
            </div>
          </template>

          <!-- Class Group Column -->
          <template #item.classGroup="{ item }">
            <div class="class-group-cell">
              <VChip
                v-if="item.classGroup"
                variant="tonal"
                color="success"
                size="small"
                prepend-icon="tabler-users"
              >
                {{ item.classGroup.name }}
              </VChip>
              <span
                v-else
                class="text-disabled"
              >-</span>
            </div>
          </template>

          <!-- Statistics Column -->
          <template #item.stats="{ item }">
            <div class="stats-cell">
              <div class="stats-grid">
                <VTooltip text="Jumlah Siswa">
                  <template #activator="{ props }">
                    <div
                      v-bind="props"
                      class="stat-item"
                    >
                      <VIcon
                        icon="tabler-users"
                        size="14"
                        color="primary"
                      />
                      <span class="stat-value">{{ item._count?.students || 0 }}</span>
                    </div>
                  </template>
                </VTooltip>
                
                <VTooltip text="Total Penilaian">
                  <template #activator="{ props }">
                    <div
                      v-bind="props"
                      class="stat-item"
                    >
                      <VIcon
                        icon="tabler-clipboard-list"
                        size="14"
                        color="success"
                      />
                      <span class="stat-value">{{ item._count?.grades || 0 }}</span>
                    </div>
                  </template>
                </VTooltip>
                
                <VTooltip text="Kehadiran">
                  <template #activator="{ props }">
                    <div
                      v-bind="props"
                      class="stat-item"
                    >
                      <VIcon
                        icon="tabler-clock"
                        size="14"
                        color="warning"
                      />
                      <span class="stat-value">{{ item._count?.attendances || 0 }}</span>
                    </div>
                  </template>
                </VTooltip>
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template #item.status="{ item }">
            <div class="status-cell">
              <VChip
                :color="getStatusColor(item)"
                variant="tonal"
                size="small"
              >
                {{ getStatusText(item) }}
              </VChip>
            </div>
          </template>

          <!-- Actions Column -->
          <template #item.actions="{ item }">
            <div class="actions-cell">
              <VMenu>
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="text"
                    size="small"
                    icon="tabler-dots-vertical"
                  />
                </template>
                
                <VList>
                  <VListItem @click="onRowClick(null, { item })">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>
                    <VListItemTitle>Lihat Detail</VListItemTitle>
                  </VListItem>
                  
                  <VListItem @click="handleUpdate(item.id)">
                    <template #prepend>
                      <VIcon icon="tabler-edit" />
                    </template>
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  
                  <VDivider />
                  
                  <VListItem 
                    class="text-error"
                    @click="handleDelete(item.id)"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-trash" />
                    </template>
                    <VListItemTitle>Hapus</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </div>
          </template>

          <!-- Loading state -->
          <template #loading>
            <div class="loading-state">
              <VProgressCircular
                indeterminate
                color="primary"
              />
              <p class="text-caption mt-2">
                Memuat data Penilaian...
              </p>
            </div>
          </template>

          <!-- No data state -->
          <template #no-data>
            <div class="no-data-state">
              <VIcon 
                icon="tabler-school-off" 
                size="48" 
                color="disabled"
              />
              <h3 class="text-h6 mt-4">
                Belum ada Penilaian
              </h3>
              <p class="text-body-2 text-disabled">
                Mulai dengan membuat Penilaian pertama Anda
              </p>
              <VBtn 
                color="primary" 
                class="mt-4"
                @click="handleDrawerForm(true)"
              >
                <VIcon
                  start
                  icon="tabler-plus"
                />
                Tambah Penilaian
              </VBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <CourseFormDrawer
      :open="drawerForm"
      @handle-close="handleDrawerForm"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import CourseFormDrawer from './course-form-drawer.vue'

// Headers configuration
const headers = ref([
  { 
    title: 'Nama Penilaian', 
    key: 'name', 
    sortable: true,
    width: '25%',
  },
  { 
    title: 'Subjek', 
    key: 'subject', 
    sortable: false,
    width: '15%',
  },
  { 
    title: 'Kelas', 
    key: 'classGroup', 
    sortable: false,
    width: '12%',
  },
  { 
    title: 'Pengajar', 
    key: 'teacher', 
    sortable: false,
    width: '20%',
  },
  { 
    title: 'Statistik', 
    key: 'stats', 
    sortable: false,
    align: 'center',
    width: '15%',
  },
  { 
    title: 'Status', 
    key: 'status', 
    sortable: false,
    width: '10%',
  },
  { 
    title: '', 
    key: 'actions', 
    sortable: false,
    align: 'center',
    width: '3%',
  },
])

// Component state
const drawerForm = ref(false)
const store = useVuex()
const router = useRouter()

// Event handlers
const onRowClick = (event, { item }) => {
  router.push(`/course/${item.id}`)
}

const handleDrawerForm = value => {
  if(value) store.dispatch('course/fetchPrerequisites')
  drawerForm.value = value
}

const handleUpdate = async id => {
  await store.dispatch('course/setFormUpdate', id)
  handleDrawerForm(true)
}

const handleDelete = async id => {
  const confirm = await SwalDelete()
  if(confirm) {
    const success = await store.dispatch("course/delete", id)
    if(success) refetch()
  }
}

// Computed properties
const loading = computed(() => store.state.course.loading.courses)
const courses = computed(() => store.state.course.courses)

const table_options = computed({
  get: () => store.state.course.table_options,
  set: value => store.commit('course/SET_TABLE_OPTIONS', value),
})

// Utility functions
const formatDate = dateString => {
  const date = new Date(dateString)
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusColor = item => {
  if (!item.teacher) return 'warning'
  if (item._count?.students === 0) return 'info'
  
  return 'success'
}

const getStatusText = item => {
  if (!item.teacher) return 'Perlu Pengajar'
  if (item._count?.students === 0) return 'Belum Ada Siswa'
  
  return 'Aktif'
}

const refetch = () => store.dispatch('course/getCourses')

// Lifecycle
onMounted(() => refetch())
</script>

<style scoped>
.course-table-wrapper {
  padding: 0;
}

.course-table-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 10%);
}

/* Header Styles */
.card-header {
  padding: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  inline-size: 100%;
}

.header-info {
  display: flex;
  align-items: center;
}

.header-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-subtitle {
  margin: 0;
  font-size: 0.875rem;
}

/* Search Section */
.search-section {
  padding-block: 16px;
  padding-inline: 24px;
}

.search-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.search-field {
  flex: 1;
  max-inline-size: 400px;
}

.action-buttons {
  display: flex;
  align-items: center;
}

/* Table Section */
.table-section {
  padding-block: 0 24px;
  padding-inline: 24px;
}

.course-data-table {
  border-radius: 8px;
}

/* Cell Styles */
.course-name-cell {
  padding-block: 8px;
  padding-inline: 0;
}

.course-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-block: 0 4px;
  margin-inline: 0;
}

.course-meta {
  display: flex;
  align-items: center;
}

.teacher-cell {
  min-inline-size: 180px;
}

.no-teacher {
  display: flex;
  align-items: center;
}

.stats-cell {
  padding-block: 8px;
  padding-inline: 0;
}

.stats-grid {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  gap: 4px;
  padding-block: 4px;
  padding-inline: 6px;
  transition: background-color 0.2s;
}

.stat-value {
  font-size: 0.75rem;
  font-weight: 600;
}

.actions-cell {
  text-align: center;
}

/* Empty States */
.loading-state,
.no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block: 64px;
  padding-inline: 24px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 960px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: stretch;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stats-grid {
    flex-direction: column;
    gap: 4px;
  }
  
  .stat-item {
    justify-content: flex-start;
  }
}
</style>

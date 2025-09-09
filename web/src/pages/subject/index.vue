<template>
  <div class="subjects-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <VIcon 
            icon="tabler-book-2" 
            size="32" 
            class="header-icon"
          />
          <div>
            <h1 class="text-h4 font-weight-bold">
              Manajemen Jurusan
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Kelola jurusan, mata pelajaran, dan bobot penilaian
            </p>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="stats-cards">
          <div class="stat-card border">
            <VIcon
              icon="tabler-books"
              class="stat-icon primary"
            />
            <div class="stat-info">
              <span class="stat-number">{{ subjects.length }}</span>
              <span class="stat-label">Jurusan</span>
            </div>
          </div>
          
          <div class="stat-card border">
            <VIcon
              icon="tabler-school"
              class="stat-icon secondary"
            />
            <div class="stat-info">
              <span class="stat-number">{{ totalCourses }}</span>
              <span class="stat-label">Mata Pelajaran</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <VCard
      class="main-card"
      elevation="0"
    >
      <!-- Toolbar -->
      <VCardText class="toolbar-section">
        <div class="toolbar">
          <!-- Search -->
          <div class="search-section">
            <VTextField
              v-model="table_options.search"
              placeholder="Cari jurusan..."
              prepend-inner-icon="tabler-search"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
              clearable
            />
          </div>

          <!-- Actions -->
          <div class="actions-section">
            <VBtn
              variant="outlined"
              prepend-icon="tabler-refresh"
              :loading="loading"
              @click="refetch"
            >
              Refresh
            </VBtn>
            
            <VBtn
              color="primary"
              prepend-icon="tabler-plus"
              class="add-btn"
              @click="handleDrawerForm(true)"
            >
              Tambah Jurusan
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <!-- Data Table -->
      <VCardText class="pa-0">
        <VDataTableServer
          v-model:options="table_options"
          v-model:items-per-page="table_options.page_size"
          v-model:page="table_options.page"
          :items-length="table_options.total_items"
          :search="table_options.search"
          :headers="headers"
          :items="subjects"
          :loading="loading"
          class="modern-table"
          hover
          @click:row="onRowClick"
          @update:options="refetch"
        >
          <!-- Subject Name -->
          <template #item.name="{ item }">
            <div class="subject-name">
              <div class="subject-avatar">
                <VIcon
                  icon="tabler-book-2"
                  size="20"
                />
              </div>
              <div class="subject-info">
                <div class="subject-title">
                  {{ item.name }}
                </div>
                <div class="subject-subtitle">
                  Dibuat {{ formatRelativeDate(item.createdAt) }}
                </div>
              </div>
            </div>
          </template>

          <!-- Courses Count -->
          <template #item.courses="{ item }">
            <VChip
              :color="item.courses?.length ? 'primary' : 'default'"
              variant="tonal"
              size="small"
            >
              <VIcon
                icon="tabler-school"
                size="16"
                start
              />
              {{ item.courses?.length || 0 }} mata pelajaran
            </VChip>
          </template>

          <!-- Assessment Weights -->
          <template #item.weights="{ item }">
            <VChip
              :color="item.weights?.length ? 'secondary' : 'default'"
              variant="tonal"
              size="small"
            >
              <VIcon
                icon="tabler-scale"
                size="16"
                start
              />
              {{ item.weights?.length || 0 }} bobot
            </VChip>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <VChip
              :color="getStatusColor(item)"
              variant="flat"
              size="small"
              class="status-chip"
            >
              {{ getStatusText(item) }}
            </VChip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="action-buttons">
              <VBtn
                variant="text"
                icon="tabler-edit"
                size="small"
                @click.stop="handleUpdate(item.id)"
              >
                <VIcon icon="tabler-edit" />
                <VTooltip activator="parent">
                  Edit Jurusan
                </VTooltip>
              </VBtn>

              <VBtn
                variant="text"
                icon="tabler-trash"
                size="small"
                color="error"
                @click.stop="handleDelete(item.id)"
              >
                <VIcon icon="tabler-trash" />
                <VTooltip activator="parent">
                  Hapus Jurusan
                </VTooltip>
              </VBtn>
            </div>
          </template>

          <!-- Loading State -->
          <template #loading>
            <VSkeletonLoader
              v-for="n in 5"
              :key="n"
              type="table-row-divider"
              class="mx-0"
            />
          </template>

          <!-- No Data State -->
          <template #no-data>
            <div class="empty-state">
              <VIcon
                icon="tabler-book-off"
                size="64"
                class="empty-icon"
              />
              <h3 class="text-h6 mt-4">
                Belum Ada Jurusan
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Mulai dengan menambahkan jurusan pertama Anda
              </p>
              <VBtn
                color="primary"
                prepend-icon="tabler-plus"
                @click="handleDrawerForm(true)"
              >
                Tambah Jurusan
              </VBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <!-- Subject Form Drawer -->
    <SubjectFormDrawer 
      :open="drawerForm" 
      :is-editing="isEditing"
      :edit-id="editingId"
      @handle-close="handleDrawerForm" 
      @refresh="refetch"
    />
  </div>
</template>

<script setup>
import axiosInstance from "@/utils/axios"
import { SwalDelete } from "@/utils/sweetalert"
import { useVuex } from "@/utils/vuex"
import { computed, onMounted, ref } from "vue"
import { useRouter } from 'vue-router'
import { toast } from "vue-sonner"
import SubjectFormDrawer from "../../views/subject/subject-form-drawer.vue"

// Table headers
const headers = ref([
  { title: "Jurusan", key: "name", sortable: true },
  { title: "Mata Pelajaran", key: "courses", sortable: false },
  { title: "Bobot Penilaian", key: "weights", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Aksi", key: "actions", sortable: false },
])

// Composables
const store = useVuex()
const router = useRouter()

// Reactive state
const drawerForm = ref(false)
const detailsDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loadingDetails = ref(false)
const selectedSubject = ref({})
const subjects = ref([])
const loading = ref(false)

const table_options = ref({
  page: 1,
  page_size: 10,
  total_pages: 0,
  total_items: 0,
  search: "",
})

// Assessment weights modal
const assessmentWeightsModal = ref(false)
const selectedWeightsSubjectId = ref(null)
const selectedWeightsSubjectName = ref('')

// Course management modal
const courseManagementModal = ref(false)
const selectedCourseSubjectId = ref(null)
const selectedCourseSubjectName = ref('')

// Computed properties
const totalCourses = computed(() => {
  return subjects.value.reduce((total, subject) => {
    return total + (subject.courses?.length || 0)
  }, 0)
})

// Event handlers
const onRowClick = (event, { item }) => {
  router.push(`/subject/${item.id}`)
}

const handleDrawerForm = (value, id = null) => {
  if (!value) {
    isEditing.value = false
    editingId.value = null
    refetch()
  }
  drawerForm.value = value
}

const handleUpdate = id => {
  isEditing.value = true
  editingId.value = id
  handleDrawerForm(true)
}

const handleDelete = async id => {
  const confirm = await SwalDelete({
    title: "Hapus jurusan?",
    text: "Tindakan ini akan menghapus jurusan dan dapat mempengaruhi mata pelajaran dan penilaian terkait. Tindakan ini tidak dapat dibatalkan.",
    confirmButtonText: "Ya, hapus jurusan",
  })

  if (confirm) {
    try {
      loading.value = true
      
      await axiosInstance({
        method: "DELETE",
        url: `/subject/${id}`,
      })
      
      toast.success("Jurusan berhasil dihapus")
      await refetch()
    } catch (error) {
      console.error("Failed to delete subject:", error)
      toast.error("Gagal menghapus jurusan")
    } finally {
      loading.value = false
    }
  }
}


// Modal handlers
const openAssessmentWeightsModal = (subjectId, subjectName) => {
  selectedWeightsSubjectId.value = subjectId
  selectedWeightsSubjectName.value = subjectName
  assessmentWeightsModal.value = true
}

const openCourseManagementModal = (subjectId, subjectName) => {
  selectedCourseSubjectId.value = subjectId
  selectedCourseSubjectName.value = subjectName
  courseManagementModal.value = true
}

// Data fetching
const refetch = async () => {
  loading.value = true
  
  try {
    const result = await axiosInstance({
      method: "GET",
      url: "/subject",
      params: {
        search: table_options.value.search,
        page: table_options.value.page,
        page_size: table_options.value.page_size,
        _t: new Date().getTime(),
      },
    })
    
    subjects.value = result.data.data
    
    if (result.data.pagination) {
      table_options.value = {
        ...table_options.value,
        total_items: result.data.pagination.total_items || 0,
        total_pages: result.data.pagination.total_pages || 0,
      }
    }
    
    return result.data
  } catch (error) {
    console.error("Failed to fetch subjects:", error)
    toast.error("Gagal memuat jurusan")
    
    return null
  } finally {
    loading.value = false
  }
}


const formatRelativeDate = dateString => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return "kemarin"
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lalu`
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} bulan lalu`
  
  return `${Math.ceil(diffDays / 365)} tahun lalu`
}

const getStatusColor = item => {
  const hasContent = (item.courses?.length || 0) > 0 && (item.weights?.length || 0) > 0
  
  return hasContent ? 'success' : 'warning'
}

const getStatusText = item => {
  const hasContent = (item.courses?.length || 0) > 0 && (item.weights?.length || 0) > 0
  
  return hasContent ? 'Aktif' : 'Perlu Konfigurasi'
}

// Lifecycle
onMounted(() => {
  refetch()
})
</script>

<style scoped>
/* Header Styles */
.page-header {
  margin-block-end: 24px;
}

.header-content {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  padding: 8px;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.stats-cards {
  display: flex;
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  border-radius: 12px;
  gap: 12px;
  min-inline-size: 120px;
  padding-block: 16px;
  padding-inline: 20px;
}

.stat-icon {
  padding: 8px;
  border-radius: 8px;
}

.stat-icon.primary {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.stat-icon.secondary {
  background: rgba(var(--v-theme-secondary), 0.1);
  color: rgb(var(--v-theme-secondary));
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  opacity: 0.7;
  text-transform: uppercase;
}

/* Main Card */
.main-card {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,8%);
}

/* Toolbar */
.toolbar-section {
  background: rgba(var(--v-theme-surface), 0.5);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.search-section {
  flex: 1;
  max-inline-size: 400px;
}

.search-field {
  border-radius: 12px;
}

.actions-section {
  display: flex;
  gap: 12px;
}

.add-btn {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.2);
}

/* Table Styles */
.modern-table {
  border-radius: 0;
}

/* Subject Name Cell */
.subject-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subject-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(var(--v-theme-primary), 0.1);
  block-size: 40px;
  color: rgb(var(--v-theme-primary));
  inline-size: 40px;
}

.subject-info {
  display: flex;
  flex-direction: column;
}

.subject-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.subject-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* Chip Styles */
.course-chip, .weights-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.course-chip:hover, .weights-chip:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,15%);
  transform: translateY(-1px);
}

.status-chip {
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
}

/* Empty State */
.empty-state {
  padding-block: 64px;
  padding-inline: 24px;
  text-align: center;
}

.empty-icon {
  margin-block-end: 16px;
  opacity: 0.3;
}

/* Details Dialog */
.details-card {
  overflow: hidden;
  border-radius: 16px;
}

.details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  background: rgba(var(--v-theme-primary), 0.05);
}

.details-title {
  display: flex;
  align-items: flex-start;
}

.details-content {
  padding: 0;
}

.loading-state {
  padding-block: 64px;
  padding-inline: 24px;
  text-align: center;
}

.details-sections {
  display: flex;
  flex-direction: column;
}

/* Detail Sections */
.detail-section {
  padding: 24px;
  border-block-end: 1px solid rgba(var(--v-border-color), 0.12);
}

.detail-section:last-child {
  border-block-end: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  color: rgb(var(--v-theme-primary));
  font-size: 1.125rem;
  font-weight: 600;
}

/* Info Grid */
.info-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  opacity: 0.7;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
}

/* Courses Grid */
.courses-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.course-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.course-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,10%);
  transform: translateY(-2px);
}

.course-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.course-icon {
  padding: 8px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  margin-block-start: 4px;
}

.course-details {
  flex: 1;
}

.course-name {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  margin-block-end: 8px;
}

.course-teacher, .course-students {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin-block-end: 4px;
  opacity: 0.8;
}

/* Weights Grid */
.weights-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.weight-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.weight-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,10%);
  transform: translateY(-2px);
}

.weight-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weight-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weight-icon {
  padding: 6px;
  border-radius: 6px;
  background: rgba(var(--v-theme-secondary), 0.1);
  color: rgb(var(--v-theme-secondary));
}

.weight-type {
  font-size: 0.875rem;
  font-weight: 600;
}

.weight-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weight-percentage {
  color: rgb(var(--v-theme-secondary));
  font-size: 1.5rem;
  font-weight: 700;
}

.weight-quota {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Empty Section */
.empty-section {
  border: 2px dashed rgba(var(--v-border-color), 0.3);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.5);
  padding-block: 32px;
  padding-inline: 16px;
  text-align: center;
}

.empty-section .empty-icon {
  margin-block-end: 8px;
  opacity: 0.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .subjects-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-cards {
    justify-content: center;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .search-section {
    max-inline-size: none;
  }
  
  .actions-section {
    justify-content: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .courses-grid, .weights-grid {
    grid-template-columns: 1fr;
  }
  
  .details-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .subject-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .subject-avatar {
    block-size: 32px;
    inline-size: 32px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>

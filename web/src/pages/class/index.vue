<template>
  <div class="class-groups-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <VIcon
            icon="tabler-users-group"
            size="32"
            class="header-icon"
          />
          <div>
            <h1 class="text-h4 font-weight-bold">
              Manajemen Kelas
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              Kelola rombongan belajar, siswa, dan wali kelas
            </p>
          </div>
        </div>
      </div>
    </div>

    <VCard
      class="main-card"
      elevation="0"
    >
      <VCardText class="toolbar-section">
        <div class="toolbar">
          <div class="search-section">
            <VTextField
              v-model="table_options.search"
              placeholder="Cari Kelas..."
              prepend-inner-icon="tabler-search"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
              clearable
              @update:model-value="debouncedRefetch"
            />
          </div>

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
              Tambah Kelas
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="pa-0">
        <VDataTableServer
          v-model:items-per-page="table_options.page_size"
          v-model:page="table_options.page"
          :items-length="table_options.total_items"
          :headers="headers"
          :items="classGroups"
          :loading="loading"
          class="modern-table"
          hover
          @click:row="onRowClick"
          @update:options="updateOptions"
        >
          <template #item.name="{ item }">
            <div class="subject-name">
              <div class="subject-avatar">
                <VIcon
                  icon="tabler-users-group"
                  size="20"
                />
              </div>
              <div class="subject-info">
                <div class="subject-title">
                  {{ item.name }}
                </div>
                <div class="subject-subtitle">
                  Wali Kelas: {{ item.homeroom?.name || 'Belum diatur' }}
                </div>
              </div>
            </div>
          </template>

          <template #item.students="{ item }">
            <VChip
              :color="item.students?.length ? 'primary' : 'default'"
              variant="tonal"
              size="small"
            >
              <VIcon
                icon="tabler-users"
                size="16"
                start
              />
              {{ item.students?.length || 0 }} siswa
            </VChip>
          </template>

          <template #item.createdAt="{ item }">
            <span class="text-body-2 text-medium-emphasis">{{ formatRelativeDate(item.createdAt) }}</span>
          </template>

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
                  Edit Kelas
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
                  Hapus Kelas
                </VTooltip>
              </VBtn>
            </div>
          </template>

          <template #loading>
            <VSkeletonLoader
              v-for="n in 5"
              :key="n"
              type="table-row-divider"
              class="mx-0"
            />
          </template>

          <template #no-data>
            <div class="empty-state">
              <VIcon
                icon="tabler-school-off"
                size="64"
                class="empty-icon"
              />
              <h3 class="text-h6 mt-4">
                Belum Ada Kelas
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Mulai dengan menambahkan rombongan belajar pertama Anda
              </p>
              <VBtn
                color="primary"
                prepend-icon="tabler-plus"
                @click="handleDrawerForm(true)"
              >
                Tambah Kelas
              </VBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <ClassFormDrawer
      :open="drawerForm"
      :is-editing="isEditing"
      :edit-id="editingId"
      @handle-close="handleDrawerForm"
      @refresh="refetch"
    />
  </div>
</template>

<script setup>
import { SwalDelete } from "@/utils/sweetalert"
import { computed, onMounted, ref } from "vue"
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ClassFormDrawer from '@/views/class/class-form-drawer.vue'

// --- Store & Router ---
const store = useStore()
const router = useRouter()

// --- Headers Tabel ---
const headers = ref([
  { title: "Nama Kelas", key: "name", sortable: true },
  { title: "Jumlah Siswa", key: "students", sortable: false, align: 'center' },
  { title: "Dibuat Pada", key: "createdAt", sortable: true },
  { title: "Status", key: "status", sortable: false },
  { title: "Aksi", key: "actions", align: "end", sortable: false },
])

// --- State Reaktif ---
const drawerForm = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// Support both 'classGroup' and 'class' as module name for compatibility
const classModule = computed(() => store.state.classGroup || store.state.class || {})
const classGroups = computed(() => classModule.value.reports || [])
const loading = computed(() => classModule.value.loading?.reports || false)

const table_options = computed({
  get: () => classModule.value.table_options || {},
  set: val => store.commit('classGroup/SET_TABLE_OPTIONS', val),
})

// --- Properti Terkomputasi (Computed Properties) ---
const totalStudents = computed(() => {
  return classGroups.value.reduce((total, group) => total + (group.students?.length || 0), 0)
})

// --- Fungsi Debounce untuk Pencarian ---
let searchTimeout = null

const debouncedRefetch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    table_options.value.page = 1 // Reset ke halaman 1 saat mencari
    refetch()
  }, 500) // Tunggu 500ms setelah user berhenti mengetik
}

// --- Pengambilan Data (Data Fetching) ---
const refetch = () => {
  store.dispatch('classGroup/getReports')
}

// Handler saat VDataTableServer mengubah opsi (halaman, item per halaman)
const updateOptions = options => {
  store.commit('classGroup/SET_TABLE_OPTIONS', options)
  refetch()
}

// --- Event Handlers ---
const onRowClick = (event, { item }) => {
  // Arahkan ke halaman detail jika ada
  // router.push(`/class-group/${item.id}`)
  console.log('Row clicked:', item.id)
}

const handleDrawerForm = value => {
  drawerForm.value = value

  // console.log('Drawer form state changed:', drawerForm.value)

  if (!value) {
    isEditing.value = false
    editingId.value = null
  }
}

const handleUpdate = id => {
  isEditing.value = true
  editingId.value = id
  handleDrawerForm(true)
}

const handleDelete = async id => {
  const isConfirmed = await SwalDelete({
    title: "Hapus Kelas?",
    text: "Tindakan ini akan menghapus rombongan belajar secara permanen. Tindakan ini tidak dapat dibatalkan.",
    confirmButtonText: "Ya, Hapus Kelas",
  })

  if (isConfirmed) {
    await store.dispatch('classGroup/delete', id)
  }
}

// --- Fungsi Bantuan (Helpers) ---
const formatRelativeDate = dateString => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 1) return "hari ini"
  if (diffDays === 2) return "kemarin"
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`
  
  return `${Math.floor(diffDays / 365)} tahun lalu`
}

const getStatusColor = item => {
  const isConfigured = item.homeroom && (item.students?.length || 0) > 0
  
  return isConfigured ? 'success' : 'warning'
}

const getStatusText = item => {
  const isConfigured = item.homeroom && (item.students?.length || 0) > 0
  
  return isConfigured ? 'Lengkap' : 'Perlu Konfigurasi'
}

// --- Lifecycle Hook ---
onMounted(() => {
  refetch()
})
</script>

<style scoped>
/* Anda dapat menyalin dan menempelkan semua style dari contoh Jurusan di sini */

/* Sebagian besar nama kelasnya generik dan akan berfungsi dengan baik */

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

/* Custom Cell (copied from subject) */
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

.status-chip {
  font-weight: 500;
}

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
</style>

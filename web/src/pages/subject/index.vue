<template>
  <div>
    <VCard title="Jurusan">
      <VCardText>
        <div class="d-flex align-center justify-end flex-wrap gap-4">
          <div style="inline-size: 20rem">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Cari jurusan..."
              append-inner-icon="tabler-search"
            />
          </div>

          <VBtn @click="handleDrawerForm(true)">
            <VIcon
              start
              icon="tabler-plus"
            />
            Tambah Jurusan
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="px-0 pt-0">
        <VDataTableServer
          v-model:options="table_options"
          v-model:items-per-page="table_options.page_size"
          v-model:page="table_options.page"
          :items-length="table_options.total_items"
          :search="table_options.search"
          :headers="headers"
          :items="subjects"
          :loading="loading"
          class="text-no-wrap"
          hover
          @click:row="onRowClick"
          @update:options="refetch"
        >
          <!-- Subject Name -->
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <VIcon
                size="22"
                icon="tabler-book"
                class="me-2"
              />
              <span class="text-body-1 font-weight-medium">{{ item.name }}</span>
            </div>
          </template>

          <!-- Mata Pelajaran Count - Now clickable -->
          <template #item.courses="{ item }">
            <VChip 
              size="small" 
              color="primary"
              class="cursor-pointer"
              @click="openCourseManagementModal(item.id, item.name)"
            >
              {{ item.courses?.length || 0 }} mata pelajaran
              <VIcon
                size="14"
                icon="tabler-chevron-right"
                class="ms-1"
              />
            </VChip>
          </template>
          
          <!-- Assessment Weights - Now clickable -->
          <template #item.weights="{ item }">
            <VChip 
              size="small" 
              color="secondary"
              class="cursor-pointer"
              @click="openAssessmentWeightsModal(item.id, item.name)"
            >
              {{ item.weights?.length || 0 }} bobot
              <VIcon
                size="14"
                icon="tabler-chevron-right"
                class="ms-1"
              />
            </VChip>
          </template>

          <!-- Created Date -->
          <template #item.createdAt="{ item }">
            {{ new Date(item.createdAt).toLocaleDateString() }}
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1 justify-end">
              <IconBtn @click="handleViewDetails(item.id)">
                <VIcon icon="tabler-eye" />
                <VTooltip activator="parent">
                  Lihat Detail
                </VTooltip>
              </IconBtn>

              <IconBtn @click="handleUpdate(item.id)">
                <VIcon icon="tabler-edit" />
                <VTooltip activator="parent">
                  Edit
                </VTooltip>
              </IconBtn>

              <IconBtn @click="handleDelete(item.id)">
                <VIcon icon="tabler-trash" />
                <VTooltip activator="parent">
                  Hapus
                </VTooltip>
              </IconBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <!-- Jurusan Form Drawer with refresh handler -->
    <SubjectFormDrawer 
      :open="drawerForm" 
      :is-editing="isEditing"
      :edit-id="editingId"
      @handle-close="handleDrawerForm" 
      @refresh="refetch"
    />

    <!-- Jurusan Details Dialog - Modified to remove management buttons -->
    <VDialog
      v-model="detailsDialog"
      max-width="800px"
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Detail Jurusan: {{ selectedSubject.name }}</span>
          <VBtn
            variant="text"
            icon="tabler-x"
            @click="detailsDialog = false"
          />
        </VCardTitle>

        <VDivider />

        <VCardText>
          <div v-if="loadingDetails">
            <VProgressCircular
              indeterminate
              class="mx-auto d-block my-4"
            />
          </div>
          
          <div v-else>
            <!-- Basic Subject Information -->
            <div class="mb-4">
              <h4 class="text-h6 mb-2">
                Informasi Dasar
              </h4>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex align-center">
                  <div class="text-subtitle-2 min-width-100">
                    Nama:
                  </div>
                  <div>{{ selectedSubject.name }}</div>
                </div>
                <div class="d-flex align-center">
                  <div class="text-subtitle-2 min-width-100">
                    Dibuat:
                  </div>
                  <div>{{ formatDate(selectedSubject.createdAt) }}</div>
                </div>
                <div class="d-flex align-center">
                  <div class="text-subtitle-2 min-width-100">
                    Diperbarui:
                  </div>
                  <div>{{ formatDate(selectedSubject.updatedAt) }}</div>
                </div>
              </div>
            </div>
            
            <VDivider class="my-4" />
            
            <!-- Associated Mata Pelajaran - Removed management button -->
            <div class="mb-4">
              <h4 class="text-h6 mb-2">
                Mata Pelajaran Terkait
              </h4>
              
              <!-- Display courses table or empty state -->
              <VTable
                v-if="selectedSubject.courses?.length"
                density="compact"
                class="bg-surface-100 rounded"
              >
                <thead>
                  <tr>
                    <th class="text-left">
                      Nama Mata Pelajaran
                    </th>
                    <th class="text-left">
                      Guru
                    </th>
                    <th class="text-left">
                      Siswa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="course in selectedSubject.courses"
                    :key="course.id"
                  >
                    <td>{{ course.name }}</td>
                    <td>{{ course.teacher?.name || 'N/A' }}</td>
                    <td>{{ course.students?.length || 0 }} siswa</td>
                  </tr>
                </tbody>
              </VTable>
              
              <div
                v-else
                class="text-center pa-4 bg-surface-100 rounded"
              >
                <VIcon
                  icon="tabler-book-off"
                  size="32"
                  class="mb-2"
                />
                <p class="text-medium-emphasis">
                  Tidak ada mata pelajaran yang terkait dengan jurusan ini
                </p>
              </div>
            </div>
            
            <VDivider class="my-4" />
            
            <!-- Assessment Weights - Removed management button -->
            <div>
              <h4 class="text-h6 mb-2">
                Bobot Penilaian
              </h4>
              
              <!-- Display weights table or empty state -->
              <VTable
                v-if="selectedSubject.weights?.length"
                density="compact"
                class="bg-surface-100 rounded"
              >
                <thead>
                  <tr>
                    <th class="text-left">
                      Jenis Ujian
                    </th>
                    <th class="text-left">
                      Bobot
                    </th>
                    <th class="text-left">
                      Kuota
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="weight in selectedSubject.weights"
                    :key="weight.id"
                  >
                    <td>{{ formatExamType(weight.examType) }}</td>
                    <td>{{ (weight.weight * 100).toFixed(0) }}%</td>
                    <td>{{ weight.quota || 'N/A' }}</td>
                  </tr>
                </tbody>
              </VTable>
              
              <div
                v-else
                class="text-center pa-4 bg-surface-100 rounded"
              >
                <VIcon
                  icon="tabler-scale"
                  size="32"
                  class="mb-2"
                />
                <p class="text-medium-emphasis">
                  Belum ada bobot penilaian yang ditentukan untuk jurusan ini
                </p>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VDialog>



  
  </div>
</template>

<script setup>
import axiosInstance from "@/utils/axios"
import { SwalDelete } from "@/utils/sweetalert"
import { useVuex } from "@/utils/vuex"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"
import SubjectFormDrawer from "./subject-form-drawer.vue"

const headers = ref([
  { title: "Nama Jurusan", key: "name" },
  { title: "Mata Pelajaran", key: "courses" },
  { title: "Bobot Penilaian", key: "weights" },
  {
    title: "Dibuat Pada",
    key: "createdAt",
    sortable: true,
  },
  { title: "Aksi", align: "end", key: "actions", sortable: false },
])

const store = useVuex()
const router = useRouter()
const drawerForm = ref(false)
const detailsDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loadingDetails = ref(false)
const selectedSubject = ref({})

const table_options = ref({
  page: 1,
  page_size: 10,
  total_pages: 0,
  total_items: 0,
  search: "",
})

// Mock data for development
// Replace with actual store implementation
const subjects = ref([])
const loading = ref(false)

const onRowClick = (event, { item }) => {
  router.push(`/subject/${item.id}`)
}

const handleDrawerForm = (value, id = null) => {
  if (!value) {
    isEditing.value = false
    editingId.value = null
    
    // When closing the form, refresh the list to ensure data consistency
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
      
      const result = await axiosInstance({
        method: "DELETE",
        url: `/subject/${id}`,
      })
      
      toast.success("Jurusan berhasil dihapus")
      
      // Ensure we refresh after deletion 
      await refetch()
    } catch (error) {
      console.error("Failed to delete subject:", error)
      toast.error("Gagal menghapus jurusan")
    } finally {
      loading.value = false
    }
  }
}

const handleViewDetails = async id => {
  loadingDetails.value = true
  
  try {
    const result = await axiosInstance({
      method: "GET",
      url: `/subject/${id}`,
    })
    
    selectedSubject.value = result.data.data
    detailsDialog.value = true
  } catch (error) {
    console.error("Failed to fetch subject details:", error)
    toast.error("Gagal memuat detail jurusan")
  } finally {
    loadingDetails.value = false
  }
}

const formatDate = dateString => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  
  return date.toLocaleString()
}

const refetch = async () => {
  loading.value = true
  
  try {
    console.log("Memperbarui data jurusan...")

    const result = await axiosInstance({
      method: "GET",
      url: "/subject",
      params: {
        search: table_options.value.search,
        page: table_options.value.page,
        page_size: table_options.value.page_size,
        _t: new Date().getTime(), // Cache busting
      },
    })
    
    subjects.value = result.data.data
    console.log(`Memuat ${subjects.value.length} jurusan`)
    
    // Update pagination
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

// Add new refs for assessment weights modal
const assessmentWeightsModal = ref(false)
const selectedWeightsSubjectId = ref(null)
const selectedWeightsSubjectName = ref('')

// Open assessment weights modal
const openAssessmentWeightsModal = (subjectId, subjectName) => {
  selectedWeightsSubjectId.value = subjectId
  selectedWeightsSubjectName.value = subjectName
  assessmentWeightsModal.value = true
}

// Handle weights updated
const handleWeightsUpdated = async () => {
  // If we're currently viewing a subject's details, refresh them
  if (detailsDialog.value && selectedSubject.value?.id) {
    await handleViewDetails(selectedSubject.value.id)
  }
  
  // Refresh the main table as weights count might have changed
  await refetch()
}

// Add new refs for course management modal
const courseManagementModal = ref(false)
const selectedCourseSubjectId = ref(null)
const selectedCourseSubjectName = ref('')

// Open course management modal
const openCourseManagementModal = (subjectId, subjectName) => {
  selectedCourseSubjectId.value = subjectId
  selectedCourseSubjectName.value = subjectName
  courseManagementModal.value = true
}

// Handle courses updated
// eslint-disable-next-line sonarjs/no-identical-functions
const handleCoursesUpdated = async () => {
  // If we're currently viewing a subject's details, refresh them
  if (detailsDialog.value && selectedSubject.value?.id) {
    await handleViewDetails(selectedSubject.value.id)
  }
  
  // Refresh the main table as course count might have changed
  await refetch()
}

onMounted(() => {
  refetch()
})

// Helper to format exam types
const formatExamType = type => {
  if (!type) return 'N/A'
  
  return type.replace('_', ' ').split(' ')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}
</script>

<style scoped>
.min-width-100 {
  min-inline-size: 100px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>

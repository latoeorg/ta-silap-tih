<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Kelola Mata Pelajaran: {{ subjectName }}</span>
    </VCardTitle>

    <VDivider />

    <VCardText>
      <!-- Course Management Header -->
      <div class="d-flex justify-space-between align-center mb-4">
        <h4 class="text-h6">
          Mata Pelajaran Jurusan
        </h4>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          variant="tonal"
          @click="openAddCourseForm"
        >
          Tambah Mata Pelajaran Baru
        </VBtn>
      </div>

      <!-- Course Form -->
      <div
        v-if="showForm"
        class="mb-6 pa-4 bg-surface-200 rounded"
      >
        <h5 class="text-subtitle-1 mb-3">
          {{ isEditing ? 'Edit' : 'Tambah' }} Mata Pelajaran
        </h5>
        
        <VForm
          ref="formRef"
          class="d-flex flex-column gap-4"
          @submit.prevent="saveCourse"
        >
          <!-- Course Name -->
          <VTextField
            v-model="courseForm.name"
            label="Nama Mata Pelajaran"
            density="comfortable"
            :rules="[v => !!v || 'Nama mata pelajaran wajib diisi']"
            variant="outlined"
          />
          
          <div class="d-flex flex-wrap gap-4">
            <!-- Teacher Selection -->
            <VAutocomplete
              v-model="courseForm.teacherId"
              :items="teachers"
              item-title="name"
              item-value="id"
              label="Guru"
              density="comfortable"
              :rules="[v => !!v || 'Guru wajib dipilih']"
              variant="outlined"
              style="flex: 1; min-inline-size: 250px"
            >
              <template #item="{ item, props }">
                <VListItem v-bind="props">
                  <template #prepend>
                    <VAvatar
                      size="32"
                      color="primary"
                      variant="tonal"
                    >
                      <VIcon icon="tabler-user" />
                    </VAvatar>
                  </template>
                  <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
                  <VListItemSubtitle>{{ item.raw.email }}</VListItemSubtitle>
                </VListItem>
              </template>
            </VAutocomplete>
          </div>
          
          <div class="d-flex justify-end gap-3">
            <VBtn
              color="secondary"
              variant="tonal"
              @click="cancelForm"
            >
              Batal
            </VBtn>
            
            <VBtn
              color="primary"
              type="submit"
              :loading="formLoading"
            >
              {{ isEditing ? 'Perbarui' : 'Simpan' }}
            </VBtn>
          </div>
        </VForm>
      </div>

      <!-- Courses Table -->
      <div
        v-if="loading"
        class="d-flex justify-center pa-4"
      >
        <VProgressCircular indeterminate />
      </div>
      
      <VCard
        v-else-if="courses.length > 0"
        border
      >
        <VDataTable
          :headers="courseHeaders"
          :items="courses"
          density="comfortable"
          class="elevation-0"
        >
          <!-- Course Name -->
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <VIcon
                size="18"
                icon="tabler-book-2"
                class="me-2"
                color="primary"
              />
              <span class="font-weight-medium">{{ item.name }}</span>
            </div>
          </template>
          
          <!-- Teacher -->
          <template #item.teacherId="{ item }">
            <div class="d-flex align-center">
              <VAvatar
                size="28"
                color="primary"
                variant="tonal"
                class="me-2"
              >
                <VIcon
                  icon="tabler-user"
                  size="16"
                />
              </VAvatar>
              <span>{{ getTeacherName(item.teacherId) }}</span>
            </div>
          </template>
          
          <!-- Student Count -->
          <template #item.students="{ item }">
            <div class="d-flex align-center gap-2">
              <VChip
                size="small"
                color="info"
                class="text-body-2"
                style="cursor: pointer"
                @click="openStudentManagement(item)"
              >
                {{ item.students?.length || 0 }} siswa
                <VIcon
                  size="14"
                  icon="tabler-chevron-right"
                  class="ms-1"
                />
              </VChip>
              
              <!-- Add the Grades management button -->
              <VChip
                size="small"
                color="success"
                class="text-body-2"
                style="cursor: pointer"
                @click="openGradeManagement(item)"
              >
                Nilai
                <VIcon
                  size="14"
                  icon="tabler-chart-bar"
                  class="ms-1"
                />
              </VChip>
            </div>
          </template>
          
          <!-- Created Date -->
          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          
          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-end">
              <IconBtn @click="editCourse(item)">
                <VIcon icon="tabler-edit" />
                <VTooltip activator="parent">
                  Edit
                </VTooltip>
              </IconBtn>

              <IconBtn @click="confirmDeleteCourse(item.id)">
                <VIcon
                  icon="tabler-trash"
                  color="error"
                />
                <VTooltip activator="parent">
                  Hapus
                </VTooltip>
              </IconBtn>
            </div>
          </template>
        </VDataTable>
      </VCard>
      
      <VAlert
        v-else
        type="info"
        class="mt-4"
        variant="tonal"
      >
        <div class="d-flex align-center">
          <VIcon
            icon="tabler-info-circle"
            class="me-2"
          />
          <span>Belum ada mata pelajaran yang ditentukan untuk jurusan ini.</span>
        </div>
        <div class="mt-2">
          Klik "Tambah Mata Pelajaran Baru" untuk membuat mata pelajaran pertama untuk jurusan ini.
        </div>
      </VAlert>
    </VCardText>
  </VCard>
  
  <!-- Student Management Modal -->
  <StudentManagementModal
    v-model:open="studentManagementDialog"
    :course-id="selectedCourseId"
    :course-name="selectedCourseName"
    @refresh="handleStudentUpdates"
  />
  
  <!-- Grade Management Modal -->
  <GradeManagementModal
    v-model:open="gradeManagementDialog"
    :course-id="selectedGradeCourseId"
    :course-name="selectedGradeCourseName"
    @refresh="handleGradeUpdates"
  />
</template>

<script setup>
import axiosInstance from '@/utils/axios'
import { SwalDelete } from '@/utils/sweetalert'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import GradeManagementModal from './modal/grade-management-modal.vue'
import StudentManagementModal from './modal/student-management-modal.vue'

// Get route parameters
const route = useRoute()

// Props definition - getting from route instead of props
const subjectId = ref(route.params.id)
const subjectName = ref(route.query.name || 'Subject')

// UI state
const showForm = ref(false)
const isEditing = ref(false)
const formRef = ref(null)
const studentManagementDialog = ref(false)
const gradeManagementDialog = ref(false)
const selectedCourseId = ref(null)
const selectedCourseName = ref('')
const selectedGradeCourseId = ref(null)
const selectedGradeCourseName = ref('')

// Loading states
const loading = ref(false)
const formLoading = ref(false)

// Data collections
const courses = ref([])
const teachers = ref([])

// Course form state
const courseForm = ref({ name: '', teacherId: null })
const editingCourseId = ref(null)

// Table configuration
const courseHeaders = [
  { title: 'Course Name', key: 'name', sortable: true },
  { title: 'Teacher', key: 'teacherId', sortable: true },
  { title: 'Students', key: 'students', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

// Helper functions
const formatDate = dateString => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  
  return date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

const getTeacherName = teacherId => {
  const teacher = teachers.value.find(t => t.id === teacherId)
  
  return teacher ? teacher.name : 'Unknown'
}

// Form management
const resetForm = () => {
  courseForm.value = { name: '', teacherId: null }
  isEditing.value = false
  editingCourseId.value = null
  formRef.value?.resetValidation()
}

const openAddCourseForm = () => {
  resetForm()
  showForm.value = true
}

const cancelForm = () => {
  showForm.value = false
  resetForm()
}

const editCourse = course => {
  courseForm.value = {
    name: course.name,
    teacherId: course.teacherId,
  }
  isEditing.value = true
  editingCourseId.value = course.id
  showForm.value = true
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

// API interaction - Courses
const fetchCourses = async () => {
  if (!subjectId.value) return
  
  loading.value = true
  try {
    const result = await apiOperation('GET', '/course', null, {
      subjectId: subjectId.value,
      _t: new Date().getTime(), // Cache busting
    })
    
    courses.value = result.data || []
  } catch (error) {
    console.error('Error fetching courses:', error)
  } finally {
    loading.value = false
  }
}

const saveCourse = async () => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  formLoading.value = true
  
  try {
    const payload = {
      name: courseForm.value.name,
      teacherId: courseForm.value.teacherId,
      subjectId: subjectId.value,
    }
    
    if (isEditing.value) {
      await apiOperation('PUT', `/course/${editingCourseId.value}`, payload, null, 'Course updated successfully')
    } else {
      await apiOperation('POST', '/course', payload, null, 'Course created successfully')
    }
    
    showForm.value = false
    resetForm()
    fetchCourses()
  } catch (error) {
    console.error('Error saving course:', error)
  } finally {
    formLoading.value = false
  }
}

const confirmDeleteCourse = async id => {
  const confirmed = await SwalDelete({
    title: 'Delete course?',
    text: 'This will remove the course and unlink all students.',
    confirmButtonText: 'Yes, delete it',
  })
  
  if (confirmed) {
    loading.value = true
    try {
      await apiOperation('DELETE', `/course/${id}`, null, null, 'Course deleted successfully')
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    } finally {
      loading.value = false
    }
  }
}

// API interaction - Teachers
const fetchTeachers = async () => {
  try {
    const result = await apiOperation('GET', '/user', null, { role: 'TEACHER', limit: 100 })

    teachers.value = result.data || []
  } catch (error) {
    console.error('Error fetching teachers:', error)
  }
}

// Student management
const openStudentManagement = course => {
  selectedCourseId.value = course.id
  selectedCourseName.value = course.name
  studentManagementDialog.value = true
}

const handleStudentUpdates = () => {
  fetchCourses()
}

// Grade management
const openGradeManagement = course => {
  selectedGradeCourseId.value = course.id
  selectedGradeCourseName.value = course.name
  gradeManagementDialog.value = true
}

const handleGradeUpdates = () => {
  fetchCourses()
}

// Initialize when component mounts
onMounted(() => {
  fetchCourses()
  fetchTeachers()
})
</script>

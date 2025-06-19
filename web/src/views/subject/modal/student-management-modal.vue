<template>
  <VDialog
    v-model="dialogModel"
    max-width="800px"
    scrollable
  >
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Manage Students: {{ courseName }}</span>
        <VBtn
          variant="text"
          icon="tabler-x"
          @click="closeDialog"
        />
      </VCardTitle>
      
      <VDivider />
      
      <VCardText>
        <div v-if="loading" class="d-flex justify-center pa-4">
          <VProgressCircular indeterminate />
        </div>
        <div v-else>
          <!-- Class Group Selection -->
          <div class="mb-4 pa-3 bg-surface-200 rounded">
            <div class="d-flex flex-column gap-3">
              <div class="d-flex justify-space-between align-center">
                <h6 class="text-subtitle-1 mb-0">Add Students by Class</h6>
                <VBtn
                  size="small"
                  color="primary"
                  variant="tonal"
                  :loading="loadingClasses"
                  @click="fetchClassGroups"
                >
                  <VIcon start icon="tabler-refresh" />
                  Refresh Classes
                </VBtn>
              </div>
              
              <div class="d-flex gap-3 flex-wrap">
                <VSelect
                  v-model="selectedClassGroup"
                  :items="classGroups"
                  item-title="name"
                  item-value="id"
                  label="Select Class"
                  density="comfortable"
                  variant="outlined"
                  :loading="loadingClasses"
                  :disabled="loadingClasses"
                  style="min-width: 200px; flex: 3"
                  @update:model-value="handleClassGroupChange"
                >
                  <template #selection="{ item }">
                    <div class="d-flex align-center">
                      <VIcon
                        start
                        size="16"
                        icon="tabler-users-group"
                        class="me-1"
                      />
                      {{ item.title }}
                      <VChip
                        size="x-small"
                        color="primary"
                        class="ms-2"
                      >
                        {{ item.raw.studentCount || 0 }} students
                      </VChip>
                    </div>
                  </template>
                </VSelect>
                
                <VBtn
                  color="success"
                  :disabled="!selectedClassGroup || !classGroupStudents.length || classGroupLoading"
                  :loading="assigningClassStudents"
                  @click="assignAllClassStudents"
                >
                  <VIcon start icon="tabler-users-plus" />
                  Assign All
                </VBtn>
              </div>
            </div>
            
            <!-- Class students preview -->
            <div v-if="classGroupLoading" class="d-flex justify-center pa-3">
              <VProgressCircular indeterminate size="24" />
            </div>
            <div v-else-if="classGroupStudents.length && selectedClassGroup" class="mt-3">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-subtitle-2">Students in class:</div>
                <VChip size="small" color="info">{{ classGroupStudents.length }} students</VChip>
              </div>
              <VList density="compact" border class="bg-surface-100 rounded">
                <VListItem
                  v-for="student in classGroupStudents.slice(0, 5)"
                  :key="student.id"
                  :title="student.name"
                  :subtitle="student.email"
                >
                  <template #prepend>
                    <VAvatar size="28" color="info" variant="tonal">
                      <VIcon size="16" icon="tabler-user-circle" />
                    </VAvatar>
                  </template>
                </VListItem>
                <VListItem v-if="classGroupStudents.length > 5">
                  <VListItemTitle class="text-center text-caption">
                    And {{ classGroupStudents.length - 5 }} more students...
                  </VListItemTitle>
                </VListItem>
              </VList>
            </div>
          </div>
          
          <VDivider class="my-4" />
          
          <!-- Individual Student Selection -->
          <h6 class="text-subtitle-1 mb-3">Individual Student Selection</h6>
          <VAutocomplete
            v-model="selectedStudents"
            :items="availableStudents"
            item-title="name"
            item-value="id"
            label="Add Students"
            multiple
            chips
            closable-chips
            density="comfortable"
            variant="outlined"
            class="mb-4"
          >
            <template #selection="{ item }">
              <VChip closable @click:close="removeStudent(item.raw.id)">
                {{ item.raw.name }}
              </VChip>
            </template>
            
            <template #item="{ item, props }">
              <VListItem v-bind="props">
                <template #prepend>
                  <VAvatar size="32" color="info" variant="tonal">
                    <VIcon icon="tabler-user-circle" />
                  </VAvatar>
                </template>
                <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
                <VListItemSubtitle>{{ item.raw.email }}</VListItemSubtitle>
              </VListItem>
            </template>
          </VAutocomplete>
          
          <VDivider class="my-4" />
          
          <!-- Currently Enrolled Students -->
          <div class="d-flex justify-space-between align-center mb-3">
            <h6 class="text-subtitle-1 mb-0">Currently Enrolled Students</h6>
            <VChip size="small" color="primary">
              {{ courseStudents.length }} students
            </VChip>
          </div>
          
          <div v-if="courseStudents.length">
            <VList lines="two" density="compact" border>
              <VListItem
                v-for="student in courseStudents"
                :key="student.id"
                :title="student.name"
                :subtitle="student.email"
              >
                <template #prepend>
                  <VAvatar size="32" color="info" variant="tonal">
                    <VIcon icon="tabler-user-circle" />
                  </VAvatar>
                </template>
                
                <template #append>
                  <VBtn
                    size="small"
                    variant="text"
                    color="error"
                    icon="tabler-trash"
                    @click="removeStudentFromCourse(student.id)"
                  />
                </template>
              </VListItem>
            </VList>
          </div>
          
          <div v-else class="text-center pa-4 bg-surface-100 rounded">
            <VIcon icon="tabler-users-off" size="32" class="mb-2" color="secondary" />
            <p class="text-medium-emphasis">No students enrolled in this course yet</p>
          </div>
        </div>
      </VCardText>
      
      <VDivider />
      
      <VCardActions class="pa-4">
        <VBtn
          color="error"
          variant="tonal"
          @click="removeAllStudents"
        >
          <VIcon start icon="tabler-users-minus" />
          Remove All Students
        </VBtn>
        <VSpacer />
        <VBtn
          color="primary"
          :loading="saving"
          @click="saveChanges"
        >
          Save Changes
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import axiosInstance from '@/utils/axios';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';

// Props and emits
const props = defineProps({
  courseId: { type: String, required: true },
  courseName: { type: String, default: 'Course' },
  open: { type: Boolean, default: false }
});
const emit = defineEmits(['update:open', 'refresh']);

// UI state
const dialogModel = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

// Loading states
const loading = ref(false);
const saving = ref(false);
const loadingClasses = ref(false);
const classGroupLoading = ref(false);
const assigningClassStudents = ref(false);

// Data collections
const availableStudents = ref([]);
const courseStudents = ref([]);
const classGroups = ref([]);
const classGroupStudents = ref([]);

// Selection state
const selectedStudents = ref([]);
const selectedClassGroup = ref(null);

// API operations with unified error handling
const apiOperation = async (method, url, data = null, params = null, successMsg = '') => {
  try {
    const config = { method, url };
    if (data) config.data = data;
    if (params) config.params = params;
    
    const result = await axiosInstance(config);
    
    if (successMsg) toast.success(successMsg);
    return result.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || `Failed to ${method.toLowerCase()} resource`;
    toast.error(errorMsg);
    throw error;
  }
};

// Load data for the component
const loadData = async () => {
  if (!props.courseId) return;
  
  loading.value = true;
  
  try {
    // Fetch course with its students
    const result = await apiOperation('GET', `/course/${props.courseId}`, null, { include: 'students' });
    courseStudents.value = result.data?.students || [];
    selectedStudents.value = courseStudents.value.map(student => student.id);
    
    // Load associated data
    await Promise.all([
      fetchStudents(),
      fetchClassGroups()
    ]);
  } catch (error) {
    console.error('Error loading course data:', error);
    closeDialog();
  } finally {
    loading.value = false;
  }
};

// Student data
const fetchStudents = async () => {
  try {
    const result = await apiOperation('GET', '/user', null, { role: 'STUDENT', limit: 100 });
    availableStudents.value = result.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

// Class group operations
const fetchClassGroups = async () => {
  if (loadingClasses.value) return;
  
  loadingClasses.value = true;
  classGroupStudents.value = [];
  selectedClassGroup.value = null;
  
  try {
    const result = await apiOperation('GET', '/class-group', null, { includes: 'studentCount' });
    classGroups.value = result.data || [];
  } catch (error) {
    console.error('Error fetching class groups:', error);
  } finally {
    loadingClasses.value = false;
  }
};

// Handle class selection
const handleClassGroupChange = async (classId) => {
  if (!classId) {
    classGroupStudents.value = [];
    return;
  }
  
  classGroupLoading.value = true;
  
  try {
    const result = await apiOperation('GET', `/class-group/${classId}`, null, { includes: 'students' });
    classGroupStudents.value = result.data?.students || [];
  } catch (error) {
    console.error('Error fetching class students:', error);
  } finally {
    classGroupLoading.value = false;
  }
};

// Student management functions
const assignAllClassStudents = () => {
  if (!selectedClassGroup.value || !classGroupStudents.value.length) return;
  
  assigningClassStudents.value = true;
  
  try {
    const studentIds = classGroupStudents.value.map(student => student.id);
    selectedStudents.value = [...new Set([...selectedStudents.value, ...studentIds])];
    toast.success(`Added ${studentIds.length} students from the class group`);
  } finally {
    assigningClassStudents.value = false;
  }
};

const removeStudent = (studentId) => {
  selectedStudents.value = selectedStudents.value.filter(id => id !== studentId);
};

const removeStudentFromCourse = removeStudent;

const removeAllStudents = () => {
  selectedStudents.value = [];
  toast.info('All students removed. Click Save Changes to apply.');
};

const saveChanges = async () => {
  saving.value = true;
  
  try {
    await apiOperation(
      'PUT', 
      `/course/${props.courseId}/students`, 
      { studentIds: selectedStudents.value },
      null,
      'Students updated successfully'
    );
    emit('refresh');
    closeDialog();
  } finally {
    saving.value = false;
  }
};

// Dialog management
const closeDialog = () => {
  dialogModel.value = false;
  emit('update:open', false);
};

// Initialize when dialog opens
watch(() => props.open, (isOpen) => {
  if (isOpen && props.courseId) {
    loadData();
  }
}, { immediate: true });
</script>

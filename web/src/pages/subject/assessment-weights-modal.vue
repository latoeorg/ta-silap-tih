<template>
  <VDialog
    v-model="dialogModel"
    max-width="900px"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Manage Assessment Weights: {{ subjectName }}</span>
        <VBtn
          variant="text"
          icon="tabler-x"
          @click="closeDialog"
        />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <!-- Assessment Weights List -->
        <div class="d-flex justify-space-between align-center mb-4">
          <h4 class="text-h6">Assessment Weights</h4>
          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            variant="tonal"
            @click="openAddWeightForm"
          >
            Add Assessment Weight
          </VBtn>
        </div>

        <!-- Weight Form -->
        <div v-if="showForm" class="mb-6 pa-4 bg-surface-200 rounded">
          <h5 class="text-subtitle-1 mb-3">{{ isEditing ? 'Edit' : 'Add New' }} Assessment Weight</h5>
          
          <VForm ref="formRef" @submit.prevent="saveWeight" class="d-flex flex-column gap-4">
            <div class="d-flex flex-wrap gap-4">
              <!-- Exam Type -->
              <VSelect
                v-model="weightForm.examType"
                :items="examTypes"
                label="Exam Type"
                density="comfortable"
                :rules="[v => !!v || 'Exam type is required']"
                style="min-width: 200px; flex: 1"
                clearable
              />
              
              <!-- Weight (Percentage) -->
              <VTextField
                v-model="weightForm.weight"
                type="number"
                label="Weight"
                hint="Enter decimal value between 0 and 1 (e.g., 0.3 = 30%)"
                density="comfortable"
                :rules="[
                  v => !!v || 'Weight is required',
                  v => (v >= 0 && v <= 1) || 'Weight must be between 0 and 1'
                ]"
                step="0.01"
                style="min-width: 150px; flex: 1"
              />
              
              <!-- Quota -->
              <VTextField
                v-model="weightForm.quota"
                type="number"
                label="Quota"
                hint="Number of assessments of this type"
                density="comfortable"
                :rules="[
                  v => !!v || 'Quota is required',
                  v => v > 0 || 'Quota must be greater than 0'
                ]"
                style="min-width: 150px; flex: 1"
              />
            </div>
            
            <div class="d-flex justify-end gap-3">
              <VBtn
                color="secondary"
                variant="tonal"
                @click="cancelForm"
              >
                Cancel
              </VBtn>
              
              <VBtn
                color="primary"
                type="submit"
                :loading="formLoading"
              >
                {{ isEditing ? 'Update' : 'Save' }}
              </VBtn>
            </div>
          </VForm>
        </div>

        <!-- Weights Table -->
        <div v-if="loading" class="d-flex justify-center pa-4">
          <VProgressCircular indeterminate />
        </div>
        
        <VCard v-else-if="weights.length > 0" border>
          <VDataTable
            :headers="weightHeaders"
            :items="weights"
            density="comfortable"
            class="elevation-0"
          >
            <!-- Exam Type -->
            <template #item.examType="{ item }">
              <div class="d-flex align-center">
                <VIcon
                  size="18"
                  :icon="getExamTypeIcon(item.examType)"
                  class="me-2"
                  :color="getExamTypeColor(item.examType)"
                />
                <span>{{ formatExamType(item.examType) }}</span>
              </div>
            </template>
            
            <!-- Weight -->
            <template #item.weight="{ item }">
              <VChip
                color="primary"
                size="small"
                class="text-body-2"
              >
                {{ (item.weight * 100).toFixed(0) }}%
              </VChip>
            </template>
            
            <!-- Quota -->
            <template #item.quota="{ item }">
              <span>{{ item.quota }} assessment(s)</span>
            </template>
            
            <!-- Actions -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-2 justify-end">
                <IconBtn @click="editWeight(item)">
                  <VIcon icon="tabler-edit" />
                  <VTooltip activator="parent">Edit</VTooltip>
                </IconBtn>

                <IconBtn @click="confirmDeleteWeight(item.id)">
                  <VIcon icon="tabler-trash" color="error" />
                  <VTooltip activator="parent">Delete</VTooltip>
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
            <VIcon icon="tabler-info-circle" class="me-2" />
            <span>No assessment weights defined for this subject yet.</span>
          </div>
          <div class="mt-2">
            Click "Add Assessment Weight" to define how student grades will be calculated.
          </div>
        </VAlert>

        <!-- Total Weight Display -->
        <div v-if="weights.length > 0" class="d-flex align-center justify-space-between mt-4">
          <div class="text-subtitle-2">
            Total Weight: 
            <span 
              :class="{
                'text-error': Math.abs(totalWeight - 1) > 0.01, 
                'text-success': Math.abs(totalWeight - 1) <= 0.01
              }"
              class="font-weight-bold"
            >
              {{ (totalWeight * 100).toFixed(0) }}%
            </span>
          </div>
          
          <VAlert
            v-if="Math.abs(totalWeight - 1) > 0.01"
            density="compact"
            type="warning"
            variant="tonal"
            class="text-caption"
          >
            <span v-if="totalWeight < 0.99">
              The total weight should be 100%. You are {{ ((1 - totalWeight) * 100).toFixed(0) }}% short.
            </span>
            <span v-else>
              The total weight exceeds 100% by {{ ((totalWeight - 1) * 100).toFixed(0) }}%. Please adjust.
            </span>
          </VAlert>
        </div>
      </VCardText>

      <VDivider />
      
      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn
          color="secondary"
          variant="tonal"
          @click="closeDialog"
        >
          Close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import axiosInstance from '@/utils/axios';
import { SwalDelete } from '@/utils/sweetalert';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';

// Define props with proper validation
const props = defineProps({
  subjectId: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    default: 'Subject'
  },
  open: {
    type: Boolean,
    default: false
  }
});

// Define emits
const emit = defineEmits(['update:open', 'refresh']);

// Local state
const dialogModel = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const weights = ref([]);
const loading = ref(false);
const formLoading = ref(false);
const showForm = ref(false);
const isEditing = ref(false);
const formRef = ref(null);
const editingWeightId = ref(null);

// Form for weight with default values
const weightForm = ref({
  examType: '',
  weight: 0,
  quota: 1
});

// Reset form
const resetForm = () => {
  weightForm.value = {
    examType: '',
    weight: 0,
    quota: 1
  };
  isEditing.value = false;
  editingWeightId.value = null;
  
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

// Table headers for weights
const weightHeaders = [
  { title: 'Exam Type', key: 'examType', sortable: true },
  { title: 'Weight (%)', key: 'weight', sortable: true },
  { title: 'Quota', key: 'quota', sortable: true },
  { title: 'Created At', key: 'createdAt', sortable: true, formatter: (date) => new Date(date).toLocaleString() },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
];

// Exam types from your actual schema
const examTypes = [
  'DAILY',
  'MID_TERM',
  'FINAL',
  'QUIZ',
  'ASSIGNMENT'
];

// Format exam type for display
const formatExamType = (type) => {
  return type.replace('_', ' ').split(' ')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

// Get icon for exam type
const getExamTypeIcon = (type) => {
  const icons = {
    'DAILY': 'tabler-checkbox',
    'MID_TERM': 'tabler-writing',
    'FINAL': 'tabler-certificate',
    'QUIZ': 'tabler-help-circle',
    'ASSIGNMENT': 'tabler-file-text'
  };
  
  return icons[type] || 'tabler-question-mark';
};

// Get color for exam type
const getExamTypeColor = (type) => {
  const colors = {
    'DAILY': 'info',
    'MID_TERM': 'warning',
    'FINAL': 'error',
    'QUIZ': 'success',
    'ASSIGNMENT': 'primary'
  };
  
  return colors[type] || 'grey';
};

// Calculate total weight - Note: now using decimal values (0-1)
const totalWeight = computed(() => {
  return weights.value.reduce((sum, weight) => sum + parseFloat(weight.weight), 0);
});

// Open add weight form
const openAddWeightForm = () => {
  resetForm();
  showForm.value = true;
};

// Cancel form
const cancelForm = () => {
  showForm.value = false;
  resetForm();
};

// Edit weight
const editWeight = (weight) => {
  weightForm.value = {
    examType: weight.examType,
    weight: weight.weight,
    quota: weight.quota
  };
  
  isEditing.value = true;
  editingWeightId.value = weight.id;
  showForm.value = true;
};

// Save weight (create or update)
const saveWeight = async () => {
  if (!formRef.value) return;
  
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  
  formLoading.value = true;
  
  try {
    const payload = {
      examType: weightForm.value.examType,
      weight: parseFloat(weightForm.value.weight),
      quota: parseInt(weightForm.value.quota, 10),
      subjectId: props.subjectId
    };
    
    if (isEditing.value) {
      await updateWeight(editingWeightId.value, payload);
    } else {
      await createWeight(payload);
    }
    
    showForm.value = false;
    resetForm();
    fetchWeights();
    emit('refresh'); // Refresh parent component data
  } catch (error) {
    console.error('Error saving assessment weight:', error);
  } finally {
    formLoading.value = false;
  }
};

// Create new weight
const createWeight = async (data) => {
  try {
    const result = await axiosInstance({
      method: 'POST',
      url: '/assessment-weight',
      data
    });
    
    toast.success('Assessment weight created successfully');
    return result.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create assessment weight');
    throw error;
  }
};

// Update existing weight
const updateWeight = async (id, data) => {
  try {
    const result = await axiosInstance({
      method: 'PUT',
      url: `/assessment-weight/${id}`,
      data
    });
    
    toast.success('Assessment weight updated successfully');
    return result.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update assessment weight');
    throw error;
  }
};

// Confirm delete weight
const confirmDeleteWeight = async (id) => {
  const confirmed = await SwalDelete({
    title: 'Delete assessment weight?',
    text: 'This weight will be permanently removed from the subject.',
    confirmButtonText: 'Yes, delete it'
  });
  
  if (confirmed) {
    await deleteWeight(id);
  }
};

// Delete weight
const deleteWeight = async (id) => {
  try {
    loading.value = true;
    
    await axiosInstance({
      method: 'DELETE',
      url: `/assessment-weight/${id}`
    });
    
    toast.success('Assessment weight deleted successfully');
    fetchWeights();
    emit('refresh'); // Refresh parent component data
  } catch (error) {
    console.error('Error deleting assessment weight:', error);
    toast.error(error.response?.data?.message || 'Failed to delete assessment weight');
  } finally {
    loading.value = false;
  }
};

// Fetch weights for this subject
const fetchWeights = async () => {
  if (!props.subjectId) return;
  
  loading.value = true;
  
  try {
    const result = await axiosInstance({
      method: 'GET',
      url: '/assessment-weight',
      params: {
        subjectId: props.subjectId,
        _t: new Date().getTime() // Cache busting
      }
    });
    
    weights.value = result.data.data || [];
  } catch (error) {
    console.error('Error fetching assessment weights:', error);
    toast.error('Failed to load assessment weights');
  } finally {
    loading.value = false;
  }
};

// Close dialog
const closeDialog = () => {
  dialogModel.value = false;
  showForm.value = false;
  resetForm();
};

// Watch for open changes to load data
watch(() => props.open, (isOpen) => {
  if (isOpen && props.subjectId) {
    fetchWeights();
  }
});
</script>

<style scoped>
.min-width-100 {
  min-width: 100px;
}
</style>

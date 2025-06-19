<template>
  <VDialog
    v-model="dialogModel"
    max-width="800px"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>{{ title }}</span>
        <VBtn
          variant="text"
          icon="tabler-x"
          @click="closeDialog"
        />
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="loading" class="d-flex justify-center py-8">
          <VProgressCircular indeterminate />
        </div>
        <div v-else>
          <VForm ref="formRef" @submit.prevent="saveComponents">
            <!-- Exam Type Selection -->
            <VSelect
              v-if="!currentExamType"
              v-model="selectedExamType"
              :items="examTypes"
              label="Select Exam Type"
              density="comfortable"
              variant="outlined"
              :rules="[v => !!v || 'Exam type is required']"
              class="mb-4"
            />
            <div v-else class="mb-4">
              <div class="text-subtitle-1">Exam Type: 
                <VChip color="primary" size="small" class="ml-2">{{ currentExamType }}</VChip>
              </div>
              <div class="text-caption text-medium-emphasis">
                Component definitions for this exam type will be applied to all courses
              </div>
            </div>
            
            <!-- Components List -->
            <div class="mb-4">
              <div class="d-flex justify-space-between align-center mb-3">
                <h6 class="text-subtitle-1 mb-0">Grade Components</h6>
                <VBtn
                  size="small"
                  color="primary"
                  prepend-icon="tabler-plus"
                  @click="addComponent"
                >
                  Add Component
                </VBtn>
              </div>
              
              <VAlert
                v-if="components.length === 0"
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <div class="d-flex align-center">
                  <VIcon icon="tabler-info-circle" class="me-2" />
                  <span>No components defined yet.</span>
                </div>
                <div class="mt-2">
                  Click "Add Component" to create your first grading component.
                </div>
              </VAlert>
              
              <div v-else class="table-container">
                <VCard variant="outlined" class="mb-4">
                  <VCardText class="pa-0">
                    <div class="table-wrapper">
                      <VTable density="comfortable" class="grade-components-table">
                        <thead>
                          <tr>
                            <th width="30%" class="text-left">Name</th>
                            <th width="15%" class="text-left">Weight (%)</th>
                            <th width="15%" class="text-left">Max Score</th>
                            <th width="15%" class="text-left">Index</th>
                            <th width="25%" class="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(component, index) in components" :key="index">
                            <td width="30%">
                              <VTextField
                                v-model="component.name"
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="Component name"
                                :rules="[v => !!v || 'Name is required']"
                                class="component-input"
                              />
                            </td>
                            <td width="15%">
                              <VTextField
                                v-model.number="component.weight"
                                type="number"
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="Weight"
                                :rules="[
                                  v => v !== null || 'Weight is required',
                                  v => v > 0 || 'Must be positive',
                                ]"
                                suffix="%"
                                class="component-input"
                                @input="normalizeWeights()"
                              />
                            </td>
                            <td width="15%">
                              <VTextField
                                v-model.number="component.maxScore"
                                type="number"
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="Max score"
                                :rules="[
                                  v => v !== null || 'Score is required',
                                  v => v > 0 || 'Must be positive'
                                ]"
                                class="component-input"
                              />
                            </td>
                            <td width="15%">
                              <VTextField
                                v-model.number="component.index"
                                type="number"
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="Index"
                                :rules="[v => v > 0 || 'Must be positive']"
                                class="component-input"
                              />
                            </td>
                            <td width="25%" class="text-center">
                              <IconBtn @click="removeComponent(index)">
                                <VIcon color="error" icon="tabler-trash" />
                                <VTooltip activator="parent">Remove</VTooltip>
                              </IconBtn>
                            </td>
                          </tr>
                        </tbody>
                      </VTable>
                    </div>
                  </VCardText>
                </VCard>
                
                <!-- Weight Distribution Summary -->
                <div class="weight-distribution mb-4">
                  <div class="d-flex align-center mb-2">
                    <div class="text-subtitle-2 me-2">Weight Distribution:</div>
                    <div class="ms-2 text-subtitle-2" :class="getWeightTotalClass()">
                      {{ totalWeight }}%
                    </div>
                  </div>
                  
                  <div class="progress-container">
                    <VProgressLinear
                      v-model="totalWeight"
                      height="14"
                      :color="totalWeight === 100 ? 'success' : (totalWeight < 100 ? 'warning' : 'error')"
                      :striped="totalWeight !== 100"
                    />
                  </div>
                </div>
                
                <VAlert
                  v-if="totalWeight !== 100"
                  :color="totalWeight < 100 ? 'warning' : 'error'"
                  variant="tonal"
                  class="mb-4"
                  density="compact"
                >
                  <template v-if="totalWeight < 100">
                    <div class="d-flex align-center">
                      <VIcon class="me-2" icon="tabler-alert-triangle" />
                      <span>The total weight is less than 100%.</span>
                    </div>
                    <div class="text-caption mt-1">
                      The remaining weight ({{ 100 - totalWeight }}%) will be unused.
                    </div>
                  </template>
                  <template v-else>
                    <div class="d-flex align-center">
                      <VIcon class="me-2" icon="tabler-alert-circle" />
                      <span>The total weight exceeds 100%.</span>
                    </div>
                    <div class="text-caption mt-1">
                      Please adjust the weights to total exactly 100%.
                    </div>
                  </template>
                </VAlert>
              </div>
            </div>
          </VForm>
        </div>
      </VCardText>

      <VDivider />
      
      <VCardActions class="pa-4">
        <VBtn
          variant="text"
          color="secondary"
          @click="closeDialog"
        >
          Cancel
        </VBtn>
        <VSpacer />
        <VBtn
          color="error"
          variant="tonal"
          class="me-2"
          @click="resetComponents"
          v-if="components.length > 0"
        >
          Reset
        </VBtn>
        <VBtn
          color="primary"
          :loading="saving"
          :disabled="totalWeight > 100"
          @click="saveComponents"
        >
          Save Components
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
  examType: { type: String, default: null },
  modelValue: { type: Boolean, default: false } // Change to use v-model standard
});
const emit = defineEmits(['update:modelValue', 'save']);

// Dialog state
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// UI state
const loading = ref(false);
const saving = ref(false);
const formRef = ref(null);

// Data
const examTypes = ref([
  'DAILY', 'MID_TERM', 'FINAL_TERM', 'ASSIGNMENT', 'PROJECT', 'QUIZ', 'LAB'
]);
const selectedExamType = ref(props.examType);
const currentExamType = computed(() => props.examType || selectedExamType.value);
const components = ref([]);

// Computed
const title = computed(() => {
  return props.examType 
    ? `Edit Grade Components: ${props.examType}` 
    : 'Define Grade Components';
});

const totalWeight = computed(() => {
  if (components.value.length === 0) return 0;
  return components.value.reduce((sum, comp) => sum + (comp.weight || 0), 0);
});

// Methods
const addComponent = () => {
  const nextIndex = components.value.length + 1;
  const defaultWeight = components.value.length === 0 ? 100 : 0;
  
  components.value.push({
    name: `Component ${nextIndex}`,
    weight: defaultWeight,
    maxScore: 100,
    index: nextIndex
  });
};

const removeComponent = (index) => {
  components.value.splice(index, 1);
  // Recalculate indices
  components.value.forEach((comp, idx) => {
    comp.index = idx + 1;
  });
  normalizeWeights();
};

const normalizeWeights = () => {
  // Convert percentage inputs to decimal values in the background
  components.value.forEach(comp => {
    if (comp.weight !== null && comp.weight !== undefined) {
      // Ensure weight is a number
      comp.weight = parseFloat(comp.weight) || 0;
    }
  });
};

const getWeightTotalClass = () => {
  if (totalWeight.value === 100) return 'text-success';
  if (totalWeight.value < 100) return 'text-warning';
  return 'text-error';
};

const resetComponents = () => {
  components.value = [];
};

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

const loadComponents = async () => {
  if (!currentExamType.value) return;
  
  loading.value = true;
  
  try {
    const result = await apiOperation('GET', `/grade-components`, null, { examType: currentExamType.value });
    
    if (result.data && result.data.length > 0) {
      // Format the API response to match our component structure
      components.value = result.data.map(comp => ({
        id: comp.id, // Keep the ID if it exists
        name: comp.name,
        // Convert decimal weights to percentage display
        weight: comp.weight * 100, 
        maxScore: comp.maxScore,
        index: comp.index || 0
      }));
    } else {
      // Set default components if none exist
      resetDefaultComponents();
    }
  } catch (error) {
    console.error('Error loading components:', error);
    resetDefaultComponents();
  } finally {
    loading.value = false;
  }
};

const resetDefaultComponents = () => {
  components.value = [];
  if (currentExamType.value === 'MID_TERM') {
    components.value = [
      { name: 'Written Test', weight: 60, maxScore: 100, index: 1 },
      { name: 'Practical Assignment', weight: 30, maxScore: 50, index: 2 },
      { name: 'Participation', weight: 10, maxScore: 20, index: 3 }
    ];
  } else if (currentExamType.value === 'FINAL_TERM') {
    components.value = [
      { name: 'Final Exam', weight: 50, maxScore: 100, index: 1 },
      { name: 'Project', weight: 30, maxScore: 50, index: 2 },
      { name: 'Presentation', weight: 20, maxScore: 30, index: 3 }
    ];
  } else if (currentExamType.value === 'QUIZ') {
    components.value = [
      { name: 'Quiz 1', weight: 50, maxScore: 20, index: 1 },
      { name: 'Quiz 2', weight: 50, maxScore: 20, index: 2 }
    ];
  } else {
    components.value = [
      { name: 'Component 1', weight: 70, maxScore: 100, index: 1 },
      { name: 'Component 2', weight: 30, maxScore: 50, index: 2 }
    ];
  }
};

const saveComponents = async () => {
  if (!currentExamType.value) {
    toast.error('Please select an exam type');
    return;
  }
  
  if (components.value.length === 0) {
    toast.error('Please add at least one component');
    return;
  }
  
  if (totalWeight.value > 100) {
    toast.error('Total weight exceeds 100%. Please adjust the weights.');
    return;
  }
  
  if (!formRef.value) return;
  
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  
  saving.value = true;
  
  try {
    // Format data to match the backend schema
    const componentsData = components.value.map(comp => ({
      name: comp.name,
      // Convert percentage to decimal for storage
      weight: parseFloat(comp.weight) / 100,
      maxScore: parseInt(comp.maxScore),
      index: parseInt(comp.index) || 0,
      id: comp.id // Include ID if it exists
    }));
    
    const result = await apiOperation('POST', '/grade-components/define', {
      examType: currentExamType.value,
      components: componentsData
    }, null, 'Grade components saved successfully');
    
    // Add this line to refresh the component data after saving
    if (result.data) {
      await loadComponents();
    }
    
    emit('save');
    closeDialog();
  } catch (error) {
    console.error('Error saving components:', error);
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  emit('update:modelValue', false);
  components.value = [];
  selectedExamType.value = null;
};

// Watchers
watch(() => dialogModel.value, (isOpen) => {
  if (isOpen) {
    loadComponents();
  }
});

// Watch for exam type changes from parent
watch(() => props.examType, (newExamType) => {
  if (newExamType) {
    selectedExamType.value = newExamType;
  }
});
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.grade-components-table {
  min-width: 700px;
  table-layout: fixed;
}

.component-input {
  width: 100%;
}

.table-container {
  width: 100%;
}

.weight-distribution {
  width: 100%;
}

.progress-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>



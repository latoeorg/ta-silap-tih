<template>
  <VNavigationDrawer
    :model-value="open"
    temporary
    location="end"
    width="400"
    :scrim="false"
    @update:model-value="$emit('handle-close', $event)"
  >
    <VCard class="h-100 rounded-0">
      <VCardText class="d-flex justify-space-between align-center">
        <h3 class="text-h5">{{ isEditing ? 'Edit Subject' : 'Add Subject' }}</h3>
        <VBtn
          variant="text"
          icon="tabler-x"
          @click="$emit('handle-close', false)"
        />
      </VCardText>
      
      <VDivider />
      
      <VCardText class="mt-5">
        <VForm @submit.prevent="handleSubmit" ref="formRef">
          <!-- Subject Name -->
          <VTextField
            v-model="form.name"
            label="Subject Name"
            placeholder="e.g., Mathematics, Science, History"
            :rules="[v => !!v || 'Subject name is required']"
          />
          
          
          <div class="mt-8 d-flex justify-end">
            <VBtn
              color="secondary"
              variant="tonal"
              class="me-4"
              @click="$emit('handle-close', false)"
              :disabled="loading"
            >
              Cancel
            </VBtn>

            <VBtn
              color="primary"
              type="submit"
              :loading="loading"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VNavigationDrawer>
</template>

<script setup>
import axiosInstance from '@/utils/axios';
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  editId: {
    type: String,
    default: null
  }
});

// Add refresh emit event
const emit = defineEmits(['handle-close', 'refresh']);

const formRef = ref(null);
const loading = ref(false);
const form = ref({
  name: '',
  description: ''
});

// Reset form when drawer opens/closes
watch(() => props.open, (newValue) => {
  if (newValue && props.isEditing && props.editId) {
    fetchSubjectData();
  } else if (newValue) {
    resetForm();
  }
});

const resetForm = () => {
  form.value = {
    name: '',
    description: ''
  };
  
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const fetchSubjectData = async () => {
  loading.value = true;
  
  try {
    const result = await axiosInstance({
      method: 'GET',
      url: `/subject/${props.editId}`
    });
    
    const data = result.data.data;
    
    form.value = {
      name: data.name || '',
      description: data.description || ''
    };
  } catch (error) {
    console.error('Failed to fetch subject data:', error);
    toast.error('Failed to load subject data');
    emit('handle-close', false);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  const { valid } = await formRef.value.validate();
  
  if (!valid) return;
  
  loading.value = true;
  
  try {
    if (props.isEditing) {
      await updateSubject();
    } else {
      await createSubject();
    }
    
    // Emit refresh event to update the table
    emit('refresh');
    
    // Close the drawer
    emit('handle-close', false);
  } catch (error) {
    console.error('Form submission error:', error);
  } finally {
    loading.value = false;
  }
};

const createSubject = async () => {
  try {
    const result = await axiosInstance({
      method: 'POST',
      url: '/subject',
      data: form.value
    });
    
    toast.success('Subject created successfully');
    return result.data;
  } catch (error) {
    console.error('Failed to create subject:', error);
    toast.error(error.response?.data?.message || 'Failed to create subject');
    throw error;
  }
};

const updateSubject = async () => {
  try {
    const result = await axiosInstance({
      method: 'PUT',
      url: `/subject/${props.editId}`,
      data: form.value
    });
    
    toast.success('Subject updated successfully');
    return result.data;
  } catch (error) {
    console.error('Failed to update subject:', error);
    toast.error(error.response?.data?.message || 'Failed to update subject');
    throw error;
  }
};
</script>

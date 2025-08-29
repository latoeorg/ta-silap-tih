<template>
  <VNavigationDrawer
    :model-value="open"
    temporary
    location="end"
    width="500"
    :scrim="false"
    class="modern-drawer"
    @update:model-value="$emit('handleClose', $event)"
  >
    <div class="drawer-content">
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-info">
          <div class="header-icon">
            <VIcon 
              :icon="isEditing ? 'tabler-edit' : 'tabler-plus'" 
              size="24"
            />
          </div>
          <div class="header-text">
            <h3 class="header-title">
              {{ isEditing ? 'Edit Jurusan' : 'Tambah Jurusan Baru' }}
            </h3>
            <p class="header-subtitle">
              {{ isEditing ? 'Perbarui informasi jurusan' : 'Buat jurusan baru untuk sistem akademik' }}
            </p>
          </div>
        </div>
        
        <VBtn
          variant="text"
          icon="tabler-x"
          size="small"
          class="close-btn"
          @click="$emit('handleClose', false)"
        />
      </div>
      
      <VDivider />
      
      <!-- Form Content -->
      <div class="form-container">
        <VForm
          ref="formRef"
          class="subject-form"
          @submit.prevent="handleSubmit"
        >
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <VIcon
                icon="tabler-info-circle"
                class="section-icon"
              />
              <h4 class="section-title">
                Informasi Dasar
              </h4>
            </div>
            
            <div class="form-fields">
              <!-- Subject Name -->
              <div class="field-group">
                <VTextField
                  v-model="form.name"
                  label="Nama Jurusan"
                  placeholder="Contoh: IPA, IPS, Bahasa"
                  variant="outlined"
                  density="comfortable"
                  :rules="nameRules"
                  :error-messages="errors.name"
                  prepend-inner-icon="tabler-book-2"
                  class="modern-field"
                  clearable
                >
                  <template #details>
                    <div class="field-hint">
                      <VIcon
                        icon="tabler-info-circle"
                        size="12"
                        class="me-1"
                      />
                      Masukkan nama jurusan yang akan digunakan dalam sistem
                    </div>
                  </template>
                </VTextField>
              </div>
              
              <!-- Description (Optional) -->
              <div class="field-group">
                <VTextarea
                  v-model="form.description"
                  label="Deskripsi (Opsional)"
                  placeholder="Deskripsi singkat tentang jurusan ini..."
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  max-rows="5"
                  :rules="descriptionRules"
                  :error-messages="errors.description"
                  prepend-inner-icon="tabler-file-text"
                  class="modern-field"
                  clearable
                  counter="500"
                >
                  <template #details>
                    <div class="field-hint">
                      <VIcon
                        icon="tabler-info-circle"
                        size="12"
                        class="me-1"
                      />
                      Deskripsi akan membantu membedakan jurusan satu dengan lainnya
                    </div>
                  </template>
                </VTextarea>
              </div>
            </div>
          </div>
          
          <!-- Preview Section (when editing) -->
          <div
            v-if="isEditing && subjectPreview"
            class="form-section preview-section"
          >
            <div class="section-header">
              <VIcon
                icon="tabler-eye"
                class="section-icon"
              />
              <h4 class="section-title">
                Pratinjau Perubahan
              </h4>
            </div>
            
            <VCard
              variant="outlined"
              class="preview-card"
            >
              <VCardText>
                <div class="preview-item">
                  <span class="preview-label">Nama Jurusan:</span>
                  <div class="preview-comparison">
                    <span class="preview-old">{{ subjectPreview.oldName }}</span>
                    <VIcon
                      icon="tabler-arrow-right"
                      size="16"
                      class="preview-arrow"
                    />
                    <span class="preview-new">{{ form.name || 'Tidak diisi' }}</span>
                  </div>
                </div>
                
                <div class="preview-item">
                  <span class="preview-label">Deskripsi:</span>
                  <div class="preview-comparison">
                    <span class="preview-old">{{ subjectPreview.oldDescription || 'Tidak ada' }}</span>
                    <VIcon
                      icon="tabler-arrow-right"
                      size="16"
                      class="preview-arrow"
                    />
                    <span class="preview-new">{{ form.description || 'Tidak ada' }}</span>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </div>
        </VForm>
      </div>
      
      <!-- Footer Actions -->
      <div class="drawer-footer">
        <div class="footer-info">
          <VIcon
            icon="tabler-info-circle"
            size="14"
            class="me-1"
          />
          <span class="footer-text">
            {{ isEditing ? 'Perubahan akan tersimpan setelah menekan tombol Update' : 'Data akan langsung tersimpan setelah dibuat' }}
          </span>
        </div>
        
        <div class="footer-actions">
          <VBtn
            variant="outlined"
            color="grey"
            prepend-icon="tabler-x"
            :disabled="loading"
            class="cancel-btn"
            @click="$emit('handleClose', false)"
          >
            Batal
          </VBtn>

          <VBtn
            color="primary"
            :prepend-icon="isEditing ? 'tabler-check' : 'tabler-plus'"
            :loading="loading"
            :disabled="!isFormValid"
            class="submit-btn"
            @click="handleSubmit"
          >
            {{ isEditing ? 'Update Jurusan' : 'Buat Jurusan' }}
          </VBtn>
        </div>
      </div>
    </div>
    
    <!-- Loading Overlay -->
    <div
      v-if="initialLoading"
      class="loading-overlay"
    >
      <div class="loading-content">
        <VProgressCircular
          indeterminate
          size="48"
          color="primary"
        />
        <p class="loading-text">
          Memuat data jurusan...
        </p>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<script setup>
import axiosInstance from '@/utils/axios'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  editId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['handleClose', 'refresh'])

// Reactive state
const formRef = ref(null)
const loading = ref(false)
const initialLoading = ref(false)
const errors = ref({})
const subjectPreview = ref(null)

const form = ref({
  name: '',
  description: '',
})

// Form validation rules
const nameRules = [
  v => !!v || 'Nama jurusan wajib diisi',
  v => (v && v.length >= 2) || 'Nama jurusan minimal 2 karakter',
  v => (v && v.length <= 100) || 'Nama jurusan maksimal 100 karakter',
  v => (v && /^[a-zA-Z0-9\s\-_]+$/.test(v)) || 'Nama jurusan hanya boleh mengandung huruf, angka, spasi, dan tanda hubung',
]

const descriptionRules = [
  v => !v || v.length <= 500 || 'Deskripsi maksimal 500 karakter',
]

// Computed properties
const isFormValid = computed(() => {
  return form.value.name && form.value.name.length >= 2 && !Object.keys(errors.value).length
})

// Watchers
watch(() => props.open, newValue => {
  if (newValue) {
    if (props.isEditing && props.editId) {
      fetchSubjectData()
    } else {
      resetForm()
    }
  } else {
    // Clear form when drawer closes
    setTimeout(() => {
      resetForm()
    }, 300) // Wait for animation to complete
  }
})

// Watch form changes for real-time validation
watch(() => form.value.name, () => {
  validateField('name')
})

watch(() => form.value.description, () => {
  validateField('description')
})

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
  }
  
  errors.value = {}
  subjectPreview.value = null
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const validateField = fieldName => {
  const value = form.value[fieldName]
  let fieldErrors = []
  
  if (fieldName === 'name') {
    if (!value) fieldErrors.push('Nama jurusan wajib diisi')
    else if (value.length < 2) fieldErrors.push('Nama jurusan minimal 2 karakter')
    else if (value.length > 100) fieldErrors.push('Nama jurusan maksimal 100 karakter')
    else if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) fieldErrors.push('Nama jurusan hanya boleh mengandung huruf, angka, spasi, dan tanda hubung')
  } 

  // eslint-disable-next-line sonarjs/no-collapsible-if
  else if (fieldName === 'description') {
    if (value && value.length > 500) fieldErrors.push('Deskripsi maksimal 500 karakter')
  }
  
  if (fieldErrors.length > 0) {
    errors.value[fieldName] = fieldErrors
  } else {
    delete errors.value[fieldName]
  }
}

const fetchSubjectData = async () => {
  initialLoading.value = true
  
  try {
    const result = await axiosInstance({
      method: 'GET',
      url: `/subject/${props.editId}`,
    })
    
    const data = result.data.data
    
    // Store original data for preview
    subjectPreview.value = {
      oldName: data.name || '',
      oldDescription: data.description || '',
    }
    
    form.value = {
      name: data.name || '',
      description: data.description || '',
    }
  } catch (error) {
    console.error('Failed to fetch subject data:', error)
    toast.error('Gagal memuat data jurusan')
    emit('handleClose', false)
  } finally {
    initialLoading.value = false
  }
}

const handleSubmit = async () => {
  // Validate all fields
  validateField('name')
  validateField('description')
  
  if (!isFormValid.value) {
    toast.error('Mohon perbaiki kesalahan pada form')
    
    return
  }
  
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  
  if (!valid) {
    toast.error('Mohon perbaiki kesalahan pada form')
    
    return
  }
  
  loading.value = true
  
  try {
    if (props.isEditing) {
      await updateSubject()
      toast.success('Jurusan berhasil diperbarui')
    } else {
      await createSubject()
      toast.success('Jurusan berhasil dibuat')
    }
    
    // Emit refresh event to update the table
    emit('refresh')
    
    // Close the drawer
    emit('handleClose', false)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    loading.value = false
  }
}

const createSubject = async () => {
  try {
    const result = await axiosInstance({
      method: 'POST',
      url: '/subject',
      data: {
        name: form.value.name.trim(),
        description: form.value.description?.trim() || null,
      },
    })
    
    return result.data
  } catch (error) {
    console.error('Failed to create subject:', error)
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      toast.error('Jurusan dengan nama tersebut sudah ada')
    } else if (error.response?.status === 400) {
      toast.error(error.response?.data?.message || 'Data yang dimasukkan tidak valid')
    } else {
      toast.error('Gagal membuat jurusan. Silakan coba lagi.')
    }
    
    throw error
  }
}

const updateSubject = async () => {
  try {
    const result = await axiosInstance({
      method: 'PUT',
      url: `/subject/${props.editId}`,
      data: {
        name: form.value.name.trim(),
        description: form.value.description?.trim() || null,
      },
    })
    
    return result.data
  } catch (error) {
    console.error('Failed to update subject:', error)
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      toast.error('Jurusan dengan nama tersebut sudah ada')
    } else if (error.response?.status === 400) {
      toast.error(error.response?.data?.message || 'Data yang dimasukkan tidak valid')
    } else if (error.response?.status === 404) {
      toast.error('Jurusan tidak ditemukan')
    } else {
      toast.error('Gagal memperbarui jurusan. Silakan coba lagi.')
    }
    
    throw error
  }
}
</script>

<style scoped>
.modern-drawer {
  overflow: hidden;
  border-radius: 16px 0 0 16px;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  block-size: 100%;
}

/* Header Styles */
.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  border-block-end: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.header-info {
  display: flex;
  flex: 1;
  gap: 16px;
}

.header-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  block-size: 48px;
  color: rgb(var(--v-theme-primary));
  inline-size: 48px;
}

.header-text {
  flex: 1;
}

.header-title {
  color: rgb(var(--v-theme-on-surface));
  font-size: 1.375rem;
  font-weight: 600;
  margin-block-end: 4px;
}

.header-subtitle {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.875rem;
  line-height: 1.4;
}

.close-btn {
  margin-block-start: 4px;
}

/* Form Container */
.form-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.subject-form {
  block-size: 100%;
}

/* Form Sections */
.form-section {
  margin-block-end: 32px;
}

.form-section:last-child {
  margin-block-end: 0;
}

.section-header {
  display: flex;
  align-items: center;
  border-block-end: 2px solid rgba(var(--v-theme-primary), 0.1);
  gap: 12px;
  margin-block-end: 20px;
  padding-block-end: 12px;
}

.section-icon {
  padding: 8px;
  border-radius: 8px;
  color: rgb(var(--v-theme-primary));
}

.section-title {
  margin: 0;
  color: rgb(var(--v-theme-primary));
  font-size: 1.125rem;
  font-weight: 600;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field-group {
  position: relative;
}

.modern-field {
  border-radius: 12px;
}

.field-hint {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.75rem;
  margin-block-start: 8px;
}

/* Preview Section */
.preview-section {
  padding: 20px;
  border: 1px solid rgba(var(--v-theme-secondary), 0.1);
  border-radius: 12px;
}

.preview-card {
  border-radius: 8px;
}

.preview-item {
  margin-block-end: 16px;
}

.preview-item:last-child {
  margin-block-end: 0;
}

.preview-label {
  display: block;
  color: rgba(var(--v-theme-on-surface), 0.8);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-block-end: 8px;
  text-transform: uppercase;
}

.preview-comparison {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.preview-old {
  border-radius: 6px;
  color: rgb(var(--v-theme-error));
  font-size: 0.875rem;
  padding-block: 6px;
  padding-inline: 12px;
  text-decoration: line-through;
}

.preview-new {
  border-radius: 6px;
  color: rgb(var(--v-theme-success));
  font-size: 0.875rem;
  font-weight: 500;
  padding-block: 6px;
  padding-inline: 12px;
}

.preview-arrow {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

/* Footer */
.drawer-footer {
  padding: 24px;
  backdrop-filter: blur(8px);
  border-block-start: 1px solid rgba(var(--v-border-color), 0.12);
}

.footer-info {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border-inline-start: 4px solid rgb(var(--v-theme-info));
  margin-block-end: 16px;
}

.footer-text {
  color: rgba(var(--v-theme-on-surface), 0.8);
  font-size: 0.75rem;
  line-height: 1.4;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  border-radius: 8px;
}

.submit-btn {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.2);
}

.submit-btn:hover {
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.3);
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  inset: 0;
}

.loading-content {
  padding: 24px;
  text-align: center;
}

.loading-text {
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.875rem;
  margin-block-start: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .drawer-header {
    padding: 20px;
  }
  
  .header-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .header-icon {
    block-size: 40px;
    inline-size: 40px;
  }
  
  .header-title {
    font-size: 1.25rem;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .drawer-footer {
    padding: 20px;
  }
  
  .footer-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-btn, .submit-btn {
    justify-content: center;
    inline-size: 100%;
  }
  
  .preview-comparison {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style>

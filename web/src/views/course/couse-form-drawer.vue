<template>
  <VNavigationDrawer
    :model-value="open"
    temporary
    location="end"
    width="560"
    :scrim="false"
    class="assignment-drawer"
    @update:model-value="$emit('handleClose', $event)"
  >
    <div class="drawer-wrapper">
      <!-- Enhanced Header -->
      <div class="drawer-header">
        <div class="header-content">
          <div class="header-badge">
            <VIcon
              :icon="isEditing ? 'tabler-edit' : 'tabler-plus'"
              :color="isEditing ? 'warning' : 'primary'"
              size="20"
            />
          </div>
          
          <div class="header-text">
            <h2 class="header-title">
              {{ isEditing ? 'Edit Penugasan' : 'Penugasan Baru' }}
            </h2>
            <p class="header-description">
              {{ isEditing ? 'Perbarui penugasan mata pelajaran kepada guru' : 'Tetapkan mata pelajaran kepada guru yang sesuai' }}
            </p>
          </div>
        </div>

        <VBtn
          variant="text"
          icon="tabler-x"
          size="small"
          class="close-btn"
          @click="handleClose"
        />
      </div>

      <!-- Progress Indicator (for multi-step feel) -->
      <div class="progress-section">
        <VProgressLinear
          :model-value="formProgress"
          color="primary"
          height="3"
          rounded
        />
        <div class="progress-text">
          {{ Math.round(formProgress) }}% lengkap
        </div>
      </div>

      <!-- Form Content -->
      <VScrollArea class="form-scroll-area">
        <div class="form-content">
          <VForm
            ref="formRef"
            v-model="formValid"
            class="assignment-form"
            @submit.prevent="handleSubmit"
          >
            <!-- Subject Information Card -->
            <VCard
              variant="outlined"
              class="info-card subject-card"
              :class="{ 'card-filled': name }"
            >
              <VCardTitle class="card-title">
                <VIcon
                  icon="tabler-book-2"
                  class="title-icon"
                />
                Mata Pelajaran
              </VCardTitle>
              
              <VCardText class="card-content">
                <VTextField
                  v-model="name"
                  label="Nama Mata Pelajaran"
                  placeholder="Masukkan nama mata pelajaran"
                  variant="outlined"
                  density="comfortable"
                  :rules="subjectNameRules"
                  :error-messages="fieldErrors.name"
                  class="enhanced-field"
                  clearable
                  counter="100"
                  @blur="validateField('name')"
                  @input="onFieldChange"
                >
                  <template #prepend-inner>
                    <VIcon
                      icon="tabler-book-2"
                      size="20"
                      :color="name ? 'primary' : 'disabled'"
                    />
                  </template>
                  
                  <template #append-inner>
                    <VTooltip
                      text="Nama mata pelajaran yang akan diajarkan"
                      location="top"
                    >
                      <template #activator="{ props }">
                        <VIcon
                          v-bind="props"
                          icon="tabler-help-circle"
                          size="18"
                          color="disabled"
                        />
                      </template>
                    </VTooltip>
                  </template>
                </VTextField>

                <!-- Subject Suggestions -->
                <div
                  v-if="!name && subjectSuggestions.length"
                  class="suggestions-section"
                >
                  <p class="suggestions-title">
                    <VIcon
                      icon="tabler-lightbulb"
                      size="16"
                      class="me-1"
                    />
                    Saran mata pelajaran:
                  </p>
                  <div class="suggestion-chips">
                    <VChip
                      v-for="suggestion in subjectSuggestions"
                      :key="suggestion"
                      variant="outlined"
                      size="small"
                      class="suggestion-chip"
                      @click="name = suggestion"
                    >
                      {{ suggestion }}
                    </VChip>
                  </div>
                </div>
              </VCardText>
            </VCard>

            <!-- Teacher Assignment Card -->
            <VCard
              variant="outlined"
              class="info-card teacher-card"
              :class="{ 'card-filled': teacherId }"
            >
              <VCardTitle class="card-title">
                <VIcon
                  icon="tabler-user-check"
                  class="title-icon"
                />
                Penugasan Guru
              </VCardTitle>
              
              <VCardText class="card-content">
                <!-- Teacher Selection -->
                <VSelect
                  v-if="availableTeachers.length"
                  v-model="teacherId"
                  :items="availableTeachers"
                  item-title="name"
                  item-value="id"
                  label="Pilih Guru"
                  placeholder="Pilih guru untuk mata pelajaran ini"
                  variant="outlined"
                  density="comfortable"
                  :rules="teacherIdRules"
                  :error-messages="fieldErrors.teacherId"
                  class="enhanced-field"
                  clearable
                  @update:model-value="onFieldChange"
                >
                  <template #prepend-inner>
                    <VIcon
                      icon="tabler-user-check"
                      size="20"
                      :color="teacherId ? 'success' : 'disabled'"
                    />
                  </template>

                  <template #selection="{ item }">
                    <div class="selected-teacher">
                      <VAvatar
                        size="24"
                        color="primary"
                        class="me-2"
                      >
                        <span class="text-caption">
                          {{ getTeacherInitials(item.raw.name) }}
                        </span>
                      </VAvatar>
                      <div class="teacher-info">
                        <span class="teacher-name">{{ item.raw.name }}</span>
                        <span class="teacher-email">{{ item.raw.email }}</span>
                      </div>
                    </div>
                  </template>

                  <template #item="{ item, props: itemProps }">
                    <VListItem
                      v-bind="itemProps"
                      class="teacher-item"
                    >
                      <template #prepend>
                        <VAvatar
                          size="32"
                          color="primary"
                          variant="tonal"
                        >
                          <span class="text-caption font-weight-bold">
                            {{ getTeacherInitials(item.raw.name) }}
                          </span>
                        </VAvatar>
                      </template>
                      
                      <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
                      <VListItemSubtitle>{{ item.raw.email }}</VListItemSubtitle>
                      
                      <template #append>
                        <VChip
                          color="success"
                          variant="tonal"
                          size="x-small"
                        >
                          {{ item.raw.role }}
                        </VChip>
                      </template>
                    </VListItem>
                  </template>
                </VSelect>

                <!-- Fallback: Manual Teacher ID Input -->
                <VTextField
                  v-else
                  v-model="teacherId"
                  label="ID Guru"
                  placeholder="Masukkan ID guru (sementara manual)"
                  variant="outlined"
                  density="comfortable"
                  :rules="teacherIdRules"
                  :error-messages="fieldErrors.teacherId"
                  class="enhanced-field"
                  clearable
                  @blur="validateField('teacherId')"
                  @input="onFieldChange"
                >
                  <template #prepend-inner>
                    <VIcon
                      icon="tabler-id-badge"
                      size="20"
                      :color="teacherId ? 'warning' : 'disabled'"
                    />
                  </template>
                </VTextField>

                <!-- Info Alert -->
                <VAlert
                  v-if="!availableTeachers.length"
                  variant="tonal"
                  type="info"
                  density="compact"
                  class="mt-3"
                >
                  <template #prepend>
                    <VIcon icon="tabler-info-circle" />
                  </template>
                  Saat ini menggunakan input manual. Nantinya akan terintegrasi dengan data guru.
                </VAlert>
              </VCardText>
            </VCard>

            <!-- Assignment Summary (when editing) -->
            <VCard
              v-if="isEditing && currentAssignment"
              variant="outlined"
              class="info-card summary-card"
            >
              <VCardTitle class="card-title">
                <VIcon
                  icon="tabler-eye"
                  class="title-icon"
                />
                Ringkasan Perubahan
              </VCardTitle>
              
              <VCardText class="card-content">
                <div class="comparison-grid">
                  <div class="comparison-item">
                    <div class="comparison-label">
                      Mata Pelajaran
                    </div>
                    <div class="comparison-values">
                      <VChip
                        color="error"
                        variant="outlined"
                        size="small"
                        class="old-value"
                      >
                        {{ currentAssignment.name }}
                      </VChip>
                      <VIcon
                        icon="tabler-arrow-right"
                        size="16"
                        class="comparison-arrow"
                      />
                      <VChip
                        color="success"
                        variant="outlined"
                        size="small"
                        class="new-value"
                      >
                        {{ name || 'Belum diisi' }}
                      </VChip>
                    </div>
                  </div>

                  <div class="comparison-item">
                    <div class="comparison-label">
                      Guru
                    </div>
                    <div class="comparison-values">
                      <VChip
                        color="error"
                        variant="outlined"
                        size="small"
                        class="old-value"
                      >
                        {{ currentAssignment.teacherId }}
                      </VChip>
                      <VIcon
                        icon="tabler-arrow-right"
                        size="16"
                        class="comparison-arrow"
                      />
                      <VChip
                        color="success"
                        variant="outlined"
                        size="small"
                        class="new-value"
                      >
                        {{ getSelectedTeacherName() || teacherId || 'Belum dipilih' }}
                      </VChip>
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VForm>
        </div>
      </VScrollArea>

      <!-- Enhanced Footer -->
      <div class="drawer-footer">
        <div class="footer-content">
          <!-- Validation Summary -->
          <div class="validation-summary">
            <div class="validation-item">
              <VIcon
                :icon="name ? 'tabler-check' : 'tabler-circle'"
                :color="name ? 'success' : 'disabled'"
                size="16"
              />
              <span :class="name ? 'text-success' : 'text-disabled'">
                Nama mata pelajaran
              </span>
            </div>
            
            <div class="validation-item">
              <VIcon
                :icon="teacherId ? 'tabler-check' : 'tabler-circle'"
                :color="teacherId ? 'success' : 'disabled'"
                size="16"
              />
              <span :class="teacherId ? 'text-success' : 'text-disabled'">
                Guru ditugaskan
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <VBtn
              variant="outlined"
              color="default"
              :disabled="loading"
              @click="handleClose"
            >
              <VIcon
                start
                icon="tabler-x"
              />
              Batal
            </VBtn>

            <VBtn
              color="primary"
              :loading="loading"
              :disabled="!canSubmit"
              @click="handleSubmit"
            >
              <VIcon
                start
                :icon="isEditing ? 'tabler-device-floppy' : 'tabler-plus'"
              />
              {{ isEditing ? 'Simpan Perubahan' : 'Buat Penugasan' }}
            </VBtn>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <VOverlay
      v-model="initialLoading"
      class="loading-overlay"
      contained
    >
      <div class="loading-content">
        <VProgressCircular
          indeterminate
          size="56"
          width="4"
          color="primary"
        />
        <p class="loading-text">
          {{ isEditing ? 'Memuat data penugasan...' : 'Menyiapkan form...' }}
        </p>
      </div>
    </VOverlay>
  </VNavigationDrawer>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps({
  open: { type: Boolean, required: true },
  subjectId: { type: String, default: '' },
})

const emit = defineEmits(['handleClose', 'refresh'])

// Refs
const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)
const initialLoading = ref(false)
const fieldErrors = ref({})

// Get teacher list from Vuex store
const availableTeachers = computed(() => store.state.course.list_teacher)

const subjectSuggestions = ref([
  'Matematika',
  'Fisika',
  'Kimia',
  'Biologi', 
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Sejarah',
])

// Store integration (replace with actual Vuex store)
const store = useVuex()

// Computed properties
const isEditing = computed(() => store.state.course.is_update)
const currentAssignment = computed(() => store.state.course.currentAssignment)

const name = computed({
  get: () => store.state.course.form.name || '',
  set: value => store.commit('course/SET_FORM', { key: 'name', value }),
})

const teacherId = computed({
  get: () => store.state.course.form.teacherId || '',
  set: value => store.commit('course/SET_FORM', { key: 'teacherId', value }),
})

// Form validation
const subjectNameRules = [
  v => !!v || 'Nama mata pelajaran wajib diisi',
  v => (v && v.length >= 2) || 'Minimal 2 karakter',
  v => (v && v.length <= 100) || 'Maksimal 100 karakter',
  v => !v || /^[\p{L}0-9\s\-_.]+$/u.test(v) || 'Hanya huruf, angka, spasi, dan tanda hubung',
]

const teacherIdRules = [
  v => !!v || 'Guru wajib dipilih atau diisi',
  v => (v && v.length >= 3) || 'Minimal 3 karakter',
]

// Progress calculation
const formProgress = computed(() => {
  let progress = 0
  if (name.value && name.value.length >= 2) progress += 50
  if (teacherId.value && teacherId.value.length >= 3) progress += 50
  
  return progress
})

const canSubmit = computed(() => {
  return formValid.value && name.value && teacherId.value && !loading.value
})

// Utility functions
const getTeacherInitials = name => {
  return name?.split(' ')?.map(word => word[0])?.join('')?.toUpperCase()?.slice(0, 2)
}

const getSelectedTeacherName = () => {
  const teacher = availableTeachers.value.find(t => t.id === teacherId.value)
  
  return teacher?.name
}

const validateField = fieldName => {
  const value = fieldName === 'name' ? name.value : teacherId.value
  const rules = fieldName === 'name' ? subjectNameRules : teacherIdRules
  
  const errors = []

  rules.forEach(rule => {
    const result = rule(value)
    if (result !== true) errors.push(result)
  })
  
  if (errors.length) {
    fieldErrors.value[fieldName] = errors
  } else {
    delete fieldErrors.value[fieldName]
  }
}

const onFieldChange = () => {
  nextTick(() => {
    // Clear errors when user starts typing
    if (name.value) delete fieldErrors.value.name
    if (teacherId.value) delete fieldErrors.value.teacherId
  })
}

// Event handlers
const handleClose = () => {
  store.commit('course/RESET_FORM')
  emit('handleClose', false)
}

const handleSubmit = async () => {
  // Validate all fields
  validateField('name')
  validateField('teacherId')
  
  const { valid } = await formRef.value?.validate?.() ?? { valid: false }
  
  if (!valid || Object.keys(fieldErrors.value).length > 0) {
    toast.error('Mohon lengkapi semua field yang diperlukan')
    
    return
  }

  loading.value = true
  try {
    let result = false
    if (isEditing.value) {
      result = await store.dispatch('course/update', { 
        id: store.state.course.is_update,
      })
      if (result) toast.success('Penugasan berhasil diperbarui!')
    } else {
      result = await store.dispatch('course/create')
      if (result) toast.success('Penugasan baru berhasil dibuat!')
    }
    if (result) {
      emit('refresh')
      emit('handleClose', false)
    }
  } catch (error) {
    console.error('Form submission error:', error)
    toast.error(isEditing.value ? 'Gagal memperbarui penugasan' : 'Gagal membuat penugasan')
  } finally {
    loading.value = false
  }
}

// Watch for prop changes
watch(
  () => props.subjectId,
  newVal => {
    if (newVal) {
      store.commit('course/SET_FORM', { key: 'subjectId', value: newVal })
    }
  },
  { immediate: true },
)

watch(
  () => props.open,
  isOpen => {
    if (isOpen) {
      // Reset errors when opening
      fieldErrors.value = {}
      
      // Focus on first field
      nextTick(() => {
        const firstField = document.querySelector('.assignment-form input')

        firstField?.focus()
      })
    }
  },
)
</script>

<style scoped>
.drawer-wrapper {
  display: flex;
  flex-direction: column;
  block-size: 100vh;
}

/* Header */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
}

.header-content {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 16px;
}

.header-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 48px;
  inline-size: 48px;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  margin-block: 0 4px;
  margin-inline: 0;
}

.header-description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.close-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
}

/* Progress Section */
.progress-section {
  padding-block: 16px;
  padding-inline: 24px;
}

.progress-text {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.75rem;
  margin-block-start: 8px;
  text-align: center;
}

/* Form Content */
.form-scroll-area {
  flex: 1;
  padding: 0;
}

.form-content {
  padding: 24px;
}

.assignment-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Info Cards */
.info-card {
  border: 1px solid rgb(var(--v-border-color));
  transition: all 0.3s ease;
}

.info-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.1);
}

.card-filled {
  border-color: rgba(var(--v-theme-primary), 0.4);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  gap: 8px;
  padding-block: 16px 8px;
  padding-inline: 16px;
}

.title-icon {
  color: rgb(var(--v-theme-primary));
}

.card-content {
  padding-block: 0 16px;
  padding-inline: 16px;
}

/* Suggestions */
.suggestions-section {
  padding: 12px;
  border-radius: 8px;
  margin-block-start: 12px;
}

.suggestions-title {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  margin-block: 0 8px;
  margin-inline: 0;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  border-color: rgb(var(--v-theme-primary));
}

/* Teacher Selection */
.selected-teacher {
  display: flex;
  align-items: center;
  inline-size: 100%;
}

.teacher-info {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
}

.teacher-name {
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher-email {
  overflow: hidden;
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.teacher-item {
  padding-block: 8px !important;
  padding-inline: 12px !important;
}

/* Comparison Grid */
.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comparison-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comparison-label {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.875rem;
  font-weight: 500;
}

.comparison-values {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/* Footer */
.drawer-footer {
  padding: 24px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.validation-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.validation-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  gap: 8px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Loading */
.loading-overlay {
  backdrop-filter: blur(2px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.loading-text {
  margin: 0;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .drawer-wrapper {
    inline-size: 100vw !important;
  }
  
  .header-content {
    gap: 12px;
  }
  
  .header-badge {
    block-size: 40px;
    inline-size: 40px;
  }
  
  .form-content {
    padding: 16px;
  }
  
  .drawer-footer {
    padding: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>

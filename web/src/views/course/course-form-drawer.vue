<template>
  <VNavigationDrawer
    :model-value="open"
    temporary
    location="end"
    width="560"
    :scrim="false"
    class="course-drawer"
    @update:model-value="$emit('handleClose', $event)"
  >
    <div class="drawer-wrapper">
      <div class="drawer-header">
        <div class="header-content">
          <div class="header-badge">
            <VIcon
              :icon="isUpdate ? 'tabler-edit' : 'tabler-plus'"
              :color="isUpdate ? 'warning' : 'primary'"
              size="20"
            />
          </div>
          
          <div class="header-text">
            <h2 class="header-title">
              {{ isUpdate ? 'Edit Kursus' : 'Kursus Baru' }}
            </h2>
            <p class="header-description">
              {{ isUpdate ? 'Perbarui detail kursus' : 'Buat kursus baru dengan menetapkan subjek dan pengajar' }}
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

      <VScrollArea class="form-scroll-area">
        <div class="form-content">
          <VForm
            ref="formRef"
            v-model="formValid"
            class="course-form"
            @submit.prevent="handleSubmit"
          >
            <VCard
              variant="outlined"
              class="info-card"
              :class="{ 'card-filled': name }"
            >
              <VCardTitle class="card-title">
                <VIcon
                  icon="tabler-info-circle"
                  class="title-icon"
                />
                Detail Kursus
              </VCardTitle>
              <VCardText class="card-content">
                <VTextField
                  v-model="name"
                  label="Nama Kursus"
                  placeholder="Contoh: Matematika XII IPA 1"
                  :rules="rules.name"
                  clearable
                >
                  <template #prepend-inner>
                    <VIcon
                      icon="tabler-bookmark"
                      size="20"
                      :color="name ? 'primary' : 'disabled'"
                    />
                  </template>
                </VTextField>
              </VCardText>
            </VCard>

            <VCard
              variant="outlined"
              class="info-card"
              :class="{ 'card-filled': subjectId }"
            >
              <VCardTitle class="card-title">
                <VIcon
                  icon="tabler-book-2"
                  class="title-icon"
                />
                Subjek
              </VCardTitle>
              <VCardText class="card-content">
                <VSelect
                  v-model="subjectId"
                  :items="list_subject"
                  item-title="name"
                  item-value="id"
                  label="Pilih Subjek"
                  placeholder="Pilih subjek yang akan diajarkan"
                  :rules="rules.subjectId"
                  clearable
                >
                  <template #prepend-inner>
                    <VIcon
                      icon="tabler-book-2"
                      size="20"
                      :color="subjectId ? 'primary' : 'disabled'"
                    />
                  </template>
                </VSelect>
              </VCardText>
            </VCard>

            <VCard
              variant="outlined"
              class="info-card"
              :class="{ 'card-filled': teacherId }"
            >
              <VCardTitle class="card-title">
                <VIcon
                  icon="tabler-user-check"
                  class="title-icon"
                />
                Pengajar
              </VCardTitle>
              <VCardText class="card-content">
                <VSelect
                  v-model="teacherId"
                  :items="list_teacher"
                  item-title="name"
                  item-value="id"
                  label="Pilih Pengajar"
                  placeholder="Tugaskan seorang pengajar untuk kursus ini"
                  :rules="rules.teacherId"
                  clearable
                >
                  <template #prepend-inner>
                    <VIcon
                      icon="tabler-user-check"
                      size="20"
                      :color="teacherId ? 'success' : 'disabled'"
                    />
                  </template>

                  <template #selection="{ item }">
                    <div class="d-flex align-center gap-2">
                      <VAvatar
                        size="24"
                        color="primary"
                        class="me-2"
                      >
                        <span class="text-caption">{{ getInitials(item.raw.name) }}</span>
                      </VAvatar>
                      <span>{{ item.raw.name }}</span>
                    </div>
                  </template>

                  <template #item="{ item, props: itemProps }">
                    <VListItem v-bind="itemProps">
                      <template #prepend>
                        <VAvatar
                          size="32"
                          color="primary"
                          variant="tonal"
                        >
                          <span class="text-caption font-weight-bold">{{ getInitials(item.raw.name) }}</span>
                        </VAvatar>
                      </template>
                    </VListItem>
                  </template>
                </VSelect>
              </VCardText>
            </VCard>
          </VForm>
        </div>
      </VScrollArea>

      <div class="drawer-footer">
        <div class="footer-content">
          <div />
          <div class="action-buttons">
            <VBtn
              variant="outlined"
              :disabled="loading"
              @click="handleClose"
            >
              Batal
            </VBtn>
            <VBtn
              :loading="loading"
              :disabled="!canSubmit"
              @click="handleSubmit"
            >
              <VIcon
                start
                :icon="isUpdate ? 'tabler-device-floppy' : 'tabler-plus'"
              />
              {{ isUpdate ? 'Simpan' : 'Buat Kursus' }}
            </VBtn>
          </div>
        </div>
      </div>
    </div>

    <VOverlay
      v-model="loading"
      class="align-center justify-center"
      contained
    >
      <VProgressCircular
        indeterminate
        size="56"
        color="primary"
      />
    </VOverlay>
  </VNavigationDrawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps({
  open: { type: Boolean, required: true },
})

const emit = defineEmits(['handleClose'])

// --- Store and State Management ---
const store = useVuex()
const formRef = ref(null)
const formValid = ref(false)

// Computed properties to sync with Vuex store
const isUpdate = computed(() => store.state.course.is_update)
const loading = computed(() => store.state.course.loading.form)
const list_subject = computed(() => store.state.course.list_subject)
const list_teacher = computed(() => store.state.course.list_teacher)

const name = computed({
  get: () => store.state.course.form.name || '',
  set: val => store.commit('course/SET_FORM', { key: 'name', value: val }),
})

const subjectId = computed({
  get: () => store.state.course.form.subjectId || '',
  set: val => store.commit('course/SET_FORM', { key: 'subjectId', value: val }),
})

const teacherId = computed({
  get: () => store.state.course.form.teacherId || '',
  set: val => store.commit('course/SET_FORM', { key: 'teacherId', value: val }),
})

// --- Validation ---
const rules = {
  name: [v => !!v || 'Nama kursus wajib diisi', v => (v && v.length) >= 3 || 'Minimal 3 karakter'],
  subjectId: [v => !!v || 'Subjek wajib dipilih'],
  teacherId: [v => !!v || 'Pengajar wajib dipilih'],
}

// --- UI Logic ---
const formProgress = computed(() => {
  let progress = 0
  if (name.value) progress += 33.3
  if (subjectId.value) progress += 33.3
  if (teacherId.value) progress += 33.4
  
  return progress
})

const validationSummary = computed(() => [
  { key: 'name', label: 'Nama Kursus', valid: !!name.value },
  { key: 'subjectId', label: 'Subjek Dipilih', valid: !!subjectId.value },
  { key: 'teacherId', label: 'Pengajar Ditugaskan', valid: !!teacherId.value },
])

const canSubmit = computed(() => formValid.value && !loading.value)

const getInitials = name => {
  return name?.split(' ')?.map(word => word[0])?.join('')?.toUpperCase()?.slice(0, 2)
}

// --- Event Handlers ---
const handleClose = () => {
  emit('handleClose', false)
}

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) {
    toast.error('Mohon lengkapi semua field yang diperlukan.')
    
    return
  }

  const action = isUpdate.value ? 'course/update' : 'course/create'
  const success = await store.dispatch(action)

  if (success) {
    toast.success(`Kursus berhasil ${isUpdate.value ? 'diperbarui' : 'dibuat'}.`)
    handleClose()
  }
}

// --- Watchers ---
// Reset form state when the drawer is closed
watch(() => props.open, isOpen => {
  if (!isOpen) {
    // Delay reset to allow closing animation
    setTimeout(() => {
      store.commit('course/RESET_FORM')
      store.commit('course/SET_IS_UPDATE', false)
      formRef.value?.resetValidation()
    }, 300)
  }
})
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
  border-radius: 8px;
  block-size: 40px;
  inline-size: 40px;
}

.header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.header-description {
  margin: 0;
  font-size: 0.875rem;
}

/* Progress */
.progress-section {
  padding-block: 16px;
  padding-inline: 24px;
}

.progress-text {
  font-size: 0.75rem;
  margin-block-start: 8px;
  text-align: end;
}

/* Form */
.form-scroll-area {
  flex: 1;
}

.form-content {
  padding-block: 0 24px;
  padding-inline: 24px;
}

.course-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Cards */
.info-card {
  transition: all 0.2s ease-in-out;
}

.info-card:focus-within {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  gap: 8px;
  padding-block: 12px;
  padding-inline: 16px;
}

.card-content {
  padding-block: 0 16px;
  padding-inline: 16px;
}

/* Footer */
.drawer-footer {
  padding-block: 16px;
  padding-inline: 24px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.validation-summary {
  display: flex;
  gap: 16px;
}

.validation-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  gap: 6px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}
</style>

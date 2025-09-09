<template>
  <VDialog
    v-model="dialogModel"
    max-width="1000px"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Kelola Siswa Course</span>
        <VBtn
          variant="text"
          icon="tabler-x"
          @click="closeDialog"
        />
      </VCardTitle>

      <VDivider />

      <UserDataTable
        v-model:model-value="selected"
        title=""
        show-select
        hide-add-button
        hide-actions
        role="STUDENT"
      />

      <VDivider />

      <VCardActions class="py-3 gap-4">
        <VSpacer />
        <!-- cancel button -->
        <VBtn
          variant="ghost"
          @click="closeDialog"
        >
          <VIcon
            icon="tabler-x"
            start
          />
          Batal
        </VBtn>

        <VBtn
          :loading="isLoading"
          variant="flat"
          @click="handleSave"
        >
          <VIcon
            icon="tabler-check"
            start
          />
          Simpan
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import UserDataTable from '@/views/user/user-data-table.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  courseId: { type: String, default: '' },
})

const emit = defineEmits(['update:open', 'refresh'])

// Local state for loading and selection
const isLoading = ref(false)
const selected = ref([])
const store = useVuex()

// Watcher to sync props to local state when dialog opens
watch(() => props.open, isOpen => {
  if (isOpen && props.courseId) {
    store.dispatch('course/getStudentIds', props.courseId)
      .then(studentIds => {
        selected.value = studentIds
        console.log('course studentIds', studentIds)
      })
  }
})

// Dialog state
const dialogModel = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const closeDialog = () => {
  emit('update:open', false)
}

// Save handler
const handleSave = async () => {
  isLoading.value = true
  try {
    const success = await store.dispatch('course/updateStudents', {
      courseId: props.courseId,
      studentIds: selected.value,
    })

    if (success) {
      // If the API call is successful, emit refresh to the parent and close the dialog
      emit('refresh')
      store.dispatch('course/getCourse', props.courseId)
      closeDialog()
      window.location.reload() // Force reload to update the student list in the parent component
    }
  } catch (error) {
    // Error is already handled by toast in the Vuex action
    console.error("Failed to save course students:", error)
  } finally {
    isLoading.value = false
  }
}
</script>
